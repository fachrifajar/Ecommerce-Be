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
      allBrand,
    } = req.query;

    const totalDatas = await models.getAllProduct({ orderBy });

    let getUsersData;
    let getAllData;

    if (allBrand && !colorFilter && !categoryFilter && !brandFilter) {
      let getUsersData = await models.getAllBrand();
      let result = [];

      for (let i = 0; i < getUsersData.length; i++) {
        result.push(getUsersData[i].brand);
      }

      const uniqueBrands = Array.from(new Set(result));

      uniqueBrands.sort(function (a, b) {
        return a.charAt(0) > b.charAt(0) ? 1 : -1;
      });

      if (uniqueBrands.length) {
        res.status(200).json({
          message: `Get all brand name`,
          data: JSON.stringify(uniqueBrands),
        });
        return;
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }

    if (colorFilter || sizeFilter || categoryFilter || brandFilter) {
      if (!sort && !page && !limit) {
        console.log("test atas TANPA FILTER SORT");
        getUsersData = await models.getAllProductFilter({
          colorFilter,
          sizeFilter,
          categoryFilter,
          brandFilter,
        });
      }
      if (sort && !page && !limit) {
        console.log("test atas sort");
        getUsersData = await models.getAllProductFilterSort({
          sort,
          colorFilter,
          sizeFilter,
          categoryFilter,
          brandFilter,
        });
      }
      if (page && limit) {
        console.log("test atas pagination sort");
        getAllData = await models.getAllProductFilterPaginationSort({
          sort,
          page,
          limit,
          colorFilter,
          sizeFilter,
          categoryFilter,
          brandFilter,
        });
      }
      if (!page && !limit) {
        if (getUsersData.length) {
          res.json({
            message: `Get product with filter`,
            data: getUsersData,
          });
          return;
        } else {
          throw { code: 422, message: "Data not found" };
        }
      }
    } else {
      console.log("bocor");
      if (
        id &&
        (!colorFilter || !sizeFilter || !categoryFilter || !brandFilter)
      ) {
        console.log("test bawah 1");

        let validation = false;
        for (let i = 0; i < id.length; i++) {
          if (id[i] == "-") {
            validation = true;
          }
        }
        console.log(validation);
        if (validation) {
          getUsersData = await models.getAllProductBySlug({ id });
          connectRedis.set("find_users", true, "ex", 10);
          connectRedis.set("url", req.originalUrl, "ex", 10);
          connectRedis.set("Id_users", id, "ex", 10);
          connectRedis.set(
            "getReqAccount",
            JSON.stringify(getUsersData),
            "ex",
            10
          );
          if (getUsersData.length > 0) {
            res.json({
              message: `Get product with slug: ${id}`,
              data: getUsersData,
            });
            return;
          } else {
            throw { code: 422, message: "Data not found" };
          }
        } else {
          getUsersData = await models.getAllProductByName({ id });
          connectRedis.set("find_users", true, "ex", 10);
          connectRedis.set("url", req.originalUrl, "ex", 10);
          connectRedis.set("Id_users", id, "ex", 10);
          connectRedis.set(
            "getReqAccount",
            JSON.stringify(getUsersData),
            "ex",
            10
          );
          if (getUsersData.length > 0) {
            res.json({
              message: `Get product with product name: ${id}`,
              data: getUsersData,
            });
            return;
          } else {
            throw { code: 422, message: "Data not found" };
          }
        }
      }
      if (
        !id &&
        !page &&
        !limit &&
        !sort &&
        (!colorFilter || !sizeFilter || !categoryFilter || !brandFilter)
      ) {
        console.log("test bawah 2");
        getUsersData = totalDatas;
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("find_all_users", true, "ex", 10);
        connectRedis.set(
          "getReqAccount",
          JSON.stringify(getUsersData),
          "ex",
          10
        );
        res.json({
          message: "Success get all data products",
          total: getUsersData.length,
          data: getUsersData,
        });
      }
      if (
        (page || limit || sort) &&
        (!colorFilter || !sizeFilter || !categoryFilter || !brandFilter)
      ) {
        console.log("test bawah 3");
        if (page && limit) {
          getAllData = await models.getAllProductPaginationSort({
            limit,
            page,
            sort,
            orderBy,
          });
        } else if (sort) {
          // let sizeFilterConvert = sizeFilter.split(",");

          getAllData = await models.getAllProductSort({
            sort,
            orderBy,
          });
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
    }

    if (
      (page && limit && sort) ||
      (page && limit) ||
      colorFilter ||
      sizeFilter ||
      categoryFilter ||
      brandFilter
    ) {
      console.log("test bawah json");
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
    const getData = await models.getProfile({ sellerIdvalidator: idValidator });
    const getStoreName = getData[0]?.store_name;
    console.log(getStoreName);
    console.log("test1");
    if (product_name) {
      const getProductName = await models.checkProductName({ product_name });
      console.log("test2");
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
    console.log("test3");
    const split = product_name.split(" ").join("-");

    let files = req.files.product_picture;
    files = Array.isArray(files) ? files : [files];
    // console.log("files->>",files)
    const uploads = files.map((file) => {
      // console.log("file->>",file)

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
    console.log("returningProductsId->>>>>", returningProductsId);

    await Promise.all(
      uploadedPictures.map((picture) => {
        console.log(picture);
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
      products_id: returningProductsId,
      data: req.body,
    });
  } catch (error) {
    console.error(error);
    const statusCode =
      error?.code >= 400 && error?.code < 600 ? error.code : 500;
    res.status(statusCode).json({
      message: error,
    });
  }
};

const addPhotoProducts = async (req, res) => {
  try {
    const { product_picture } = req.body;
    const { productsid } = req.params;

    const idValidator = req.seller_id;

    const getData = await models.getProductId({ id: productsid });
    if (getData.length == 0) {
      throw { code: 400, message: "products_id not identified" };
    }
    const getRole = await models.getRoles({
      sellerIdvalidator: idValidator,
    });

    if (getData[0]?.users_id == idValidator || getRole[0] == "admin") {
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
      console.log(uploads);
      const uploadedPictures = await Promise.all(uploads);
      console.log(uploadedPictures);

      await Promise.all(
        uploadedPictures.map((picture) => {
          return models.addProductPicture({
            product_picture: picture,
            products_id: productsid,
            users_id: idValidator,
          });
        })
      );
    } else {
      throw {
        code: 401,
        message:
          "Access not granted, only admin & valid user can access this section!",
      };
    }

    res.status(201).json({
      code: 201,
      message: "Success add new Product",
      data: req.files,
    });
  } catch (error) {
    console.error(error);
    const statusCode =
      error?.code >= 400 && error?.code < 600 ? error.code : 500;
    res.status(statusCode).json({
      message: error,
    });
  }
};

const addProductsReview = async (req, res) => {
  try {
    const { review } = req.body;
    const { productsid } = req.params;

    const getData = await models.getProductId({ id: productsid });
    if (!getData.length) {
      throw { code: 400, message: "products_id not identified" };
    }

    if (getData[0]?.review == null || !getData[0]?.review.length) {
      console.log("masuk");
      const arr = review.split("").map(Number);
      await models.addReviewOnly({ review: arr, id: productsid });
    } else {
      await models.addProductReview({
        review,
        id: productsid,
      });
    }

    res.status(201).json({
      code: 201,
      message: "Success add new Product",
      data: req.body,
    });
  } catch (error) {
    console.error(error);
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const updateProducts = async (req, res) => {
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

    const { usersid } = req.params;
    const sellerIdvalidator = req.seller_id;
    const getRole = await models.getRoles({ sellerIdvalidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getProductId({ id: usersid });
    if (getAllData.length == 0) {
      throw { code: 400, message: "Product_id not identified" };
    }
    // console.log(getAllData[0]?.users_id);
    // console.log(sellerIdvalidator);

    if (product_name) {
      const getProductName = await models.getProductName({ product_name });

      if (getProductName.length !== 0) {
        throw {
          code: 401,
          message: "product name already exists",
        };
      }
    }

    if (isAdmin == "admin" || sellerIdvalidator == getAllData[0]?.users_id) {
      if (!req.files) {
        await models.updateProducts({
          defaultValue: getAllData[0],
          id: usersid,
          product_name,
          price,
          qty,
          color,
          category,
          size,
          brand,
          condition,
          description,
        });

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id: usersid,
            ...req.body,
          },
        });
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

const updatePhotoProducts = async (req, res) => {
  try {
    const { product_picture } = req.body;

    const { usersid } = req.params;
    const sellerIdvalidator = req.seller_id;
    const getRole = await models.getRoles({ sellerIdvalidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getProductPictureId({ id: usersid });
    if (getAllData.length == 0) {
      throw { code: 400, message: "products_picture_id not identified" };
    }

    if (isAdmin == "admin" || sellerIdvalidator == getAllData[0]?.users_id) {
      let file = req.files.product_picture;
      let getPhoto = getAllData[0].product_picture;

      cloudinary.v2.uploader.destroy(
        getPhoto,
        { folder: "ecommerce" },
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
          await models.updateProductPicture({
            defaultValue: getAllData[0],
            id: usersid,
            product_picture: result.public_id,
          });
        }
      );

      res.json({
        status: "true",
        message: "data updated",
        data: {
          id: usersid,
          ...req.body,
        },
        product_picture: req.files.product_picture.name,
      });
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
    console.log("masuk");
    const { products_picture_id } = req.params;

    const idValidator = req.seller_id;
    const getRole = await models.getRoles({ sellerIdvalidator: idValidator });
    const isAdmin = getRole[0]?.role;
    console.log("test1");
    const getAllData = await models.getProductPictureId({
      id: products_picture_id,
    });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }
    console.log("test2");
    if (isAdmin == "admin" || getAllData[0]?.users_id == idValidator) {
      let getPhoto = getAllData[0].product_picture;

      cloudinary.v2.uploader.destroy(
        getPhoto,
        { folder: "ecommerce" },
        function (error, result) {
          console.log(result, error);
        }
      );

      await models.deleteProductPicture({ id: products_picture_id });
      res.json({
        status: "true",
        message: "PRODUCTS PICTURE DELETED!",
      });
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { products_id } = req.params;

    const idValidator = req.seller_id;
    const getRole = await models.getRoles({ sellerIdvalidator: idValidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getProductId({
      id: products_id,
    });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    const getAllDataParallel = await models.getProductPictureByProductId({
      id: products_id,
    });
    const getPhotos = getAllDataParallel.map((photo) => photo.product_picture);
    const getProdPictId = getAllDataParallel.map(
      (id) => id.products_picture_id
    );

    if (isAdmin == "admin" || getAllData[0]?.users_id == idValidator) {
      for (let i = 0; i < getPhotos.length; i++) {
        cloudinary.v2.uploader.destroy(
          getPhotos[i],
          { folder: "ecommerce" },
          function (error, result) {
            console.log(result, error);
          }
        );

        await models.deleteProductPicture({ id: getProdPictId[i] });
      }
      await models.deleteProduct({ id: products_id });
      res.json({
        status: "true",
        message: "PRODUCTS PICTURE DELETED!",
      });
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

module.exports = {
  getProducts,
  addProducts,
  updatePhotoProducts,
  updateProducts,
  addProductsReview,
  deleteProductPicture,
  deleteProduct,
  addPhotoProducts,
};
