require("dotenv").config();
const cloudinary = require("cloudinary");
const path = require("path");
const MB = 3;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const filesPayLoadExist = (req, res, next) => {
  try {
    if (!req.files) {
      throw { code: 400, message: "Missing files" };
    }
    next();
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const fileSizeLimiter = (req, res, next) => {
  try {
    if (!req.files) {
      next();
    } else {
      const files = req.files;

      const filesOverLimit = [];
      // Which files are over the limit?
      Object.keys(files).forEach((key) => {
        if (files[key].size > FILE_SIZE_LIMIT) {
          filesOverLimit.push(files[key].name);
        }
      });

      if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? "are" : "is";

        const sentence =
          `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
            ",",
            ", "
          );

        const message =
          filesOverLimit.length < 3
            ? sentence.replace(",", " and")
            : sentence.replace(/,(?=[^,]*$)/, " and");

        //   return res.status(413).json({ status: 'error', message })
        throw { code: 413, message };
      }

      next();
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    if (!req.files) {
      next();
    } else {
      const files = req.files;

      const fileExtensions = [];
      Object.keys(files).forEach((key) => {
        fileExtensions.push(path.extname(files[key].name));
      });

      const allowed = fileExtensions.every((ext) =>
        allowedExtArray.includes(ext)
      );

      if (!allowed) {
        const message =
          `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
            ",",
            ", "
          );

        return res.status(422).json({ status: "error", message });
      }

      next();
    }
  };
};

const fileExtOnly = (req, res, next) => {
  if (!req.files) {
    next();
  }

  const allowed = ["png", "jpg", "jpeg", "webp"];
  let files = req.files.product_picture;
  files = Array.isArray(files) ? files : [files];
  let getType = [];
  let getExt = [];

  for (let i = 0; i < files.length; i++) {
    getType.push(files[i].mimetype.split("/")[0]);
    getExt.push(files[i].mimetype.split("/")[1]);
  }

  let count = 0;
  // let temp = [];

  for (let i = 0; i < allowed.length; i++) {
    for (let j = 0; j < getExt.length; j++) {
      if (allowed[i] == getExt[j].toLowerCase()) {
        count++;
        // temp.push(getExt[j]);
      }
    }
  }
  // console.log(temp);
  // console.log(count);
  // console.log(getExt.length);

  if (getExt.length > 5) {
    const message = `Upload failed. Only 5 photos allowed.`;

    return res.status(422).json({ status: "error", message });
  }

  if (count !== getExt.length) {
    const message = `Upload failed. Only ${allowed
      .toString()
      .toUpperCase()} files allowed.`.replaceAll(",", ", ");

    return res.status(422).json({ status: "error", message });
  }

  next();
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  filesPayLoadExist,
  fileSizeLimiter,
  fileExtLimiter,
  fileExtOnly,
  cloudinary,
};
