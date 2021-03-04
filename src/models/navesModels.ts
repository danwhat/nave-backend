import connection from './connection';

const getAll = async (userId: number) : Promise<unknown> => {
  const [user] = await connection.execute(
    'SELECT * FROM navedb.naves WHERE users_id=?;', [userId],
  );
  return user;
};

const getById = async (id: number) : Promise<unknown> => {
  const nave = await connection.execute(
    'SELECT * FROM navedb.naves WHERE id=?;', [id],
  );
  return nave[0];
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

const editNave = async (
  name: string,
  birthdate: string,
  admissionDate: string,
  jobRole: string,
  id: number,
) : Promise<void> => {
  await connection.execute(
    'UPDATE navedb.naves SET name = ?, birthdate = ?, admission_date = ?, job_role = ? WHERE id = ?;',
    [name, birthdate, admissionDate, jobRole, id],
  );
};

const deleteNave = async (id: number) : Promise<void> => {
  await connection.execute(
    'DELETE FROM navedb.naves WHERE id=?;', [id],
  );
};

export default {
  createNave, getAll, getById, editNave, deleteNave,
};
