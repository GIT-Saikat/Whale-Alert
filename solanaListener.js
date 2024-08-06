const solanaWeb3 = require('@solana/web3.js');
const mongoose = require('mongoose');
const Transaction = require('./models/transaction'); // Import your Transaction model

const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

const monitorWhaleTransactions = async () => {
  connection.onLogs(solanaWeb3.LOGS, async (logs) => {
    logs.forEach(async (log) => {
      if (isWhaleTransaction(log)) {
        console.log('Whale transaction detected:', log);
        await saveTransaction(log);
        // Emit an event or notify clients as needed
      }
    });
  });
};

const isWhaleTransaction = (log) => {
  // Define your whale transaction criteria
  return log.amount > 1000; // Example threshold
};

const saveTransaction = async (log) => {
  const transaction = new Transaction({
    signature: log.signature,
    amount: log.amount,
    date: new Date(),
  });
  await transaction.save();
};

monitorWhaleTransactions();

const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const notifyClients = (log) => {
  socket.emit('whaleTransaction', log);
};
