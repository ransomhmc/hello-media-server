var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs')
var path = require('path');

server.listen(8000);

var clientSocket = null

function toClient(msg,data) {
	if (clientSocket == null ) {
		console.log('toClient: null')
		return
	}

	clientSocket.emit(msg,data)
}

app.get('/player', (req,res) => {
	res.sendFile(path.resolve(__dirname+'/../client/player.html'));
})
app.get('/poster.jpg', (req,res) => {
	res.sendFile(path.resolve(__dirname+'/../client/poster.jpg'));
})
app.get('/player.js', (req,res) => {
	res.sendFile(path.resolve(__dirname+'/../client/player.js'));
})

app.get('/controller', (req,res) => {
	res.sendFile(path.resolve(__dirname+'/../client/controller.html'));
})


app.get('/testVideo1.mp4', (req,res) => {
	//ref: https://medium.com/@daspinola/video-stream-with-node-js-and-html5-320b3191a6b6
	console.log(req.headers)
	const path = '/Users/raymond/temp/qqq296.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1] 
		? parseInt(parts[1], 10)
		: fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
})

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
})

app.get('/load', (req,res) => {
	var url = req.query.videoURL
	console.log('load url:'+url)
	toClient('load',url)
	res.sendStatus(200)
})

app.get('/play', (req,res) => {
	console.log('play')
	toClient('play','')
	res.sendStatus(200)
})

app.get('/pause', (req,res) => {
	toClient('pause','')
	res.sendStatus(200)
})

app.get('/stop', (req,res) => {
	toClient('stop','')
	res.sendStatus(200)
})

app.get('/mute', (req,res) => {
	toClient('mute','')
	res.sendStatus(200)
})

app.get('/unmute', (req,res) => {
	toClient('unmute','')
	res.sendStatus(200)
})

io.on('connection', function (socket) {
	clientSocket = socket
	socket.emit('news', { hello: 'world' })
	socket.on('my other event', function (data) {
		console.log(data);
	})

	socket.on('playerMsg', (data) => {
		console.log('from player: '+data)
	})

})