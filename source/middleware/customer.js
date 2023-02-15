const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const addAddressValidator = (req, res, next) => {
  extend("regexTypeOfAddress", () => {
    if (/^(home|office)$/i.test(req.body.type_of_address)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexPrimaryAddress", () => {
    if (/^(1|0)$/.test(req.body.primary_address)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "type_of_address.regexTypeOfAddress": `Only accept "home" / "office"`,
    "primary_address.regexPrimaryAddress": `Only accept 1, thats mean primary. if dont want to set primary_address, please uncheck this (primary_address) form.`,
  });
  //password: 'required|regexPass|minLength:8|maxLength:20',
  const rules = new Validator(req.body, {
    type_of_address: "required|regexTypeOfAddress|minLength:4|maxLength:20",
    recipient_name: "required|minLength:5|maxLength:25",
    recipient_phone_number: "required|integer|minLength:8|maxLength:20",
    address: "required|minLength:8|maxLength:100",
    postal_code: "required|integer|minLength:5|maxLength:6",
    city: "required",
    primary_address: "regexPrimaryAddress",
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

const createUsersCustValidator = (req, res, next) => {
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
    "password.regexUsername": `Username can only contain Alphanumeric Characters`,
    "password.regexPass": `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
  });
  //password: 'required|regexPass|minLength:8|maxLength:20',
  const rules = new Validator(req.body, {
    email: "required|email|minLength:3|maxLength:100",
    username:
      "required|minLength:5|maxLength:25|regexUsername|namePassswordValidator",
    password: "required|regexPass|minLength:8|maxLength:20",
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
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    date_of_birth,
    gender,
    address,
  } = req.body;

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

  extend("regexDOB", () => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    const regex1 = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
    const regex2 = new RegExp(
      `^(19|20)\\d\\d[-](${months.join("|")})[-](0[1-9]|[12][0-9]|3[01])$`,
      "i"
    );

    if (
      regex1.test(req.body.date_of_birth) ||
      regex2.test(req.body.date_of_birth)
    ) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexGender", () => {
    let regex = /^(male|female)$/i;

    if (regex.test(req.body.gender)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "username.namePassswordValidator": `Password can't contain username`,
    "username.regexUsername": `Username can only contain Alphabetical OR Alphanumeric Characters`,
    "password.regexPass": `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
    "date_of_birth.regexDOB": `Using ISO format (yyyy-mm-dd) / (yyyy-months in words-dd) is a mandatory`,
    "gender.regexGender": `Male / Female only`,
  });

  const rules = new Validator(req.body, {
    email:
      email == ""
        ? "required|email|minLength:3|maxLength:100"
        : "email|minLength:3|maxLength:100",
    phone_number:
      phone_number == ""
        ? "required|phoneNumber|minLength:7|maxLength:14"
        : "phoneNumber|minLength:7|maxLength:12",
    username:
      username == ""
        ? "required|minLength:5|maxLength:25|regexUsername|namePassswordValidator"
        : "minLength:5|maxLength:25|regexUsername|namePassswordValidator",
    password:
      password == ""
        ? "required|regexPass|minLength:8|maxLength:20"
        : "regexPass|minLength:8|maxLength:20",
    date_of_birth: date_of_birth == "" ? "required|regexDOB" : "regexDOB",
    gender: gender == "" ? "required|regexGender" : "regexGender",
    address: address == "" ? "required|minLength:10" : "minLength:10",
    profile_picture: profile_picture == "" ? "required|url" : "url",
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

const updateAddressValidator = (req, res, next) => {
  const {
    type_of_address,
    recipient_name,
    recipient_phone_number,
    address,
    postal_code,
    city,
    primary_address,
  } = req.body;

  extend("regexTypeOfAddress", () => {
    if (/^(home|office)$/i.test(req.body.type_of_address)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexPrimaryAddress", () => {
    if (/^(1|0)$/i.test(req.body.primary_address)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "type_of_address.regexTypeOfAddress": `Only accept "home" / "office"`,
    "primary_address.regexPrimaryAddress": `Only accept 1, thats mean primary. if dont want to set primary_address, please uncheck this (primary_address) form.`,
  });

  const rules = new Validator(req.body, {
    type_of_address:
      type_of_address == ""
        ? "required|regexTypeOfAddress|minLength:4|maxLength:20"
        : "regexTypeOfAddress|minLength:4|maxLength:20",
    recipient_name:
      recipient_name == ""
        ? "required|minLength:5|maxLength:25"
        : "minLength:5|maxLength:25",
    recipient_phone_number:
      recipient_phone_number == ""
        ? "required|integer|minLength:8|maxLength:20"
        : "integer|minLength:8|maxLength:20",
    address:
      address == ""
        ? "required|minLength:8|maxLength:100"
        : "minLength:8|maxLength:100",
    postal_code:
      postal_code == ""
        ? "required|integer|minLength:5|maxLength:6"
        : "integer|minLength:5|maxLength:6",
    city: city == "" ? "required|maxLength:20" : "maxLength:20",
    primary_address:
      primary_address == ""
        ? "required|regexPrimaryAddress"
        : "regexPrimaryAddress",
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
  createUsersCustValidator,
  updateUsersPartialValidator,
  deleteUsersValidator,
  addAddressValidator,
  updateAddressValidator,
};
