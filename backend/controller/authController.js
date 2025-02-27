const formidable = require("formidable");
const validator = require("validator");
const fs = require("fs");
const bcrypt = require("bcrypt");
const registerModel = require("../models/authModel");
const path = require("path");
const jwt = require("jsonwebtoken");

module.exports.userRegister = (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        const image = files.image?.[0];
        const userName = fields.userName?.[0] || ""; // Ensure it's a string
        const email = fields.email?.[0] || "";
        const password = fields.password?.[0] || "";
        const confirmPassword = fields.confirmPassword?.[0] || "";

        const error = [];
        if (!userName) {
            error.push("please provide username");
        }
        if (!email) {
            error.push("please provide email");
        }
        if (email && !validator.isEmail(email)) {
            error.push("please provide a valid email");
        }
        if (!password) {
            error.push("please provide a password");
        }
        if (!confirmPassword) {
            error.push("please confirm your password");
        }
        if (password && confirmPassword && password !== confirmPassword) {
            error.push("your password and confirm password are not same");
        }
        if (password && password.length < 6) {
            error.push("your password must be longer than 6 characters");
        }
        if (Object.keys(files).length === 0) {
            error.push("please provide user image");
        }
        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error,
                },
            });
        } else {
            const getImageName = image.originalFilename;
            const randNumber = Math.floor(Math.random() * 99999);
            const newImageName = randNumber + getImageName;
            image.originalFilename = newImageName;
            const destinationDir = "frontend/public/image";
            const newPath = path.join(destinationDir, image.originalFilename);
            try {
                const checkUser = await registerModel.findOne({
                    email: email,
                });
                if (checkUser) {
                    res.status(404).json({
                        error: {
                            errorMessage: ["Email already in use"],
                        },
                    });
                } else {
                    fs.copyFile(image.filepath, newPath, async (error) => {
                        // if (error) {
                        //     console.error("Error copying file:", error);
                        //     return res.status(500).json({
                        //         error: {
                        //             errorMessage: ["Failed to save image"],
                        //         },
                        //     });
                        // }
                        if (!error) {
                            const userCreate = await registerModel.create({
                                userName,
                                email,
                                password: await bcrypt.hash(password, 10),
                                image: image.originalFilename,
                            });
                            console.log("registration completed successfully");

                            const token = jwt.sign(
                                {
                                    id: userCreate._id,
                                    email: userCreate.email,
                                    userName: userCreate.userName,
                                    image: userCreate.image,
                                    registerTime: userCreate.createdAt,
                                },
                                process.env.SECRET,
                                {
                                    expiresIn: process.env.TOKEN_EXP,
                                }
                            );
                            const options = {
                                expires: new Date(
                                    Date.now() +
                                        process.env.COOKIE_EXP *
                                            24 *
                                            60 *
                                            60 *
                                            1000
                                ),
                            };
                            res.status(201)
                                .cookie("authToken", token, options)
                                .json({
                                    successMessage: "Registration successful!",
                                    token,
                                });
                        } else {
                            res.status(500).json({
                                error: {
                                    errorMessage: ["internal server error"],
                                },
                            });
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({
                    error: {
                        errorMessage: ["internal server error"],
                    },
                });
            }
        }
    });
};
