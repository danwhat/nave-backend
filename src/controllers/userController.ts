import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, checkUser } from '../models/usersModels';

const login = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;
  const response = await checkUser(email, password);
  if (response) {
    const token = jwt.sign({ email, id: 1 }, process.env.SECRET, { expiresIn: '30m', algorithm: 'HS256' });
    return res.status(200).send({ token });
  }
  return res.status(401).send({ message: 'email ou usuário errado' });
};

const signup = async (req: Request, res: Response) : Promise<Response> => {
  const { email, password } = req.body;
  await createUser(email, password);
  return res.status(201).send({ message: `Usuário com email ${email} criado com sucesso.` });
};

export default { login, signup };
