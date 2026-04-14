import express from "express";

const router = express.Router();


// check if logged-in user is admin
router.get("/check-admin", (req, res) => {

    const user = req.dbUser;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "UNAUTHORIZED"
        });
    }

    if (user.role !== "admin") {
        return res.json({
            success: false,
            message: "NOT_ADMIN"
        });
    }

    res.json({
        success: true
    });

});


// verify admin key
router.post("/verify-key", (req, res) => {

    const user = req.dbUser;
    const { key } = req.body;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "UNAUTHORIZED"
        });
    }

    if (user.role !== "admin") {
        return res.json({
            success: false,
            message: "NOT_ADMIN"
        });
    }

    if (user.adminKey !== key) {
        return res.json({
            success: false,
            message: "INVALID_KEY"
        });
    }

    // (store verification in session)
    req.session.adminVerified = true;

    res.json({
        success: true,
        message: "ADMIN_VERIFIED"
    });

});

export default router;