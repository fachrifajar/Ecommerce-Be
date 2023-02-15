const express = require("express");
const router = express.Router();
const usersController = require("../controller/customer");
const middleware = require("../middleware/customer");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/register",
  middleware.createUsersCustValidator,
  usersController.createUsersCust
);

// CREATE
router.post(
  "/address/add",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.addAddressValidator,
  usersController.addAddressCust
);

// READ
router.get(
  "/detail",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.getSpecificUsersCust
);

// READ
router.get(
  "/:id?",
  redisMiddleware.getUsersCust_redis,
  usersController.getUsersCust
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
  usersController.updateUsersCustPartial
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
  usersController.updateUsersCustAll
);

// UPDATE
router.patch(
  "/address/edit/:addressid?",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.updateAddressValidator,
  usersController.editAddressCust
);

// DELETE
router.delete(
  "/address/delete/:addressid",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteAddress
);

module.exports = router;
