const db = require("../config/database");

const getAllUsersSeller = async () => {
  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
ORDER BY sellers.created_at ASC`;
};

const getUsersSellerById = async (params) => {
  const { id } = params;

  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
WHERE users_id = ${id}
ORDER BY sellers.created_at ASC`;
};

const getProfile = async (params) => {
  const { sellerIdvalidator } = params;

  return await db`SELECT
  sellers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses,
  COALESCE(json_agg(products.* ORDER BY products.created_at DESC), '[]'::json) as products,
  COALESCE(json_agg(products_picture.*), '[]'::json) as products_picture
FROM sellers
LEFT JOIN customers ON customers.email = sellers.email
LEFT JOIN products ON products.users_id = sellers.users_id
LEFT JOIN products_picture ON products_picture.products_id = products.products_id
LEFT JOIN address ON address.users_id = sellers.users_id
WHERE sellers.users_id = ${sellerIdvalidator}
GROUP BY sellers.users_id, customers.users_id
ORDER BY sellers.created_at ASC;
`;
};

const getAllUsersSellerPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
 ${
   sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
 } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllUsersSellerPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
 ORDER BY created_at ASC LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllUsersSellerSort = async (params) => {
  const { sort } = params;

  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
 ${sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`}`;
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

  return await db`SELECT phone_number FROM customers WHERE phone_number = ${phone_number}`;
};

const getPhoneSeller = async (params) => {
  const { phone_number } = params;

  return await db`SELECT phone_number FROM sellers WHERE phone_number = ${phone_number}`;
};

const getEmailSeller = async (params) => {
  const { email } = params;

  return await db`SELECT email FROM sellers WHERE email = ${email}`;
};

const getUsernameSeller = async (params) => {
  const { username } = params;

  return await db`SELECT username FROM sellers WHERE username = ${username}`;
};

const getPhoneNumberSeller = async (params) => {
  const { phone_number } = params;

  return await db`SELECT phone_number FROM sellers WHERE phone_number = ${phone_number}`;
};

const getstoreName = async (params) => {
  const { store_name } = params;
  return await db`SELECT store_name FROM sellers WHERE store_name ILIKE '%' || ${store_name} || '%'`;
};

const checkEmailSeller = async (params) => {
  const { email } = params;

  return await db`SELECT email FROM sellers WHERE email ILIKE '%' || ${email} || '%'`;
};

const checkEmail = async (params) => {
  const { email } = params;

  return await db`SELECT email FROM customers WHERE email ILIKE '%' || ${email} || '%'`;
};

const checkUsername = async (params) => {
  const { username } = params;

  return await db`SELECT username FROM customers WHERE username ILIKE '%' || ${username} || '%'`;
};

const checkUsernameSellers = async (params) => {
  const { username } = params;

  return await db`SELECT username FROM sellers WHERE username ILIKE '%' || ${username} || '%'`;
};

const createUsersSellerAndCust = async (params) => {
  const { email, username, password, phone_number, store_name } = params;

  const result = await db`
    INSERT INTO sellers ("email", "username", "password", "phone_number", "store_name")
    VALUES (${email}, ${username}, ${password}, ${phone_number}, ${store_name})
    RETURNING users_id
  `;

  const sellerId = result[0].users_id;

  const customerParams = {
    email,
    username,
    password,
    seller_id: sellerId,
  };

  await createUsersParallel(customerParams);
};

const createUsersParallel = async (params) => {
  const { email, username, password, seller_id } = params;

  return await db`INSERT INTO customers ("email", "username", "password", "seller_id")
    VALUES (${email}, ${username}, ${password}, ${seller_id})`;
};

const createUsersCust = async (params) => {
  const { email, username, password, seller_id } = params;

  return await db`
    INSERT INTO customers ("email", "username", "password", "seller_id")
    VALUES (${email}, ${username}, ${password}, ${seller_id})
  `;
};

const checkSellerId = async (params) => {
  const { email } = params;

  return await db`SELECT users_id from customers WHERE email = ${email}`;
};

const updateUsersSellerPartial = async (params) => {
  const {
    store_name,
    email,
    phone_number,
    description,
    profile_picture,
    id,
    defaultValue,
  } = params;

  return await db`UPDATE sellers
  SET email = ${email || defaultValue?.email},
   phone_number = ${phone_number || defaultValue?.phone_number},
   store_name = ${store_name || defaultValue?.store_name},
   description =${description || defaultValue?.description},
   profile_picture = ${profile_picture || defaultValue?.profile_picture},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE users_id = ${id} `;
};

const updateUsersCustParallel = async (params) => {
  const { phone_number, id } = params;

  return await db`UPDATE customers
    SET phone_number = ${phone_number || defaultValue?.phone_number},
     updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
    WHERE seller_id = ${id} `;
};

const deleteUsers = async (params) => {
  const { id } = params;

  return await db`DELETE FROM users WHERE users_id = ${id}`;
};

const getRoles = async (params) => {
  const { sellerIdvalidator } = params;

  return await db`SELECT role from sellers WHERE users_id = ${sellerIdvalidator}`;
};

module.exports = {
  getAllUsersSeller,
  getUsersSellerById,
  getAllUsersSellerPaginationSort,
  getAllUsersSellerPagination,
  getAllUsersSellerSort,
  getEmail,
  getUsername,
  getPhoneNumber,
  createUsersCust,
  updateUsersSellerPartial,
  deleteUsers,
  getRoles,
  getProfile,
  getEmailSeller,
  getUsernameSeller,
  getPhoneNumberSeller,
  getstoreName,
  // createUsersSeller,
  checkSellerId,
  createUsersParallel,
  updateUsersCustParallel,
  getPhoneSeller,
  checkEmailSeller,
  checkEmail,
  checkUsernameSellers,
  checkUsername,
  createUsersSellerAndCust,
};
