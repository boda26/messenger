import axois from "axios";
import { FRIEND_GET_SUCCESS } from "../types/messengerType";

export const getFriends = () => async (dispatch) => {
    try {
        const response = await axois.get("http://localhost:5050/api/messenger/get-friends", { withCredentials: true });
        dispatch({
			type: FRIEND_GET_SUCCESS,
			payload: {
				friends: response.data.friends
			}
		})
    } catch (error) {
        console.log(error.response.data);
    }
};
