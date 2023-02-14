const db = require("../config/database");

const getAllUsersCust = async () => {
  return await db`SELECT * FROM customers ORDER BY created_at ASC`;
};

const getUsersCustById = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM customers WHERE users_id = ${id}`;
};

const getAllUsersCustPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM customers ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllUsersCustPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM customers ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllUsersCustSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM customers ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

const getEmail = async (params) => {
  const { email } = params;

  return await db`SELECT email FROM customers WHERE email = ${email}`;
};

const getUsername = async (params) => {
  const { username } = params;

  return await db`SELECT username FROM customers WHERE username = ${username}`;
};

const getPhoneNumber = async (params) => {
  const { phone_number } = params;

  return await db`SELECT phone_number FROM users WHERE phone_number = ${phone_number}`;
};

const createUsersCust = async (params) => {
  const { email, username, password } = params;

  return await db`INSERT INTO customers ("email", "username", "password") VALUES
  (${email}, ${username}, ${password})`;
};

const getUsersByID = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM users WHERE users_id = ${id}`;
};

const updateUsersCustPartial = async (params) => {
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    defaultValue,
    id,
    gender,
    date_of_birth,
    address,
  } = params;

  return await db`UPDATE customers
  SET email = ${email || defaultValue?.email},
   phone_number = ${phone_number || defaultValue?.phone_number},
   username = ${username || defaultValue?.username},
   password =${password || defaultValue?.password},
   profile_picture = ${profile_picture || defaultValue?.profile_picture},
   gender = ${gender || defaultValue?.gender},
   date_of_birth = ${date_of_birth || defaultValue?.date_of_birth},
   address = ${address || defaultValue?.address},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE users_id = ${id} `;
};

const deleteUsers = async (params) => {
  const { id } = params;

  return await db`DELETE FROM users WHERE users_id = ${id}`;
};

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from users WHERE users_id = ${roleValidator}`;
};

module.exports = {
  getAllUsersCust,
  getUsersCustById,
  getAllUsersCustPaginationSort,
  getAllUsersCustPagination,
  getAllUsersCustSort,
  getEmail,
  getUsername,
  getPhoneNumber,
  createUsersCust,
  getUsersByID,
  updateUsersCustPartial,
  deleteUsers,
  getRoles,
};
