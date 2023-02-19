const models = require("../models/checkout");
const { v4: uuidv4 } = require("uuid");
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");

const addCheckout = async (req, res) => {
  try {
    const {
      products_id,
      color,
      size,
      qty,
      product_name,
      store_name,
      total_est,
    } = req.body;

    const idValidator = req.users_id;
    const getData = await models.getAllProductById({ id: products_id });

    if (!getData.length) {
      throw { code: 400, message: "Products_id not identified" };
    }

    const getStoreName = getData[0]?.store_name;
    const getProductName = getData[0]?.product_name;
    const getPrice = getData[0]?.price;
    const getTotal = parseInt(getPrice) * qty;

    const getColor = getData[0].color;
    const getSize = getData[0].size;

    let colorChecker = [];
    let sizeChecker = [];
    for (let i = 0; i < getColor.length; i++) {
      if (getColor[i] == color) {
        colorChecker.push(getColor[i]);
      }
    }

    for (let i = 0; i < getSize.length; i++) {
      if (getSize[i] == size) {
        sizeChecker.push(getSize[i]);
      }
    }

    if (colorChecker.length !== [color].length) {
      throw {
        code: 400,
        message: `please only pick available colors: ${getColor}`,
      };
    }

    if (sizeChecker.length !== [size].length) {
      throw {
        code: 400,
        message: `please only pick available colors: ${getSize}`,
      };
    }

    await models.addCheckout({
      products_id,
      color,
      size,
      qty,
      product_name: getProductName,
      store_name: getStoreName,
      total_est: getTotal,
      users_id: idValidator,
    });

    res.status(201).json({
      code: 201,
      message: `Success add Checkout for users_id: ${idValidator} `,
      data: req.body,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

module.exports = {
  addCheckout,
};
