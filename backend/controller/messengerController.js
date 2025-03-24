const User = require("../models/authModel");
const messageModel = require("../models/messageModel");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

module.exports.getFriends = async (req, res) => {
    const myId = req.myId;
    try {
        const friendGet = await User.find({});
        const filter = friendGet.filter((d) => d.id !== myId);
        res.status(200).json({
            success: true,
            friends: filter,
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "internal server error",
            },
        });
    }
};

module.exports.messageUploadDB = async (req, res) => {
    const { senderName, receiverId, message } = req.body;
    const senderId = req.myId;
    try {
        const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            receiverId: receiverId,
            message: {
                text: message,
                image: "",
            },
        });
        res.status(201).json({
            success: true,
            message: insertMessage,
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "internal server error",
            },
        });
    }
};

module.exports.messageGet = async (req, res) => {
    const myId = req.myId;
    const fdId = req.params.id;
    try {
        let getAllMessage = await messageModel.find({});
        getAllMessage = getAllMessage.filter(
            (m) =>
                (m.senderId === myId && m.receiverId === fdId) ||
                (m.receiverId === myId && m.senderId === fdId)
        );
        res.status(200).json({
            success: true,
            message: getAllMessage,
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: "internal server error",
            },
        });
    }
};

module.exports.imageMessageSend = (req, res) => {
    const senderId = req.myId;
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: { errorMessage: "Form parsing error" } });
        }

        const senderName = Array.isArray(fields.senderName) ? fields.senderName[0] : fields.senderName;
        const receiverId = Array.isArray(fields.receiverId) ? fields.receiverId[0] : fields.receiverId;
        const imageName = Array.isArray(fields.imageName) ? fields.imageName[0] : fields.imageName;

        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const safeImageName = Array.isArray(imageName) ? imageName[0] : imageName;
        file.originalFilename = safeImageName;

        const destinationDir = "frontend/public/image";
        const newPath = path.join(destinationDir, file.originalFilename);
        const safeFilePath = Array.isArray(file.filepath) ? file.filepath[0] : file.filepath;

        try {
            fs.copyFile(safeFilePath, newPath, async (err) => {
                if (err) {
                    return res.status(500).json({
                        error: { errorMessage: "Image upload failed!" }
                    });
                }

                const insertMessage = await messageModel.create({
                    senderId,
                    senderName,
                    receiverId,
                    message: {
                        text: "",
                        image: file.originalFilename,
                    },
                });

                res.status(201).json({
                    success: true,
                    message: insertMessage,
                });
            });
        } catch (error) {
            res.status(500).json({
                error: { errorMessage: "Internal server error" }
            });
        }
    });
};

