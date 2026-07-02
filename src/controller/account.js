const accountModel = require("../model/account");

exports.createAccount = async (req, res) => {
    try {
        const user = req.user;

        const account = await accountModel.create({
            user: user._id
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            account
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to create account",
            error: err.message
        });
    }
};

