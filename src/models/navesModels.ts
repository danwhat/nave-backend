import connection from './connection';

const getAll = async (userId: number) : Promise<unknown> => {
  const [user] = await connection.execute(
    'SELECT * FROM navedb.naves WHERE users_id=?;', [userId],
  );
  return user;
};

const createNave = async (
  name: string,
  birthdate: string,
  admissionDate: string,
  jobRole: string,
  usersId: number,
) : Promise<void> => {
  await connection.execute(
    'INSERT INTO navedb.naves (name, birthdate, admission_date, job_role, users_id) VALUES (?, ?, ?, ?, ?);',
    [name, birthdate, admissionDate, jobRole, usersId],
  );
};

export default { createNave, getAll };
