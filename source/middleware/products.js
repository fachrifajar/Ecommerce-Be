const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const addProductvalidator = (req, res, next) => {
  extend("regexSize", () => {
    if (/^(XS|S|M|L|XL)(,(?!.*,\1)(XS|S|M|L|XL)){0,4}$/i.test(req.body.size)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexColor", () => {
    const mandatoryWords = ["black", "white", "red", "gray", "cream", "blue"];
    const regex = new RegExp(
      `^(${mandatoryWords.join("|")})(,(${mandatoryWords.join("|")})){0,5}$`,
      "i"
    );
    if (regex.test(req.body.color)) {
      const colors = req.body.color.toLowerCase().split(",");
      if (new Set(colors).size === colors.length) {
        return true;
      }
    }
    return false;
  });

  extend("regexCondition", () => {
    if (/^(new|used)$/i.test(req.body.condition)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexCategory", () => {
    if (
      /^(tshirt|shirt|shorts|outwear|pants|footwear|bag|headwear)$/i.test(
        req.body.category
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "size.regexSize": `Please enter a valid size using the format: XS,S,M,L,XL. Sizes cannot be duplicated and must be separated by commas with no spaces. Example: 'XS,S,M,L,XL'`,
    "color.regexColor": `Invalid color input. Please enter one or more of the following colors: black, white, red, gray, cream, blue, separated by commas and cannot be duplicated.`,
    "condition.regexCondition": `Please enter a valid contion. Example: 'used' / 'new'`,
    "category.regexCategory": `Invalid color input. Please enter one or more of the following category: tshirt, shirt, shorts, outwear, pants, footwear, bag, headwear`,
  });

  const rules = new Validator(req.body, {
    product_name: "required|alphaNumeric|minLength:3|maxLength:30",
    price: "required|integer",
    qty: "required|integer",
    color: "required|regexColor",
    category: "required|regexCategory",
    size: "required|regexSize",
    brand: "required|maxLength:20",
    condition: "required|regexCondition",
    description: "required|maxLength:100",
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
  addProductvalidator,
  updateUsersPartialValidator,
  deleteUsersValidator,
};
