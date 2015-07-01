var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var redis = require("redis"),
        client = redis.createClient();


app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('client_out_going', function (data) {
    console.log(data);
    client.hset("hash key", data+"key", data+"value", redis.print);
    client.hkeys("hash key", function (err, replies) {
          console.log(replies.length + " replies:");
          replies.forEach(function (reply, i) {
              console.log("    " + i + ": " + reply);
          });
          socket.emit('server_message',JSON.stringify(replies));
      });
  });

  socket.on("flush_cache",function(data){
    client.flushall();
  });
});
