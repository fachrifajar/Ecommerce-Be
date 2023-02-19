const express = require("express");
const router = express.Router();
const usersController = require("../controller/checkout");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const redisMiddleware = require("../middleware/redis");

// CREATE
router.post(
  "/add",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.addCheckout
);

module.exports = router;
