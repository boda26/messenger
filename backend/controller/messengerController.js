const User = require("../models/authModel");
const messageModel = require("../models/messageModel");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const getLastMessage = async (myId, fdId) => {
    const msg = await messageModel
        .findOne({
            $or: [
                {
                    $and: [
                        {
                            senderId: {
                                $eq: myId,
                            },
                        },
                        {
                            receiverId: {
                                $eq: fdId,
                            },
                        },
                    ],
                },
                {
                    $and: [
                        {
                            senderId: {
                                $eq: fdId,
                            },
                        },
                        {
                            receiverId: {
                                $eq: myId,
                            },
                        },
                    ],
                },
            ],
        })
        .sort({
            updatedAt: -1,
        });
    return msg;
};

module.exports.getFriends = async (req, res) => {
    const myId = req.myId;
    let fnd_msg = [];
    try {
        const friendGet = await User.find({
            _id: {
                $ne: myId,
            },
        });
        // const filter = friendGet.filter((d) => d.id !== myId);

        for (let i = 0; i < friendGet.length; i++) {
            let lmsg = await getLastMessage(myId, friendGet[i].id);
            fnd_msg = [
                ...fnd_msg,
                {
                    fndInfo: friendGet[i],
                    msgInfo: lmsg,
                },
            ];
        }

        res.status(200).json({
            success: true,
            friends: fnd_msg,
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
        let getAllMessage = await messageModel.find({
            $or: [
                {
                    $and: [
                        {
                            senderId: {
                                $eq: myId,
                            },
                        },
                        {
                            receiverId: {
                                $eq: fdId,
                            },
                        },
                    ],
                },
                {
                    $and: [
                        {
                            senderId: {
                                $eq: fdId,
                            },
                        },
                        {
                            receiverId: {
                                $eq: myId,
                            },
                        },
                    ],
                },
            ],
        });
        // getAllMessage = getAllMessage.filter(
        //     (m) =>
        //         (m.senderId === myId && m.receiverId === fdId) ||
        //         (m.receiverId === myId && m.senderId === fdId)
        // );
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
            return res
                .status(400)
                .json({ error: { errorMessage: "Form parsing error" } });
        }

        const senderName = Array.isArray(fields.senderName)
            ? fields.senderName[0]
            : fields.senderName;
        const receiverId = Array.isArray(fields.receiverId)
            ? fields.receiverId[0]
            : fields.receiverId;
        const imageName = Array.isArray(fields.imageName)
            ? fields.imageName[0]
            : fields.imageName;

        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const safeImageName = Array.isArray(imageName)
            ? imageName[0]
            : imageName;
        file.originalFilename = safeImageName;

        const destinationDir = "frontend/public/image";
        const newPath = path.join(destinationDir, file.originalFilename);
        const safeFilePath = Array.isArray(file.filepath)
            ? file.filepath[0]
            : file.filepath;

        try {
            fs.copyFile(safeFilePath, newPath, async (err) => {
                if (err) {
                    return res.status(500).json({
                        error: { errorMessage: "Image upload failed!" },
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
                error: { errorMessage: "Internal server error" },
            });
        }
    });
};

module.exports.messageSeen = async (req, res) => {
    const messageId = req.body._id;
    await messageModel
        .findByIdAndUpdate(messageId, {
            status: "seen",
        })
        .then(() => {
            res.status(200).json({
                success: true,
            });
        })
        .catch(() => {
            res.status(500).json({
                error: {
                    errorMessage: "internal server error",
                },
            });
        });
};

module.exports.deliveredMessage = async (req, res) => {
    const messageId = req.body._id;
    await messageModel
        .findByIdAndUpdate(messageId, {
            status: "delivered",
        })
        .then(() => {
            res.status(200).json({
                success: true,
            });
        })
        .catch(() => {
            res.status(500).json({
                error: {
                    errorMessage: "internal server error",
                },
            });
        });
};
