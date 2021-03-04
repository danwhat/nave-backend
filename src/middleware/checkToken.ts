import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const checkToken = async (req: Request, res: Response, next: any) : Promise<Response> => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, process.env.SECRET);
    return next();
  } catch {
    return res.send('errou');
  }
};

export default checkToken;
