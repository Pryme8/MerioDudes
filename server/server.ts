import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received: ${message}`);
  });
  ws.send('Hello from server!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});