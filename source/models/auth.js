const db = require('../config/database')

const getAllbyEmail = async (params) => {
  const { email } = params

  return await db`SELECT * FROM customers WHERE email = ${email}`
}

const getNotLikeAllUsers = async (params) => {
  const { email } = params

  return await db`SELECT * FROM users WHERE email NOT LIKE ${email}`
}

const updateRefToken = async (params) => {
  const { email, refreshToken } = params

  return await db`UPDATE users SET refresh_token = ${refreshToken} WHERE email = ${email}`
}

const checkRefToken = async (params) => {
  const { refreshToken } = params

  return await db`SELECT * FROM users WHERE refresh_token = ${refreshToken}`
}

module.exports = {
  getAllbyEmail,
  getNotLikeAllUsers,
  updateRefToken,
  checkRefToken,
}
