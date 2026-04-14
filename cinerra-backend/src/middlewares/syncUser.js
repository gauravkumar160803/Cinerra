import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

const syncUser = async (req, res, next) => {
    try {

        const { userId } = getAuth(req);
        if (!userId) return next();

        // get full clerk user
        const clerkUser = await clerkClient.users.getUser(userId);

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

        // role from clerk metadata
        const clerkRole = clerkUser.privateMetadata?.role || "user";

        // admin key from clerk metadata
        const clerkKey = clerkUser.privateMetadata?.key || null;

        // check if user exists in DB
        let user = await User.findOne({ clerkId: userId });

        if (!user) {

            // create new user
            user = await User.create({
                clerkId: userId,
                email,
                name,
                role: clerkRole,
                adminKey: clerkRole === "admin" ? clerkKey : null
            });

            console.log("🆕 New User Created:", email);

        } else {

            // role update
            if (user.role !== clerkRole) {
                user.role = clerkRole;
                console.log("🔄 User role updated:", clerkRole);
            }

            // ---- ADMIN KEY LOGIC ----
            if (clerkRole === "admin") {

                // if DB doesn't have key → save it
                if (!user.adminKey && clerkKey) {
                    user.adminKey = clerkKey;
                    console.log("🔑 Admin key saved in DB");
                }

                // if key changed in clerk → update DB
                else if (user.adminKey && clerkKey && user.adminKey !== clerkKey) {
                    user.adminKey = clerkKey;
                    console.log("🔄 Admin key updated from Clerk");
                }

            }

            await user.save();
        }

        // attach DB user to request
        req.dbUser = user;

        next();

    } catch (err) {
        console.error("Sync User Error:", err);
        next(err);
    }
};

export default syncUser;



