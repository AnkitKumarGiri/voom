import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';

import {
    ADD_STREAM,
    MY_STREAM,
    ADD_REMOTE_STREAM
} from './types';

// API URI
export const API_URI = "http://192.168.1.226:5000"

// Peer Config
const peerServer = new Peer(undefined, {
    host: '192.168.1.226',
    secure: false,
    port: 5000,
    path: '/mypeer',
});

console.log(peerServer)

peerServer.on('error', () => console.log('error peer'))

// Socket config
export const socket = IO(`${API_URI}`, {
    forceNew: true,
});

socket.on('connection',() => console.log("Connected Client"))


export const joinRoom = (stream) => async(dispatch) => {

    const roomID = "asdasdasdsadsadsadawqqwq2e";

    // Set my own stream
    dispatch({type: MY_STREAM, payload: stream});

    peerServer.on('open', (userId) => {
        socket.emit('join-room', {userId, roomID});
    });

    socket.on('user-connected', (userId)=> {
        connectToNewUser(userId, stream, dispatch);
    });

    // Recieve a call
    peerServer.on('call', (call)=> {
        call.answer(stream);

        // Stream back the call
        call.on('stream', (stream) => {
            dispatch({type: ADD_STREAM, payload: stream});
        })
    })
};

function connectToNewUser(userId, stream, dispatch) {
       const call = peerServer.call(userId, stream);
}