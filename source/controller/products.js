const models = require("../models/products");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");

const getUsersSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit, sort } = req.query;
    // const idValidator = req.users_id || null; // middleware for roleValidator
    // console.log(idValidator);

    const totalDatas = await models.getAllUsersSeller();

    let getUsersData;
    let getAllData;

    if (id) {
      getUsersData = await models.getUsersSellerById({ id });
      connectRedis.set("find_users", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("Id_users", id, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      if (getUsersData.length > 0) {
        res.json({
          message: `Get User (Seller) With Id: ${id}`,
          code: 200,
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
        message: "Success get all data users (Seller)",
        code: 200,
        total: getUsersData.length,
        data: getUsersData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllUsersSellerPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllUsersSellerPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllUsersSellerSort({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all data users (Seller)",
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
        message: "success get all data users (Seller)",
        code: 200,
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      });
    }
  } catch (err) {
    res.status(err?.code ?? 500).json({
      message: err,
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

    const idValidator = req.users_id;

    if (product_name) {
      const getProductName = await models.checkProductName({ product_name });

      if (
        getProductName[0]?.store_name.toLowerCase() == store_name.toLowerCase()
      ) {
        throw {
          code: 409,
          message: "Product with the provided name already exists",
        };
      }
    }

    const split = product_name.split(" ").join("-");

    let file = req.files.product_picture;

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { public_id: uuidv4(), folder: "ecommerce" },
      async function (error, result) {
        if (error) {
          throw error;
        }

        await models.addProduct({
          users_id: idValidator,
          product_name,
          price,
          qty,
          store_name,
          color,
          category,
          size,
          brand,
          product_picture: result.public_id,
          condition,
          description,
          slug: split,
        });
      }
    );

    res.status(201).json({
      code: 201,
      message: "Success create new users (seller)",
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

module.exports = {
  getUsersSeller,
  getSpecificUsersSeller,
  addProducts,
  updateUsersSellerPartial,
  updateUsersSellerAll,
};
