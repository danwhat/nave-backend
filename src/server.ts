import express from 'express';
import 'dotenv/config';
import checkToken from './middleware/checkToken';
import userController from './controllers/userController';

const server = express();
server.use(express.json());

server.get('/', checkToken, (req, res) => {
  res.send('oi');
});
server.post('/signup', userController.signup);
server.post('/login', userController.login);

server.listen(3000);
