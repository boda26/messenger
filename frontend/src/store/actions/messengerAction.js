import axois from "axios";
import {
    FRIEND_GET_SUCCESS,
    MESSAGE_GET_SUCCESS,
    MESSAGE_SEND_SUCCESS,
    THEME_GET_SUCCESS,
    THEME_SET_SUCCESS,
} from "../types/messengerType";
import axios from "axios";

export const getFriends = () => async (dispatch) => {
    try {
        const response = await axois.get(
            "http://localhost:5050/api/messenger/get-friends",
            { withCredentials: true }
        );
        dispatch({
            type: FRIEND_GET_SUCCESS,
            payload: {
                friends: response.data.friends,
            },
        });
    } catch (error) {
        console.log(error.response.data);
    }
};

export const messageSend = (data) => async (dispatch) => {
    try {
        const response = await axois.post(
            "http://localhost:5050/api/messenger/send-message",
            data,
            { withCredentials: true }
        );
        dispatch({
            type: MESSAGE_SEND_SUCCESS,
            payload: {
                message: response.data.message,
            },
        });
    } catch (error) {
        console.log(error.response.data);
    }
};

export const getMessage = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(
                `http://localhost:5050/api/messenger/get-message/${id}`,
                { withCredentials: true }
            );
            dispatch({
                type: MESSAGE_GET_SUCCESS,
                payload: {
                    message: response.data.message,
                },
            });
        } catch (error) {
            console.log(error.response.data);
        }
    };
};

export const ImageMessageSend = (data) => async (dispatch) => {
    try {
        const response = await axios.post(
            `http://localhost:5050/api/messenger/image-message-send`,
            data,
            { withCredentials: true }
        );
        dispatch({
            type: MESSAGE_SEND_SUCCESS,
            payload: {
                message: response.data.message,
            },
        });
    } catch (error) {
        console.log(error.response.data);
    }
};

export const seenMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post(
            `http://localhost:5050/api/messenger/seen-message`,
            msg,
            { withCredentials: true }
        );
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message);
    }
};

export const updateMessage = (msg) => async (dispatch) => {
    try {
        const response = await axios.post(
            `http://localhost:5050/api/messenger/delivered-message`,
            msg,
            { withCredentials: true }
        );
        console.log(response.data);
    } catch (error) {
        console.log(error.response.message);
    }
};

export const getTheme = () => async (dispatch) => {
    const theme = localStorage.getItem("theme");
    dispatch({
        type: THEME_GET_SUCCESS,
        payload: {
            theme: theme ? theme : "white",
        },
    });
};

export const themeSet = (theme) => async (dispatch) => {
    localStorage.setItem("theme", theme);
    dispatch({
        type: THEME_SET_SUCCESS,
        payload: {
            theme: theme,
        },
    });
};
