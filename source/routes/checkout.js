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

// UPDATE 
router.patch(
  "/edit/",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.updateCheckout
);

// DELETE
router.delete(
  "/delete",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.deleteCheckout
);

// READ
router.get(
  "/detail",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.getCheckout
);

// READ
router.get(
  "/detail/history",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.getHistory
);

// READ
router.get(
  "/detail/history/all",
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  usersController.getHistoryAll
);

module.exports = router;
