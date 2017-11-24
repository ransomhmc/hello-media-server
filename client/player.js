
var socket = io.connect('http://localhost:8000');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });

 socket.on('load', (url) => {
 	console.log('load url:'+url)
 	player.src(url)
 })

 socket.on('play', () => {
 	console.log('play')
 	player.play()
 })

 socket.on('stop', () => {
 	player.stop()
 })

 socket.on('pause', () => {
 	player.pause()
 })

 socket.on('mute', () => {
 	player.muted(true)
 })

 socket.on('unmute', () => {
 	player.muted(false)
 })

var player = videojs('player', {
	controls: true,
	autoplay: false,
	preload: 'auto'
});


player.ready( () => {
	socket.emit('playerMsg','ready')
	player.src('http://www.html5videoplayer.net/videos/toystory.mp4')
	//player.src('http://127.0.0.1:8000/testVideo1.mp4')
	//player.src('http://127.0.0.1:9999/qqq296.mp4')	
	
})