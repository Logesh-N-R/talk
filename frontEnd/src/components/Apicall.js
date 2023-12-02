import { toast } from 'react-toastify';
import axios from "axios";
const URL = {
    serverEndPoint: "http://localhost:4000",
    services: {
        signUp: "/844c62b1fbf4d74286afab7e8af47a026bdb1647cbe8730b0466b2ee6ad75a43",
        logIn: "/2708d0932454740f522d2d58dfd3ff0021fa0d6abcf4a4653d141874cedfdde1",
        getMsg: "/f11e9ffe2e91b0aaeb66ecdaa1c10c86d73b10554286f03f27e572cb31b221f5",
        sendMsg: "/31e06f7d89feb99a0e6c0affe198748c3bb5bef5e3cc92d95cb9e996197d3fc3",
        getHomeData: "/getHomeData",
        startRoom: "/startRoom",
        auth: "/auth"
    }
}
export default function Apicall(endpoint, input) {
    endpoint = URL.serverEndPoint + URL.services[endpoint];
    const setup = {
        withCredentials: true,
    }
    return axios.post(endpoint, input, setup)
        .then((response) => {
            if (response.status == 401) {
                toast.warn(`Unauthorized Request`);
                return response.data;
            }
            if (response.data.status == "success") {
                toast.success(`${response.data.msg}`);
            } else if (response.data.status == "error") {
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