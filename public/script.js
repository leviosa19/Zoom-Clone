const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '443'
})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true
}).then(stream => {
	myVideoStream = stream;
	addVideoStream(myVideo, stream)
	myPeer.on('call', call => {
		console.log("Before answer: " + call)
		call.answer(stream)
		console.log("After answer: " + call)
		const video = document.createElement('video')
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream)
		})
	})

	socket.on('user-connected', userId => {
		connectToNewUser(userId, stream)
	})
	// input value
	let text = $("input");
	// when press enter send message
	$('html').keydown(function (e) {
		if (e.which == 13 && text.val().length !== 0) {
			socket.emit('message', text.val());
			text.val('')
		}
	});
	socket.on("createMessage", message => {
		$("ul").append(`<li class="message"><p><span class='UserName'>user</span><br/>${message}</p></li>`);
		scrollToBottom()
	})
})

socket.on('user-disconnected', userId => {
	if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
	socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
	console.log("User connected: " + userId)
	const call = myPeer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', userVideoStream => {
		addVideoStream(video, userVideoStream)
	})
	call.on('close', () => {
		video.remove()
		console.log("User Disconnectd: " + userId)
	})

	peers[userId] = call
}

function addVideoStream(video, stream) {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}



const scrollToBottom = () => {
	var d = $('.main__chat_window');
	d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
	const enabled = myVideoStream.getAudioTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getAudioTracks()[0].enabled = false;
		setUnmuteButton();
		console.log("Unmuted")
	} else {
		setMuteButton();
		console.log("Muted")
		myVideoStream.getAudioTracks()[0].enabled = true;
	}
}

const playStop = () => {
	let enabled = myVideoStream.getVideoTracks()[0].enabled;
	if (enabled) {
		myVideoStream.getVideoTracks()[0].enabled = false;
		setPlayVideo()
		console.log("Video is OFF")
	} else {
		setStopVideo()
		console.log("Video is ON")
		myVideoStream.getVideoTracks()[0].enabled = true;
	}
}

const setMuteButton = () => {
	const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
	document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
	const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
	document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
	const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
	document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
	const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
	document.querySelector('.main__video_button').innerHTML = html;
}