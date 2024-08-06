const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/whalealert', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

// Define routes here
app.get('/api/transactions', async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Notify clients of new whale transactions
const notifyClients = (log) => {
  io.emit('whaleTransaction', log);
};

http.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
