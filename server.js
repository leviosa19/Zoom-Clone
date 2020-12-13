const express = require('express')
const { Server } = require('socket.io')
const app = express()

const cors = require('cors')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
	debug: true
})
const { v4: uuidv4 } = require('uuid')

app.use('/peerjs', peerServer)

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(cors())

app.get('/', (req, res) => {
	res.redirect("/room-id?" + uuidv4())
})

app.get("/room-id?:room", (req, res) => {
	res.render('index', { roomId: req.params.room })
})

// connections
io.on('connection', socket => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId);
		// messages
		socket.on('message', (message) => {
			//send message to the same room
			io.to(roomId).emit('createMessage', message)
		});

		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId)
		})
	})
})

server.listen(process.env.PORT || 5001)