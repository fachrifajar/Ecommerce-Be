const express = require("express");
const router = express.Router();
const usersController = require("../controller/products");
const middleware = require("../middleware/products");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.filesPayLoadExist,
  uploadMiddleware.fileSizeLimiter,
  uploadMiddleware.fileExtOnly,
  middleware.addProductvalidator,
  usersController.addProducts
);

router.patch(
  "/review/add/:productsid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.addProductsReview
);

// READ
router.get(
  "/detail",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.getSpecificUsersSeller
);

// READ
router.get(
  "/:id?",
  redisMiddleware.getUsersCust_redis,
  usersController.getProducts
);

// UPDATE
router.patch(
  "/edit",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateUsersPartialValidator,
  usersController.updateUsersSellerPartial
);

// UPDATE
router.patch(
  "/edit/:usersid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.fileExtLimiter([
    ".png",
    ".jpg",
    ".jpeg",
    ".PNG",
    ".JPG",
    ".JPEG",
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateUsersPartialValidator,
  usersController.updateUsersSellerAll
);

// DELETE
router.delete(
  "/delete/picture/:product_picture_id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteProductPicture
);

module.exports = router;
