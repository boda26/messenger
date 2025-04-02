import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaRegCheckCircle } from "react-icons/fa";

const Message = ({ message, currentFriend, scrollRef, typingMessage }) => {
    const { myInfo } = useSelector((state) => state.auth);

    return (
        <>
            <div className="message-show">
                {message && message.length > 0 ? (
                    message.map((m, index) =>
                        m.senderId === myInfo.id ? (
                            <div className="my-message" ref={scrollRef}>
                                <div className="image-message">
                                    <div className="my-text">
                                        <p className="message-text">
                                            {m.message.text === "" ? (
                                                <img
                                                    src={`./image/${m.message.image}`}
                                                />
                                            ) : (
                                                m.message.text
                                            )}
                                        </p>
                                        {index === message.length - 1 &&
                                        m.senderId === myInfo.id ? (
                                            m.status === "seen" ? (
                                                <img
                                                    src={`./image/${currentFriend.image}`}
                                                    alt=""
                                                    className="img"
                                                />
                                            ) : m.status === "delivered" ? (
                                                <span>
                                                    <FaRegCheckCircle />
                                                </span>
                                            ) : (
                                                <span>
                                                    <FaRegCheckCircle />
                                                </span>
                                            )
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className="time">
                                    {moment(m.createdAt)
                                        .startOf("mini")
                                        .fromNow()}
                                </div>
                            </div>
                        ) : (
                            <div className="fd-message" ref={scrollRef}>
                                <div className="image-message-time">
                                    <img
                                        src={`./image/${currentFriend.image}`}
                                        alt=""
                                    />
                                    <div className="message-time">
                                        <div className="fd-text">
                                            <p className="message-text">
                                                {m.message.text === "" ? (
                                                    <img
                                                        src={`./image/${m.message.image}`}
                                                    />
                                                ) : (
                                                    m.message.text
                                                )}
                                            </p>
                                        </div>
                                        <div className="time">
                                            {moment(m.createdAt)
                                                .startOf("mini")
                                                .fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                ) : (
                    <div className="friend_connect">
                        <img src={`./image/${currentFriend.image}`} alt="" />
                        <h3>{currentFriend.userName} connected you</h3>
                        <span>
                            {moment(currentFriend.createdAt)
                                .startOf("mini")
                                .fromNow()}
                        </span>
                    </div>
                )}
            </div>

            {typingMessage &&
            typingMessage.msg &&
            typingMessage.senderId === currentFriend._id ? (
                <div className="typing-message">
                    <div className="fd-message">
                        <div className="image-message-time">
                            <img
                                src={`./image/${currentFriend.image}`}
                                alt=""
                            />
                            <div className="message-time">
                                <div className="fd-text">
                                    <p className="time">Typing message...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
        </>
    );
};

export default Message;
