import { io } from 'socket.io-client';
import ENV from "./data/env"

export const socket = io("https://chatter-o89b.onrender.com:4000");
