const requireAuth = (req, res, next) => {
    if (!req.dbUser) {
        return res.status(401).json({
            message: "Login required"
        });
    }

    next();
};

export default requireAuth;