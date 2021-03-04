import jwt from 'jsonwebtoken';

interface Token {
  email: string;
  id: number;
  iat: number;
  exp: number;
}

export default (token: string) : Token => {
  const decoded = jwt.verify(token, process.env.SECRET);
  return decoded;
};
