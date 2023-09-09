const Instructor = require("../../instructor/instructor.model");
const DataAccess = require("../../DataAccess");
const TryCatch = require("../../utils/tryCatch");
const mongoose = require("mongoose");
const multer = require("multer");
const dir = require("../../constants");
const bcrypt = require("bcrypt");
const path = require("path")//;
const fs = require("fs");//

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) uploadError = null;
    cb(null, "src/public/uploads/");
  },
  filename: (req, file, cb) => {
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage });

module.exports = {
  UpdateUser: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const result = await DataAccess.UpdateOne(Instructor, id, data);
    if (!result) {
      return res.status(500).json({ message: "Error updating User Info" });
    }
    return res.status(200).json({ message: "Successfully update user info" });
  }),
  ChangePassword: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const hashPassword = await bcrypt.hashSync(data.password, 12);
    const result = await DataAccess.UpdateOne(Instructor, id, {
      password: hashPassword,
    });
    if (!result)
      return res.status(500).json({ message: "Error updating password" });

    return res.status(200).json({ message: "Succesfully update password" });
  }),
  uploadImage: TryCatch(async (req, res) => {
    const id = req.params.id;
    // const file = req;
    // console.log(file);
    // if (!file)
    //   return res.status(400).send({ message: "No image in the request" });

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object Id." });
    let user = await DataAccess.FindOne(Instructor, { _id: id });

    if (!user)
      return res.status(404).json({ message: "Instructor info not found." });

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error uploading image", error: err.message });
      }

      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

      imagePath = path.join(basePath, fileName);
      const prevImagePath = `${dir}/public/uploads/${user.image.filename}`;
      fs.access(prevImagePath, fs.F_OK, (err) => {
        if (err) {
          console.error(err);
          return;
        }

        fs.unlink(prevImagePath, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        //file exists
      });
      const image = {
        image: {
          filename: fileName,
          path: imagePath,
        },
      };
      const result = DataAccess.UpdateOne(Instructor, id, image);
      if (!result) return res.status(500).json({ message: "Upload failed" });

      return res
        .status(200)
        .json({ message: "Upload successfully", imagePath: imagePath });
    });
  }),
};
