const express = require("express");
const router = express.Router();
const usersController = require("../controller/checkout");
// const middleware = require("../middleware/products");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
//   middleware.addProductvalidator,
  usersController.addCheckout
);

router.patch(
  "/review/add/:productsid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.addProductsReview
);

// READ
router.get(
  "/:id?",
//   middleware.getProductValidator,
  redisMiddleware.getUsersCust_redis,
  usersController.getProducts
);

// UPDATE
router.patch(
  "/edit/photo/:usersid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.filesPayLoadExist,
  uploadMiddleware.fileSizeLimiter,
  uploadMiddleware.fileExtOnly,
  uploadMiddleware.fileSizeLimiter,
  usersController.updatePhotoProducts
);

// UPDATE
router.patch(
  "/edit/:usersid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.fileSizeLimiter,
//   middleware.updateProductValidator,
  usersController.updateProducts
);

// DELETE
router.delete(
  "/delete/picture/:products_picture_id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteProductPicture
);

// DELETE
router.delete(
  "/delete/:products_id",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteProduct
);


module.exports = router;
