import connection from './connection';

const getUser = async () : Promise<unknown> => {
  const [user] = await connection.execute(
    'SELECT * FROM navedb.users;',
  );
  return user;
};

const checkUser = async (login: string, password: string) : Promise<boolean> => {
  const [user] = await connection.execute(
    'SELECT * FROM navedb.users WHERE email=? AND password=?;', [login, password],
  );
  if (user[0]) return true;
  return false;
};

const createUser = async (login: string, password: string) : Promise<void> => {
  await connection.execute(
    'INSERT INTO navedb.users(email, password) VALUES ( ?, ?);', [login, password],
  );
};

export { createUser, getUser, checkUser };
