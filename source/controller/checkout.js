const models = require("../models/checkout");

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
    const getPicture = getData[0]?.products_picture[0]?.product_picture;
    const getQty = getData[0]?.qty;
    const getColor = getData[0].color;
    const getSize = getData[0].size;
    const getItemSoldCount = getData[0]?.item_sold_count;

    if (getQty <= 0) {
      throw {
        code: 400,
        message: `${getProductName} is sold out!`,
      };
    }

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

    if (parseInt(qty) > parseInt(getQty)) {
      throw {
        code: 400,
        message: `${getProductName}, only available ${getQty} items`,
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
      product_picture: getPicture,
    });

    // if (getItemSoldCount == null) {
    //   await models.updateProductsParallel({
    //     products_id,
    //     qtyDecrement: parseInt(getQty) - parseInt(qty),
    //     item_sold_count: parseInt(qty),
    //   });
    // } else {
    //   await models.updateProductsParallel({
    //     products_id,
    //     qtyDecrement: parseInt(getQty) - parseInt(qty),
    //     item_sold_count: parseInt(getItemSoldCount) + parseInt(qty),
    //   });
    // }

    res.status(201).json({
      code: 201,
      message: `Success add Checkout for users_id: ${idValidator} `,
      data: req.body,
    });
  } catch (error) {
    console.error(error);
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const getCheckout = async (req, res) => {
  try {
    const idValidator = req.users_id;
    let profileData;

    profileData = await models.getCheckoutPaid({ id: idValidator });

    res.json({
      message: `Get User (cust) With Id: ${idValidator}`,
      data: profileData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const idValidator = req.users_id;
    let profileData;

    profileData = await models.getCheckout({ id: idValidator });

    res.json({
      message: `Get User (cust) With Id: ${idValidator}`,
      data: profileData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error,
    });
  }
};

const getHistoryAll = async (req, res) => {
  try {
    const idValidator = req.users_id;
    let profileData;

    profileData = await models.getCheckoutAll({ id: idValidator });

    res.json({
      message: `Get User (cust) With Id: ${idValidator}`,
      data: profileData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error,
    });
  }
};

module.exports = {
  addCheckout,
  getCheckout,
  getHistory,
  getHistoryAll,
};
