const db = require("../config/database");

const getAllbyEmail = async (params) => {
  const { email } = params;

  return await db`SELECT
  customers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json) 
    FROM sellers 
    WHERE sellers.email = customers.email
  ) as sellers
FROM customers
WHERE email = ${email}
ORDER BY customers.created_at ASC`;
};

const getNotLikeAllUsers = async (params) => {
  const { email } = params;

  return await db`SELECT * FROM users WHERE email NOT LIKE ${email}`;
};

const updateRefToken = async (params) => {
  const { email, refreshToken } = params;

  return await db`UPDATE users SET refresh_token = ${refreshToken} WHERE email = ${email}`;
};

const checkRefToken = async (params) => {
  const { refreshToken } = params;

  return await db`SELECT * FROM users WHERE refresh_token = ${refreshToken}`;
};

module.exports = {
  getAllbyEmail,
  getNotLikeAllUsers,
  updateRefToken,
  checkRefToken,
};
