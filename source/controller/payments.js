const models = require("../models/payments");

const addPayments = async (req, res) => {
  try {
    const { payment_method, checkout_id } = req.body;

    const idValidator = req.users_id;
    const getData = await models.getProfile({ idValidator });
    const getCheckoutData = await models.getCheckout({ id: checkout_id });

    // const getProduct = await models.getAllProductById({id})

    if (!getCheckoutData.length) {
      throw { code: 400, message: "checkout_id not identified" };
    }
    const paymentRegex = /^(gopay|mastercard|pos indonesia)$/i;
    const isValidPayment = paymentRegex.test(payment_method);

    if (!isValidPayment) {
      throw {
        code: 400,
        message: "available method: Gopay, Pos Indonesia, Mastercard",
      };
    }

    const getAddress = getData[0]?.addresses[0]?.address_id;
    const getProductId = getCheckoutData[0]?.products_id;
    const getTotalOrder = parseInt(getCheckoutData[0]?.total_est);

    const getProduct = await models.getProduct({ id: getProductId });
    const getItemSoldCount = getProduct[0]?.item_sold_count;
    const getQtyProduct = getProduct[0]?.qty;
    const getQtyCheckout = getCheckoutData[0].qty;
    const getProductName = getProduct[0]?.product_name;
    // console.dir(getProduct, { depth: null });

    if (getQtyProduct <= 0) {
      throw {
        code: 400,
        message: `${getProductName} is sold out!`,
      };
    }

    if (parseInt(getQtyCheckout) > parseInt(getQtyProduct)) {
      throw {
        code: 400,
        message: `We are sorry. Due to high transactions traffic. The product: ${getProductName}, only available ${getQtyProduct} items right now.`,
      };
    }

    await models.addPayments({
      users_id: idValidator,
      payment_method,
      address_id: getAddress,
      products_id: getProductId,
      total_order: getTotalOrder,
      total_delivery: 5000,
      grand_total: parseInt(getTotalOrder) + 5000,
      checkout_id,
    });

    if (getItemSoldCount == null) {
      await models.updateProductsParallel({
        products_id: getProductId,
        qtyDecrement: parseInt(getQtyProduct) - parseInt(getQtyCheckout),
        item_sold_count: parseInt(getQtyCheckout),
      });
    } else {
      await models.updateProductsParallel({
        products_id: getProductId,
        qtyDecrement: parseInt(getQtyProduct) - parseInt(getQtyCheckout),
        item_sold_count: parseInt(getItemSoldCount) + parseInt(getQtyCheckout),
      });
    }

    res.status(201).json({
      code: 201,
      message: `Success add Payment for users_id: ${idValidator} `,
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

    const profileData = await models.getCheckout({ id: idValidator });

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
  addPayments,
  getCheckout,
};
