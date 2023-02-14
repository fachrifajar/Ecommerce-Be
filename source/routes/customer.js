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

// READ
router.get(
  "/:id?",
  redisMiddleware.getUsersCust_redis,
  usersController.getUsersCust
);

// UPDATE
router.patch(
  '/edit',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  uploadMiddleware.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateUsersPartialValidator,
  usersController.updateUsersCustPartial
)

// // DELETE
// router.delete(
//   "/delete/:id",
//   authMiddleware.validateToken,
//   authMiddleware.validateRole,
//   usersController.deleteUsers
// );

module.exports = router;
