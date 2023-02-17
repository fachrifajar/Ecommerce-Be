const models = require("../models/products");
const { v4: uuidv4 } = require("uuid");
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");

const getProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      page,
      limit,
      sort,
      orderBy,
      colorFilter,
      sizeFilter,
      categoryFilter,
      brandFilter,
    } = req.query;

    const totalDatas = await models.getAllProduct({ orderBy });

    let getUsersData;
    let getAllData;

    if (id) {
      getUsersData = await models.getAllProductById({ id });
      connectRedis.set("find_users", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("Id_users", id, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      if (getUsersData.length > 0) {
        res.json({
          message: `Get product with products_id: ${id}`,
          data: getUsersData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!id && !page && !limit && !sort) {
      getUsersData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_users", true, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      res.json({
        message: "Success get all data products",
        total: getUsersData.length,
        data: getUsersData,
      });
    }
    if (page || limit || sort) {
      if (page && limit) {
        getAllData = await models.getAllProductPaginationSort({
          limit,
          page,
          sort,
          orderBy,
        });
      } else if (sort) {
        getAllData = await models.getAllProductSort({ sort, orderBy });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all data products",
          total: getAllData.length,
          data: getAllData,
        });
      }
    }

    if ((page && limit && sort) || (page && limit)) {
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("page", page, "ex", 10);
      connectRedis.set("limit", limit, "ex", 10);
      connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
      connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
      connectRedis.set("isPaginated", true, "ex", 10);
      res.json({
        message: "Success get all data products",
        code: 200,
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const getSpecificUsersSeller = async (req, res) => {
  try {
    const idValidator = req.users_id; // middleware for roleValidator
    const sellerIdvalidator = req.seller_id;

    console.log(sellerIdvalidator);

    const profileData = await models.getProfile({ sellerIdvalidator });

    res.json({
      message: `Get User (Seller) With Id: ${sellerIdvalidator}`,
      data: profileData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Bad Request",
      error: error,
    });
  }
};

const addProducts = async (req, res) => {
  try {
    const {
      product_name,
      price,
      qty,
      color,
      category,
      size,
      brand,
      product_picture,
      condition,
      description,
    } = req.body;

    const idValidator = req.seller_id;
    console.log("idValidator", idValidator);
    const getData = await models.getAllProduct();
    const getStoreName = getData[0]?.store_name;

    if (product_name) {
      const getProductName = await models.checkProductName({ product_name });

      if (
        getProductName[0]?.product_name.toLowerCase() ==
        product_name.toLowerCase()
      ) {
        throw {
          code: 409,
          message: "Product with the provided name already exists",
        };
      }
    }

    const split = product_name.split(" ").join("-");

    let files = req.files.product_picture;
    files = Array.isArray(files) ? files : [files];

    const uploads = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4(), folder: "ecommerce" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.public_id);
            }
          }
        );
      });
    });
    // console.log(uploads);
    const uploadedPictures = await Promise.all(uploads);
    // console.log(uploadedPictures);

    const regexColor = /(\b\w+\b)(?=,|$)/g;
    const colorConverted = `{"${color.match(regexColor).join('", "')}"}`;

    const regexSize = /(\b\w+\b)(?=,|$)/g;
    const sizeConverted = `{"${size.match(regexSize).join('", "')}"}`;

    const returningProductsId = await models.addProduct({
      users_id: idValidator,
      product_name,
      price: parseInt(price),
      qty: parseInt(qty),
      store_name: getStoreName,
      color: colorConverted,
      category,
      size: sizeConverted,
      brand,
      condition,
      description,
      slug: split,
    });

    await Promise.all(
      uploadedPictures.map((picture) => {
        return models.addProductPicture({
          product_picture: picture,
          products_id: parseInt(returningProductsId),
          users_id: idValidator,
        });
      })
    );

    res.status(201).json({
      code: 201,
      message: "Success add new Product",
      data: req.body,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const addProductsReview = async (req, res) => {
  try {
    const { review } = req.body;
    const { productsid } = req.params;

    // const idValidator = req.seller_id;
    // const getData = await models.getAllUsersSeller();
    // const getStoreName = getData[0]?.store_name;

    await models.addProductReview({
      review,
      id: productsid,
    });

    res.status(201).json({
      code: 201,
      message: "Success add new Product",
      data: req.body,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const updateUsersSellerPartial = async (req, res) => {
  try {
    const { store_name, email, phone_number, description, profile_picture } =
      req.body;

    const sellerIdvalidator = req.seller_id;
    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ sellerIdvalidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getUsersSellerById({
      id: sellerIdvalidator,
    });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    if (phone_number) {
      const getPhoneNumber = await models.getPhoneNumber({ phone_number });
      const getPhoneSeller = await models.getPhoneSeller({ phone_number });
      if ((getPhoneNumber || getPhoneSeller).length !== 0) {
        throw {
          code: 401,
          message: "User with the provided phone number already exists",
        };
      } else {
        await models.updateUsersCustParallel({
          phone_number,
          id: sellerIdvalidator,
        });
      }
    }

    if (email) {
      const checkEmailSeller = await models.checkEmailSeller({ email });
      const checkEmail = await models.checkEmail({ email });

      if (
        (checkEmailSeller[0]?.email.toLowerCase() ||
          checkEmail[0]?.email.toLowerCase()) == email.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "User with the related email already exists",
        };
      }
    }

    if (store_name) {
      const getstoreName = await models.getstoreName({ store_name });

      if (
        getstoreName[0]?.store_name.toLowerCase() == store_name.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "Store with the name already exists",
        };
      }
    }

    if (!req.files) {
      await models.updateUsersSellerPartial({
        defaultValue: getAllData[0],
        id: sellerIdvalidator,
        store_name,
        email,
        phone_number,
        description,
        profile_picture,
      });

      res.json({
        status: "true",
        message: "data updated",
        data: {
          id: sellerIdvalidator,
          ...req.body,
        },
      });
    } else {
      if (getAllData.length == 0) {
        throw { code: 400, message: "ID not identified" };
      } else {
        let file = req.files.profile_picture;

        cloudinary.v2.uploader.destroy(
          getAllData[0].profile_picture,
          function (error, result) {
            console.log(result, error);
          }
        );

        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4(), folder: "ecommerce" },
          async function (error, result) {
            if (error) {
              throw error;
            }

            await models.updateUsersSellerPartial({
              defaultValue: getAllData[0],
              id: sellerIdvalidator,
              store_name,
              email,
              phone_number,
              description,
              profile_picture,
            });
          }
        );

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id: sellerIdvalidator,
            ...req.body,
          },
          profile_picture: req.files.profile_picture.name,
        });
      }
    }
  } catch (error) {
    if (error.code == "23505") {
      if (
        error.message ==
        'duplicate key value violates unique constraint "email_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided email already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "username_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided username already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "phone_number_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided phone number already exists",
        });
      }
      const statusCode =
        error?.code && 100 <= error.code && error.code <= 599
          ? error.code
          : 500;
      res.status(statusCode).json({
        message: error.message ?? error,
      });
    } else {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

const updateUsersSellerAll = async (req, res) => {
  try {
    const { store_name, email, phone_number, description, profile_picture } =
      req.body;

    const { usersid } = req.params;
    const sellerIdvalidator = req.seller_id;
    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ sellerIdvalidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getUsersSellerById({ id: usersid });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }
    console.log(usersid);
    console.log(sellerIdvalidator);

    if (phone_number) {
      const getPhoneNumber = await models.getPhoneNumber({ phone_number });
      const getPhoneSeller = await models.getPhoneSeller({ phone_number });
      if ((getPhoneNumber || getPhoneSeller).length !== 0) {
        throw {
          code: 401,
          message: "User with the provided phone number already exists",
        };
      } else {
        await models.updateUsersCustParallel({
          phone_number,
          id: sellerIdvalidator,
        });
      }
    }

    if (email) {
      const checkEmailSeller = await models.checkEmailSeller({ email });
      const checkEmail = await models.checkEmail({ email });

      if (
        (checkEmailSeller[0]?.email.toLowerCase() ||
          checkEmail[0]?.email.toLowerCase()) == email.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "User with the related email already exists",
        };
      }
    }

    if (store_name) {
      const getstoreName = await models.getstoreName({ store_name });

      if (
        getstoreName[0]?.store_name.toLowerCase() == store_name.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "Store with the name already exists",
        };
      }
    }

    if (isAdmin == "admin" || usersid == sellerIdvalidator) {
      if (!req.files) {
        await models.updateUsersSellerPartial({
          defaultValue: getAllData[0],
          id: sellerIdvalidator,
          store_name,
          email,
          phone_number,
          description,
          profile_picture,
        });

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id: sellerIdvalidator,
            ...req.body,
          },
        });
      } else {
        if (getAllData.length == 0) {
          throw { code: 400, message: "ID not identified" };
        } else {
          let file = req.files.profile_picture;

          cloudinary.v2.uploader.destroy(
            getAllData[0].profile_picture,
            function (error, result) {
              console.log(result, error);
            }
          );

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { public_id: uuidv4(), folder: "ecommerce" },
            async function (error, result) {
              if (error) {
                throw error;
              }

              await models.updateUsersSellerPartial({
                defaultValue: getAllData[0],
                id: sellerIdvalidator,
                store_name,
                email,
                phone_number,
                description,
                profile_picture,
              });
            }
          );

          res.json({
            status: "true",
            message: "data updated",
            data: {
              id: sellerIdvalidator,
              ...req.body,
            },
            profile_picture: req.files.profile_picture.name,
          });
        }
      }
    } else {
      throw {
        code: 401,
        message:
          "Access not granted, only admin & valid user can access this section!",
      };
    }
  } catch (error) {
    if (error.code == "23505") {
      if (
        error.message ==
        'duplicate key value violates unique constraint "email_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided email already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "username_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided username already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "phone_number_customer"'
      ) {
        res.status(422).json({
          message: "User with the provided phone number already exists",
        });
      }
      const statusCode =
        error?.code && 100 <= error.code && error.code <= 599
          ? error.code
          : 500;
      res.status(statusCode).json({
        message: error.message ?? error,
      });
    } else {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

const deleteProductPicture = async (req, res) => {
  try {
    const { product_picture_id } = req.params;

    const idValidator = req.seller_id;
    const getRole = await models.getRoles({ roleValidator: idValidator });
    const isAdmin = getRole[0]?.role;

    console.log(isAdmin);
    console.log(idValidator);

    const getAllData = await models.getUsersSellerById({ id: idValidator });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    let valid = false;
    for (let i = 0; i < getAllData[0]?.addresses?.length; i++) {
      if (getAllData[0]?.addresses[i]?.address_id == addressid) {
        valid = true;
      }
    }
    console.log(valid);
    if (isAdmin == "admin" || valid) {
      await models.deleteAddress({ id: addressid });
      res.json({
        status: "true",
        message: "ADDRESS DELETED!",
      });
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getSpecificUsersSeller,
  addProducts,
  updateUsersSellerPartial,
  updateUsersSellerAll,
  addProductsReview,
  deleteProductPicture,
};
