import { toast } from 'react-toastify';
import axios from "axios";
const URL = {
    serverEndPoint: "http://localhost:4000",
    services: {
        signUp: "/signUp",
        logIn: "/logIn",
        logOut: "/logOut",
        auth: "/auth",
        allUser: "/allUser",
        startRoomOOO: "/startRoomOOO",
        startRoomGrp: "/startRoomGrp",
        getMsg: "/getMsg",
        renameGrp: "/renameGrp",
        addUser: "/addUser",
        removeUser: "/removeUser",
        getTalks: "/getTalks",
        sendTalk: "/sendTalk"
    }
}
export default function Apicall(endpoint, input) {
    endpoint = URL.serverEndPoint + URL.services[endpoint];
    const setup = {
        withCredentials: true,
    }
    return axios.post(endpoint, input, setup)
        .then((response) => {
            if (response.status === 401) {
                toast.warn(`Unauthorized Request`);
                return response.data;
            }
            if (response.data.status === "success" && response.data.msg) {
                toast.success(`${response.data.msg}`);
            } else if (response.data.status === "error" && response.data.msg) {
                toast.warn(`${response.data.msg}`);
            } else if (response.data?.data) {
                return response.data;
            }
            return response.data;
        }).catch((err) => {
            toast.warn(err.message);
            return err.message;
        })
}