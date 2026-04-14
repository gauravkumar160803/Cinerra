const reqAdminAuth = async (req, res, next) => {
    try {
        const user = req.dbUser;

        // 1. Check login
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "UNAUTHORIZED"
            });
        }

        // 2. Check role
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "ACCESS_DENIED"
            });
        }

        // 3. Check if admin key was verified
        if (req.headers["x-admin-verified"] !== "true") {
            return res.status(403).json({
                success: false,
                message: "ADMIN_KEY_REQUIRED"
            });
        }

        next();

    } catch (error) {
        console.log("Admin middleware error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export default reqAdminAuth;