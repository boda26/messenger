import React, { useState, useRef } from "react";
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa";
import ActiveFriend from "./ActiveFriend";
import Friends from "./Friends";
import RightSide from "./RightSide";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    getFriends,
    messageSend,
    getMessage,
    ImageMessageSend,
} from "../store/actions/messengerAction";
import { io } from "socket.io-client";

export const Messenger = () => {
    const { myInfo } = useSelector((state) => state.auth);
    const { friends, message } = useSelector((state) => state.messenger);
    const [currentFriend, setCurrentFriend] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState("");
    const [typingMessage, setTypingMessage] = useState("");
    const scrollRef = useRef();
    const socket = useRef();

    const inputHandle = (e) => {
        setNewMessage(e.target.value);
        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg: e.target.value,
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        const data = {
            senderName: myInfo.userName,
            receiverId: currentFriend._id,
            message: newMessage ? newMessage : "❤",
        };

        socket.current.emit("sendMessage", {
            senderId: myInfo.id,
            senderName: myInfo.userName,
            receiverId: currentFriend._id,
            time: new Date(),
            message: {
                text: newMessage ? newMessage : "❤",
                image: "",
            },
        });

        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg: "",
        });

        dispatch(messageSend(data));
        setNewMessage("");
    };

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriends());
    }, []);

    useEffect(() => {
        if (friends && friends.length > 0) {
            setCurrentFriend(friends[0]);
        }
    }, [friends]);

    useEffect(() => {
        dispatch(getMessage(currentFriend._id));
    }, [currentFriend?._id]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    useEffect(() => {
        socket.current = io("ws://localhost:8000");

        socket.current.on("getMessage", (data) => {
            setSocketMessage(data);
        });

        socket.current.on("typingMessageGet", (data) => {
            setTypingMessage(data);
        });
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", myInfo.id, myInfo);
    }, []);

    useEffect(() => {
        if (socketMessage && currentFriend) {
            if (
                socketMessage.senderId === currentFriend._id &&
                socketMessage.receiverId === myInfo.id
            ) {
                dispatch({
                    type: "SOCKET_MESSAGE",
                    payload: {
                        message: socketMessage,
                    },
                });
            }
        }
    }, [socketMessage]);

    useEffect(() => {
        socket.current.on("getUser", (users) => {
            const filterUser = users.filter((u) => u.userId !== myInfo.id);
            setActiveUser(filterUser);
        });
    }, []);

    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);
        socket.current.emit("typingMessage", {
            senderId: myInfo.id,
            receiverId: currentFriend._id,
            msg: emu,
        });
    };

    const imageSend = (e) => {
        if (e.target.files.length !== 0) {
            const imageName = e.target.files[0].name;
            const newImageName = Date.now() + imageName;

            socket.current.emit("sendMessage", {
                senderId: myInfo.id,
                senderName: myInfo.userName,
                receiverId: currentFriend._id,
                time: new Date(),
                message: {
                    text: "",
                    image: newImageName,
                },
            });

            const formData = new FormData();
            formData.append("imageName", newImageName);
            formData.append("senderName", myInfo.userName);
            formData.append("receiverId", currentFriend._id);
            formData.append("image", e.target.files[0]);
            dispatch(ImageMessageSend(formData));
        }
    };

    return (
        <div className="messenger">
            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <div className="top">
                            <div className="image-name">
                                <div className="image">
                                    <img
                                        src={`./image/${myInfo.image}`}
                                        alt=""
                                    />
                                </div>
                                <div className="name">
                                    <h3>{myInfo.userName}</h3>
                                </div>
                            </div>

                            <div className="icons">
                                <div className="icon">
                                    <FaEllipsisH />
                                </div>
                                <div className="icon">
                                    <FaEdit />
                                </div>
                            </div>
                        </div>

                        <div className="friend-search">
                            <div className="search">
                                <button>
                                    <FaSistrix />
                                </button>
                                <input
                                    type="text"
                                    placeholder="search"
                                    className="form-control"
                                />
                            </div>
                        </div>

                        <div className="active-friends">
                            {activeUser && activeUser.length > 0
                                ? activeUser.map((u) => (
                                      <ActiveFriend
                                          setCurrentFriend={setCurrentFriend}
                                          user={u}
                                      />
                                  ))
                                : ""}
                        </div>

                        <div className="friends">
                            {friends && friends.length > 0
                                ? friends.map((fd) => (
                                      <div
                                          className={
                                              currentFriend._id === fd._id
                                                  ? "hover-friend active"
                                                  : "hover-friend"
                                          }
                                          onClick={() => setCurrentFriend(fd)}
                                      >
                                          <Friends friend={fd} />
                                      </div>
                                  ))
                                : "No Friend"}
                        </div>
                    </div>
                </div>
                {currentFriend ? (
                    <RightSide
                        currentFriend={currentFriend}
                        inputHandle={inputHandle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        imageSend={imageSend}
                        activeUser={activeUser}
                        typingMessage={typingMessage}
                    />
                ) : (
                    "Please select your friend!"
                )}
            </div>
        </div>
    );
};
