import connection from './connection';

enum FiltersName {
  name = 'name',
  admissionDate = 'admission_date',
  jobRole = 'job_role',
}

const getAllByFilter = async (
  userId: number,
  search: string,
  filterBy: string,
) : Promise<unknown> => {
  if (search && filterBy) {
    const [navers] = await connection.execute(
      `SELECT 
      id, name, birthdate, admission_date, job_role
      FROM navedb.navers
      WHERE users_id=${userId} AND ${FiltersName[filterBy]} = '${search}';`,
    );
    return navers;
  }
  const [navers] = await connection.execute(
    `SELECT id, name, birthdate, admission_date, job_role
    FROM navedb.navers WHERE users_id=${userId};`,
  );
  return navers;
};

const getById = async (id: string) : Promise<unknown> => {
  const nave = await connection.execute(
    'SELECT * FROM navedb.navers WHERE id=?;', [id],
  );
  return nave[0];
};

const getByArrayId = async (arrayId: string[]) : Promise<unknown> => {
  if (arrayId.length === 0) return [];

  // criando a querry
  let querry = 'SELECT * FROM navedb.navers WHERE ';
  arrayId.forEach((id) => { querry += `id = ${id} OR `; });
  querry = querry.slice(0, querry.length - 4);
  querry += ';';
  const [nave] = await connection.execute(querry);

  // Tratando os dados
  const arrayNavers = [];
  nave.forEach((naver) => {
    arrayNavers.push({
      id: naver.id,
      name: naver.name,
      birthdate: naver.birthdate,
      admission_date: naver.admission_date,
      job_role: naver.job_role,
    });
  });

  return arrayNavers;
};

const createNave = async (
  name: string,
  birthdate: string,
  admissionDate: string,
  jobRole: string,
  usersId: number,
) : Promise<number> => {
  const [naver] = await connection.execute(
    'INSERT INTO navedb.navers (name, birthdate, admission_date, job_role, users_id) VALUES (?, ?, ?, ?, ?);',
    [name, birthdate, admissionDate, jobRole, usersId],
  );
  return naver.insertId;
};

const editNave = async (
  name: string,
  birthdate: string,
  admissionDate: string,
  jobRole: string,
  id: number,
) : Promise<void> => {
  await connection.execute(
    'UPDATE navedb.navers SET name = ?, birthdate = ?, admission_date = ?, job_role = ? WHERE id = ?;',
    [name, birthdate, admissionDate, jobRole, id],
  );
};

const checkOwner = async (id:number) : Promise<number> => {
  const owner = await connection.execute(
    'SELECT users_id FROM navedb.navers WHERE id = ?;', [id],
  );
  try {
    const userId = owner[0][0].users_id;
    return userId;
  } catch { return 0; }
};

const deleteNave = async (id: string) : Promise<void> => {
  await connection.execute(
    'DELETE FROM navedb.navers WHERE id=?;', [id],
  );
};

export default {
  createNave, getAllByFilter, getById, deleteNave, checkOwner, editNave, getByArrayId,
};
