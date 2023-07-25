module.exports = {
  isExist: async (schema, match) => {
    if (schema.isNew) {
      // This is a new document, so we can use findOne to check if the value already exists in the collection
      const doc = await schema.constructor.findOne(match);

      if (doc) {
        // The value already exists in the collection
        return false;
      }
    } else {
      match["_id"] = { $ne: schema._id };
      // This is an existing document, so we need to exclude the current document from the findOne query
      const doc = await schema.constructor.findOne(match);
      if (doc) {
        // The value already exists in the collection, but it's the current document, so the validation passes
        return true;
      }
    }
    // The value does not exist in the collection
    return true;
  },
  isValidEmail: (email) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  },
};
