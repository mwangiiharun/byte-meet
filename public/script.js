const socket = io('/');
const myVideo = document.createElement('video');
const videoGrid = document.getElementById('video-grid');
myVideo.muted = true;

var peer = new Peer(undefined,{
    path: '/peerjs',
    host: '/',
    port: '3030'
});
let videoStream;

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
}).then(stream => {
    videoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });

    })

    socket.on('user-connected', userID => {
        setTimeout(()=>connectToNewUser(userID, stream),1000)
    })
});

peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


socket.emit('join-room',ROOM_ID);


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, videoStream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });
};


const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
};