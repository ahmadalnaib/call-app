const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const POST = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('servier is running');
});

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
  });

  socket.on('calluser', ({ userToCall, singnalData, from, name }) => {
    io.to(userToCall).emit('calluser', { signal: singnalData, from, name });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal);
  });
});

server.listen(POST, () => console.log('server run'));
