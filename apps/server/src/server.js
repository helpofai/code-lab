const http = require('http');
const app = require('./app');
const { connectDB, sequelize } = require('./config/db');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const startServer = async () => {
  await connectDB();
  require('./models'); // This ensures all models and associations are loaded
  await sequelize.sync(); 
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
