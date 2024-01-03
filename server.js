import http from 'http';
import app from './app/app.js';

// creating the server
const PORT = process.env.PORT || 7000;
const server = http.createServer(app);

// server listening on port when successfully run
server.listen(PORT, console.log(`Server up and running on port ${PORT}`));