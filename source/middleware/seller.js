const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const createUsersSellerValidator = (req, res, next) => {
  extend("namePassswordValidator", () => {
    if (req.body.username !== req.body.password) {
      return true;
    }
    return false;
  });

  extend("regexUsername", () => {
    if (/^[a-zA-Z0-9\s+]+$/g.test(req.body.username)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexStorename", () => {
    if (/^[a-zA-Z]+[a-zA-Z0-9\s]*$/g.test(req.body.store_name)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexPass", () => {
    if (
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
        req.body.password
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "username.namePassswordValidator": `Password can't contain username`,
    "password.regexUsername": `Username can only contain Alphanumeric / Alphabetical Characters`,
    "password.regexPass": `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
    "store_name.regexStorename": `Storename can only contain Alphabetical & Numbers`,
  });

  const rules = new Validator(req.body, {
    email: "required|email|minLength:3|maxLength:100",
    username:
      "required|minLength:5|maxLength:25|regexUsername|namePassswordValidator",
    password: "required|regexPass|minLength:8|maxLength:20",
    phone_number: "required|integer|minLength:10|maxLength:15",
    store_name: "required|minLength:8|maxLength:30|regexStorename",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(422).json({
        message: rules.errors,
      });
    }
  });
};

const updateUsersPartialValidator = (req, res, next) => {
  const { store_name, email, phone_number, description, profile_picture } =
    req.body;

  extend("regexStorename", () => {
    if (/^[a-zA-Z]+[a-zA-Z0-9\s]*$/g.test(req.body.store_name)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "store_name.regexStorename": `Storename can only contain Alphabetical & Numbers`,
  });

  const rules = new Validator(req.body, {
    email:
      email == ""
        ? "required|email|minLength:3|maxLength:30"
        : "email|minLength:3|maxLength:20",
    phone_number:
      phone_number == ""
        ? "required|integer|minLength:7|maxLength:15"
        : "integer|minLength:7|maxLength:15",
    profile_picture: profile_picture == "" ? "required" : "minLength:1",
    store_name:
      store_name == ""
        ? "required|minLength:8|maxLength:30|regexStorename"
        : "minLength:8|maxLength:30|regexStorename",
    description:
      description == ""
        ? "required|minLength:10|maxLength:100"
        : "minLength:10|maxLength:100",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(422).json({
        message: rules.errors,
      });
    }
  });
};

const deleteUsersValidator = (req, res, next) => {
  const { id } = req.params;

  const rules = new Validator(req.params, {
    id: "required",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(422).json({
        message: rules.errors,
      });
    }
  });
};

module.exports = {
  createUsersSellerValidator,
  updateUsersPartialValidator,
  deleteUsersValidator,
};
