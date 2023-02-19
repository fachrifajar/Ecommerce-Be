const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const getProductValidator = (req, res, next) => {
  extend("regexSize", () => {
    if (/^(xs|s|m|l|xl)$/i.test(req.query.sizeFilter)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexColor", () => {
    if (/^(black|white|red|gray|cream|blue)$/i.test(req.query.colorFilter)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexOrderBy", () => {
    if (/^(popular|sold)$/i.test(req.query.orderBy)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexCategory", () => {
    if (
      /^(tshirt|shirt|shorts|outwear|pants|footwear|bag|headwear)$/i.test(
        req.query.categoryFilter
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "sizeFilter.regexSize": `Please enter a valid size using the format: XS,S,M,L,XL. Sizes cannot be duplicated and must be separated by commas with no spaces. Example: 'XS,S,M,L,XL'`,
    "colorFilter.regexColor": `Invalid color input. Please enter one or more of the following colors: black, white, red, gray, cream, blue, separated by commas and cannot be duplicated.`,
    "orderBy.regexOrderBy": `Please enter a valid orderBY. Example: 'popular' / 'sold'`,
    "categoryFilter.regexCategory": `Invalid color input. Please enter one or more of the following category: tshirt, shirt, shorts, outwear, pants, footwear, bag, headwear`,
  });

  const rules = new Validator(req.query, {
    colorFilter: "regexColor",
    sizeFilter: "regexSize",
    orderBy: "regexOrderBy",
    categoryFilter: "regexCategory",
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
    product_name: "required|minLength:3|maxLength:30",
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

const updateProductValidator = (req, res, next) => {
  const {
    product_name,
    price,
    qty,
    color,
    category,
    size,
    brand,
    condition,
    description,
  } = req.body;

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
    product_name:
      product_name == ""
        ? "required|alphaNumeric|minLength:3|maxLength:30"
        : "alphaNumeric|minLength:3|maxLength:30",
    price: price == "" ? "required|integer" : "integer",
    qty: qty == "" ? "required|integer" : "integer",
    color: color == "" ? "required|regexColor" : "regexColor",
    category: category == "" ? "required|regexCategory" : "regexCategory",
    size: size == "" ? "required|regexSize" : "regexSize",
    brand: brand == "" ? "required|maxLength:20" : "maxLength:20",
    condition: condition == "" ? "required|regexCondition" : "regexCondition",
    description: description == "" ? "required|maxLength:100" : "maxLength:100",
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
  updateProductValidator,
  deleteUsersValidator,
  getProductValidator,
};
