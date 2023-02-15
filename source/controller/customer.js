const models = require("../models/customer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");
const moment = require("moment-timezone");

const getUsersCust = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, limit, sort } = req.query;
    // const idValidator = req.users_id || null; // middleware for roleValidator
    // console.log(idValidator);

    const totalDatas = await models.getAllUsersCust();

    let getUsersData;
    let getAllData;

    if (id) {
      getUsersData = await models.getUsersCustById({ id });
      connectRedis.set("find_users", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("Id_users", id, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      if (getUsersData.length > 0) {
        res.json({
          message: `Get User (cust) With Id: ${id}`,
          code: 200,
          data: getUsersData,
        });
      } else {
        console.log("asa");
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!id && !page && !limit && !sort) {
      getUsersData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_users", true, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      res.json({
        message: "Success get all data users (cust)",
        code: 200,
        total: getUsersData.length,
        data: getUsersData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllUsersCustPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllUsersCustPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllUsersCustSort({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all data users (cust)",
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
        message: "success get all data users (cust)",
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

const getSpecificUsersCust = async (req, res) => {
  try {
    const idValidator = req.users_id; // middleware for roleValidator

    const profileData = await models.getProfile({ idValidator });

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

const createUsersCust = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const getEmail = await models.getEmail({ email });
    const getUsername = await models.getUsername({ username });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if (email) {
      const checkEmailSeller = await models.checkEmailSeller({ email });
      const checkEmail = await models.checkEmail({ email });

      if (
        (checkEmailSeller[0]?.email.toLowerCase() ||
          checkEmail[0]?.email.toLowerCase()) == email.toLowerCase()
      ) {
        throw {
          code: 409,
          message: "User with the related email already exists",
        };
      }
    }

    if (username) {
      const checkUsernameSellers = await models.checkUsernameSellers({
        username,
      });
      const checkUsername = await models.checkUsername({ username });
      if (
        (checkUsernameSellers[0]?.username.toLowerCase() ||
          checkUsername[0]?.username.toLowerCase()) == username.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "User with the related username already exists",
        };
      }
    }

    if (getEmail.length !== 0 && getUsername.length !== 0) {
      throw {
        code: 409,
        message: "User with the provided email & username already exists",
      };
    }
    if (getEmail.length == 0 && getUsername.length !== 0) {
      throw {
        code: 409,
        message: "User with the provided username already exists",
      };
    }
    if (getEmail.length !== 0 && getUsername.length == 0) {
      throw {
        code: 409,
        message: "User with the provided email already exists",
      };
    }

    const addData = await models.createUsersCust({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      code: 201,
      message: "Success create new users (customer)",
      data: req.body,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const addAddressCust = async (req, res) => {
  try {
    const {
      type_of_address,
      recipient_name,
      recipient_phone_number,
      address,
      postal_code,
      city,
      primary_address,
    } = req.body;

    const idValidator = req.users_id; // middleware for roleValidator
    let updated_at_inject;

    if (primary_address) {
      await models.addAddressManipulate({
        type_of_address,
        recipient_name,
        recipient_phone_number,
        address,
        postal_code,
        city,
        users_id: idValidator,
        primary_address: primary_address || 0,
      });
    } else {
      updated_at_inject = 0;
      const addData = await models.addAddress({
        type_of_address,
        recipient_name,
        recipient_phone_number,
        address,
        postal_code,
        city,
        users_id: idValidator,
        primary_address: primary_address || 0,
        updated_at: updated_at_inject,
      });
    }

    res.status(201).json({
      code: 201,
      message: "Success add new address (customer)",
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

const updateUsersCustPartial = async (req, res) => {
  try {
    const {
      email,
      phone_number,
      username,
      password,
      profile_picture,
      gender,
      date_of_birth,
      address,
    } = req.body;

    const sellerIdvalidator = req.seller_id;
    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getUsersCustById({ id: roleValidator });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    if (email) {
      const checkEmailSeller = await models.checkEmailSeller({ email });
      const checkEmail = await models.checkEmail({ email });

      if (
        (checkEmailSeller[0]?.email.toLowerCase() ||
          checkEmail[0]?.email.toLowerCase()) == email.toLowerCase()
      ) {
        throw {
          code: 409,
          message: "User with the related email already exists",
        };
      }
    }

    if (username) {
      const checkUsernameSellers = await models.checkUsernameSellers({
        username,
      });
      const checkUsername = await models.checkUsername({ username });
      if (
        (checkUsernameSellers[0]?.username.toLowerCase() ||
          checkUsername[0]?.username.toLowerCase()) == username.toLowerCase()
      ) {
        throw {
          code: 401,
          message: "User with the related username already exists",
        };
      }
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
        await models.updateUsersSellerParallel({
          phone_number,
          id: sellerIdvalidator,
        });
      }
    }

    if (!req.files) {
      if (password == undefined) {
        await models.updateUsersCustPartial({
          email,
          defaultValue: getAllData[0],
          phone_number,
          username,
          password,
          profile_picture,
          id: roleValidator,
          gender,
          date_of_birth,
          address,
        });
      } else {
        bcrypt.hash(password, saltRounds, async function (err, hash) {
          try {
            if (err) {
              throw "Failed Authenticate, please try again";
              // throw new Error(400)
            }
            await models.updateUsersCustPartial({
              email,
              defaultValue: getAllData[0],
              phone_number,
              username,
              password: hash,
              profile_picture,
              id: roleValidator,
              gender,
              date_of_birth,
              address,
            });
          } catch (error) {
            res.status(error?.code ?? 500).json({
              message: error.message ?? error,
            });
          }
        });
      }

      res.json({
        status: "true",
        message: "data updated",
        data: {
          id: roleValidator,
          ...req.body,
        },
      });
    } else {
      if (getAllData.length == 0) {
        throw { code: 400, message: "ID not identified" };
      } else {
        if (password == undefined) {
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

              await models.updateUsersCustPartial({
                email,
                defaultValue: getAllData[0],
                phone_number,
                username,
                password,
                profile_picture: result.public_id,
                id: roleValidator,
                gender,
                date_of_birth,
                address,
              });
            }
          );
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
                throw "Upload failed";
              }
              bcrypt.hash(password, saltRounds, async function (err, hash) {
                try {
                  if (err) {
                    throw "Failed Authenticate, please try again";
                  }

                  await models.updateUsersCustPartial({
                    email,
                    defaultValue: getAllData[0],
                    phone_number,
                    username,
                    password: hash,
                    profile_picture: result.public_id,
                    id: roleValidator,
                    gender,
                    date_of_birth,
                    address,
                  });
                } catch (error) {
                  res.status(500).json({
                    message: error.message,
                  });
                }
              });
            }
          );
        }

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id: roleValidator,
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

const updateUsersCustAll = async (req, res) => {
  try {
    const {
      email,
      phone_number,
      username,
      password,
      profile_picture,
      gender,
      date_of_birth,
      address,
    } = req.body;

    const { usersid } = req.params;

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getUsersCustById({ id: usersid });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }
    console.log(usersid);
    if (isAdmin == "admin" || usersid == roleValidator) {
      if (!req.files) {
        if (password == undefined) {
          await models.updateUsersCustPartial({
            email,
            defaultValue: getAllData[0],
            phone_number,
            username,
            password,
            profile_picture,
            id: usersid,
            gender,
            date_of_birth,
            address,
          });
        } else {
          bcrypt.hash(password, saltRounds, async function (err, hash) {
            try {
              if (err) {
                throw "Failed Authenticate, please try again";
                // throw new Error(400)
              }
              await models.updateUsersCustPartial({
                email,
                defaultValue: getAllData[0],
                phone_number,
                username,
                password: hash,
                profile_picture,
                id: usersid,
                gender,
                date_of_birth,
                address,
              });
            } catch (error) {
              res.status(error?.code ?? 500).json({
                message: error.message ?? error,
              });
            }
          });
        }

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id: usersid,
            ...req.body,
          },
        });
      } else {
        if (getAllData.length == 0) {
          throw { code: 400, message: "ID not identified" };
        } else {
          if (password == undefined) {
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

                await models.updateUsersCustPartial({
                  email,
                  defaultValue: getAllData[0],
                  phone_number,
                  username,
                  password,
                  profile_picture: result.public_id,
                  id: usersid,
                  gender,
                  date_of_birth,
                  address,
                });
              }
            );
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
                  throw "Upload failed";
                }
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                  try {
                    if (err) {
                      throw "Failed Authenticate, please try again";
                    }

                    await models.updateUsersCustPartial({
                      email,
                      defaultValue: getAllData[0],
                      phone_number,
                      username,
                      password: hash,
                      profile_picture: result.public_id,
                      id: usersid,
                      gender,
                      date_of_birth,
                      address,
                    });
                  } catch (error) {
                    res.status(500).json({
                      message: error.message,
                    });
                  }
                });
              }
            );
          }

          res.json({
            status: "true",
            message: "data updated",
            data: {
              id: usersid,
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

const editAddressCust = async (req, res) => {
  try {
    const {
      type_of_address,
      recipient_name,
      recipient_phone_number,
      address,
      postal_code,
      city,
      primary_address,
    } = req.body;
    const { addressid } = req.params;

    const idValidator = req.users_id;
    const getRole = await models.getRoles({ roleValidator: idValidator });
    const isAdmin = getRole[0]?.role;

    console.log(isAdmin);
    console.log(idValidator);

    const getAllData = await models.getUsersCustById({ id: idValidator });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    let valid = false;
    let index;
    for (let i = 0; i < getAllData[0]?.addresses?.length; i++) {
      if (getAllData[0]?.addresses[i]?.address_id == addressid) {
        valid = true;
        index = i;
      }
    }

    if (isAdmin == "admin" || valid) {
      if (primary_address && primary_address == 1) {
        await models.editAddress({
          type_of_address,
          recipient_name,
          recipient_phone_number,
          address,
          postal_code,
          city,
          id: addressid,
          defaultValue: getAllData[0]?.addresses[index],
          primary_address,
        });
      }
      if (primary_address == 0) {
        await models.editAddressManipulate({
          type_of_address,
          recipient_name,
          recipient_phone_number,
          address,
          postal_code,
          city,
          id: addressid,
          defaultValue: getAllData[0]?.addresses[index],
          primary_address,
          updated_at: 0,
        });
      }

      if (!primary_address) {
        await models.editAddress({
          type_of_address,
          recipient_name,
          recipient_phone_number,
          address,
          postal_code,
          city,
          id: addressid,
          defaultValue: getAllData[0]?.addresses[index],
          primary_address,
        });
      }

      res.json({
        status: "true",
        message: "address updated",
        data: {
          id: idValidator,
          ...req.body,
        },
      });
    } else {
      throw {
        code: 401,
        message:
          "Access not granted, only admin & valid user can access this section!",
      };
    }
  } catch (error) {
    const statusCode =
      error?.code && 100 <= error.code && error.code <= 599 ? error.code : 500;
    res.status(statusCode).json({
      message: error.message ?? error,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressid } = req.params;

    const idValidator = req.users_id;
    const getRole = await models.getRoles({ roleValidator: idValidator });
    const isAdmin = getRole[0]?.role;

    console.log(isAdmin);
    console.log(idValidator);

    const getAllData = await models.getUsersCustById({ id: idValidator });
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
  getUsersCust,
  getSpecificUsersCust,
  createUsersCust,
  updateUsersCustPartial,
  updateUsersCustAll,
  addAddressCust,
  editAddressCust,
  deleteAddress,
};
