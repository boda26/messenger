import axois from "axios";
import {
    FRIEND_GET_SUCCESS,
    MESSAGE_GET_SUCCESS,
    MESSAGE_SEND_SUCCESS,
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
