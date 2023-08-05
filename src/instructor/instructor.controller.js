const bycrypt = require("bcrypt");
const multer = require("multer");
const TryCatch = require("../utils/tryCatch");
const path = require("path");
const fs = require("fs");
const dir = require("../constants");
const {
  CreateOne,
  UpdateOne,
  FindAll,
  FindOne,
  DeleteOne,
} = require("../DataAccess");

const Instructor = require("./instructor.model");
const { default: mongoose } = require("mongoose");
const saltRound = 10;
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
  post: TryCatch(async (req, res) => {
    const data = req.body;
    data["password"] =
      data.password !== undefined
        ? await bycrypt.hashSync(data.password, saltRound)
        : "";
    const result = await CreateOne(Instructor, data);
    if (!result)
      return res.status(500).json({ message: "Error saving Instructor info" });

    return res.status(200).json({ message: "Instructor registered " });
  }),
  put: TryCatch(async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const result = await UpdateOne(Instructor, id, data);

    if (!result.acknowledged)
      return res
        .status(500)
        .json({ message: "Error updating Instructor info" });
    return res.status(200).json({ message: "Successfully updated" });
  }),
  remove: TryCatch(async (req, res) => {
    const id = req.params.id;

    const result = await DeleteOne(Instructor, id);
    if (!result)
      return res.status(500).json({ message: "Error in deleting Instructor." });

    return res.status(200).json({ message: "Instructor removed successfully" });
  }),
  get: TryCatch(async (req, res) => {
    const filter = req.query;
    const id = req.params.id;
    let result = mongoose.isValidObjectId(id)
      ? await FindOne(Instructor, id)
      : await FindAll(Instructor, filter);

    if (!result) res.status(500).json({ message: "Instructor info not found" });
    return res.status(200).json(result);
  }),

  changePassword: TryCatch(async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    data.password = await bycrypt.hashSync(data.password, saltRound);
  }),
  uploadImage: TryCatch(async (req, res) => {
    const id = req.params.id;
    const file = req.file;
    // if (!file) return res.status(400).send("No image in the request");

    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid object Id." });
    let Instructor = await FindOne(Instructor, id);

    if (!Instructor)
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
      const prevImagePath = `${dir}/public/uploads/${Instructor.image.filename}`;
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
      const result = UpdateOne(Instructor, id, image);
      if (!result) return res.status(500).json({ message: "Upload failed" });

      return res.status(200).json({ message: "Upload successfully" });
    });
  }),
};
