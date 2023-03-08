const db = require("../config/database");

const getAllUsersCust = async () => {
  return await db`SELECT
  customers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
    FROM sellers
    WHERE sellers.email = customers.email
  ) as sellers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses
FROM customers
LEFT JOIN address ON address.users_id = customers.users_id
GROUP BY customers.users_id
ORDER BY customers.created_at ASC
`;

  //   return await db`SELECT
  //   customers.*,
  //   (
  //     SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
  //     FROM sellers
  //     WHERE sellers.email = customers.email
  //   ) as sellers,
  //   COALESCE(json_agg(
  //     CASE
  //       WHEN address.address_id = 1 THEN
  //         json_build_object(
  //           'address_id', address.address_id,
  //           'users_id', address.users_id,
  //           'address', address.address,
  //           'primary', true
  //         )
  //       ELSE
  //         json_build_object(
  //           'address_id', address.address_id,
  //           'users_id', address.users_id,
  //           'address', address.address,
  //           'primary', false
  //         )
  //     END
  //     ORDER BY address.address_id = 1 DESC, address.updated_at DESC
  //   ), '[]'::json) as addresses
  // FROM customers
  // LEFT JOIN address ON address.users_id = customers.users_id
  // GROUP BY customers.users_id
  // ORDER BY customers.created_at ASC

  //   `;

  // return await db`SELECT
  //   customers.*,
  //   (
  //     SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
  //     FROM sellers
  //     WHERE sellers.email = customers.email
  //   ) as sellers,
  //   COALESCE(json_agg(row_to_json(address.*)), '[]'::json) as addresses
  // FROM customers
  // LEFT JOIN address ON address.users_id = customers.users_id
  // GROUP BY customers.users_id
  // ORDER BY customers.created_at ASC
  // `;
};

const getUsersCustById = async (params) => {
  const { id } = params;

  return await db`SELECT
  customers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
    FROM sellers
    WHERE sellers.email = customers.email
  ) as sellers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses
FROM customers
LEFT JOIN address ON address.users_id = customers.users_id
WHERE customers.users_id = ${id}
GROUP BY customers.users_id
ORDER BY customers.created_at ASC
`;
};

const getProfile = async (params) => {
  const { idValidator } = params;

  const profile = await db`
    SELECT
      customers.*,
      (
        SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
        FROM sellers
        WHERE sellers.email = customers.email
      ) AS sellers,
      COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) AS addresses,
      COALESCE(
        (
          SELECT json_agg(checkout.*)
          FROM checkout
          WHERE checkout.users_id = customers.users_id
            AND NOT (checkout.status IS DISTINCT FROM 'paid')
        ),
        '[]'::json
      ) AS checkout_paid,
      COALESCE(
        (
          SELECT json_agg(checkout.*)
          FROM checkout
          WHERE checkout.users_id = customers.users_id
            AND checkout.status IS DISTINCT FROM 'paid'
        ),
        '[]'::json
      ) AS checkout_unpaid
    FROM customers
    LEFT JOIN address ON address.users_id = customers.users_id
    WHERE customers.users_id = ${idValidator}
    GROUP BY customers.users_id
    ORDER BY customers.created_at ASC
  `;

  return profile[0];
};

const getAllUsersCustPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT
  customers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
    FROM sellers
    WHERE sellers.email = customers.email
  ) as sellers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses
FROM customers
LEFT JOIN address ON address.users_id = customers.users_id
GROUP BY customers.users_id
${
  sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
} LIMIT ${limit} OFFSET ${limit * (page - 1)}
`;
};

const getAllUsersCustPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT
  customers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
    FROM sellers
    WHERE sellers.email = customers.email
  ) as sellers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses
FROM customers
LEFT JOIN address ON address.users_id = customers.users_id
GROUP BY customers.users_id
ORDER BY created_at ASC LIMIT ${limit} OFFSET ${limit * (page - 1)}
`;
};

const getAllUsersCustSort = async (params) => {
  const { sort } = params;

  return await db`SELECT
  customers.*,
  (
    SELECT COALESCE(json_agg(row_to_json(sellers.*)), '[]'::json)
    FROM sellers
    WHERE sellers.email = customers.email
  ) as sellers,
  COALESCE(json_agg(address.* ORDER BY address.updated_at DESC), '[]'::json) as addresses
FROM customers
LEFT JOIN address ON address.users_id = customers.users_id
GROUP BY customers.users_id
${sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`} 
`;
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

const createUsersCust = async (params) => {
  const { email, username, password } = params;

  return await db`INSERT INTO customers ("email", "username", "password") VALUES
  (${email}, ${username}, ${password})`;
};

const addAddress = async (params) => {
  const {
    type_of_address,
    recipient_name,
    recipient_phone_number,
    address,
    postal_code,
    city,
    users_id,
    primary_address,
    updated_at_inject,
    updated_at,
  } = params;

  return await db`INSERT INTO address ("type_of_address", "recipient_name", "recipient_phone_number", "address", "postal_code", "city", "users_id", "primary_address", "updated_at") VALUES
  (${type_of_address}, ${recipient_name}, ${recipient_phone_number}, ${address}, ${postal_code}, ${city}, ${users_id}, ${primary_address}, ${updated_at})`;
};

const addAddressManipulate = async (params) => {
  const {
    type_of_address,
    recipient_name,
    recipient_phone_number,
    address,
    postal_code,
    city,
    users_id,
    primary_address,
  } = params;

  return await db`INSERT INTO address ("type_of_address", "recipient_name", "recipient_phone_number", "address", "postal_code", "city", "users_id", "primary_address") VALUES
  (${type_of_address}, ${recipient_name}, ${recipient_phone_number}, ${address}, ${postal_code}, ${city}, ${users_id}, ${primary_address})`;
};

const editAddress = async (params) => {
  const {
    type_of_address,
    recipient_name,
    recipient_phone_number,
    address,
    postal_code,
    city,
    id,
    defaultValue,
    primary_address,
  } = params;

  return await db`UPDATE address SET type_of_address = ${
    type_of_address || defaultValue?.type_of_address
  }, recipient_name = ${
    recipient_name || defaultValue?.recipient_name
  }, recipient_phone_number = ${
    recipient_phone_number || defaultValue?.recipient_phone_number
  }, address = ${address || defaultValue?.address}, postal_code = ${
    postal_code || defaultValue?.postal_code
  }, city = ${city || defaultValue?.city},
  primary_address = ${primary_address || defaultValue?.primary_address},
  updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
  WHERE address_id = ${id}`;
};

const editAddressManipulate = async (params) => {
  const {
    type_of_address,
    recipient_name,
    recipient_phone_number,
    address,
    postal_code,
    city,
    id,
    defaultValue,
    primary_address,
    updated_at,
  } = params;

  return await db`UPDATE address SET type_of_address = ${
    type_of_address || defaultValue?.type_of_address
  }, recipient_name = ${
    recipient_name || defaultValue?.recipient_name
  }, recipient_phone_number = ${
    recipient_phone_number || defaultValue?.recipient_phone_number
  }, address = ${address || defaultValue?.address}, postal_code = ${
    postal_code || defaultValue?.postal_code
  }, city = ${city || defaultValue?.city},
  primary_address = ${primary_address || defaultValue?.primary_address},
  updated_at = ${updated_at}
  WHERE address_id = ${id}`;
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
    // address,
  } = params;

  // return await db`UPDATE customers
  // SET email = ${email || defaultValue?.email},
  //  phone_number = ${phone_number || defaultValue?.phone_number},
  //  username = ${username || defaultValue?.username},
  //  password =${password || defaultValue?.password},
  //  profile_picture = ${profile_picture || defaultValue?.profile_picture},
  //  gender = ${gender || defaultValue?.gender},
  //  date_of_birth = ${date_of_birth || defaultValue?.date_of_birth},
  //  address = ${address || defaultValue?.address},
  //  updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
  // WHERE users_id = ${id} `;

  return await db`UPDATE customers
  SET email = ${email || defaultValue?.email},
   phone_number = ${phone_number || defaultValue?.phone_number},
   username = ${username || defaultValue?.username},
   password =${password || defaultValue?.password},
   profile_picture = ${profile_picture || defaultValue?.profile_picture},
   gender = ${gender || defaultValue?.gender},
   date_of_birth = ${date_of_birth || defaultValue?.date_of_birth},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE users_id = ${id} `;
};

const deleteAddress = async (params) => {
  const { id } = params;

  return await db`DELETE FROM address WHERE address_id = ${id}`;
};

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from customers WHERE users_id = ${roleValidator}`;
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

const updateUsersSellerParallel = async (params) => {
  const { email, phone_number, username, password, defaultValue, id } = params;

  return await db`UPDATE sellers
    SET email = ${email || defaultValue?.email},
        phone_number = ${phone_number || defaultValue?.phone_number},
        username = ${username || defaultValue?.username},
        password = ${password || defaultValue?.password},
        updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
    WHERE users_id = ${id}`;
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
  updateUsersCustPartial,
  getRoles,
  getProfile,
  checkEmailSeller,
  checkEmail,
  checkUsernameSellers,
  checkUsername,
  getPhoneSeller,
  updateUsersSellerParallel,
  addAddress,
  editAddress,
  deleteAddress,
  addAddressManipulate,
  editAddressManipulate,
};
