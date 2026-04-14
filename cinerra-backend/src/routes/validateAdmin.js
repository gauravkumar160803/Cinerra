import express from "express";

const router = express.Router();

// 🔥 validate admin access
router.get("/validate-admin", (req, res) => {
  res.json({
    success: true,
    message: "ADMIN_AUTHORIZED"
  });
});

export default router;