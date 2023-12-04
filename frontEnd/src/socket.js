import { io } from 'socket.io-client';
import ENV from "./data/env"

export const socket = io(ENV.serverEndPoint);