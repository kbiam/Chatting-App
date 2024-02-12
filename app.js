var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { Socket } = require('socket.io-client');
const io = new Server(server);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(express.static(path.join(__dirname, 'public')));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', (socket) => {
  socket.on('nickname',(nickname)=>{
    io.emit('emiited-nickname',nickname);
    io.emit('new connection',nickname);

  });
  socket.on('user-message',(messages)=>{
    io.emit('emitted-message',messages);
    // console.log('message: ' + messages);
  })
  socket.on('typing',(nickname)=> {
    io.emit('typer',nickname)

});
})

server.listen(3001);
module.exports = app;
