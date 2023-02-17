const db = require("../config/database");

const getAllProduct = async (params) => {
  const { orderBy } = params;

  let result;

  if (!orderBy) {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ORDER BY products.created_at ASC`;
  } else if (orderBy == "popular") {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ORDER BY products.avg_review ASC`;
  } else if (orderBy == "sold") {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ORDER BY products.item_sold_count ASC`;
  }

  return result;
};

const getAllProductById = async (params) => {
  const { id } = params;

  return await db`SELECT
  products.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
    FROM products_picture 
    WHERE products.products_id = products_picture.products_id
  ) as products_picture
FROM products
WHERE products_id = ${id}
ORDER BY products.created_at ASC`;
};

const getProfile = async (params) => {
  const { sellerIdvalidator } = params;

  return await db`SELECT
  sellers.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(customers.*)), '[]'::json) 
    FROM customers 
    WHERE customers.email = sellers.email
  ) as customers
FROM sellers
WHERE users_id = ${sellerIdvalidator}
ORDER BY sellers.created_at ASC`;
};

// const getAllProductPaginationSort = async (params) => {
//   const { limit, page, sort, orderBy } = params;

//   const validOrders = ["size", "color", "category", "brand"];
//   const isValidOrder = validOrders.includes(orderBy);

//   const orderColumn = isValidOrder ? orderBy : "created_at";
//   const orderDirection = sort === "DESC" ? "DESC" : "ASC";
//   console.log(orderColumn);
//   console.log(orderDirection);
//   console.log(limit);
//   console.log(page);

//   return await db`SELECT
//   products.*,
//   (
//     SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json)
//     FROM products_picture
//     WHERE products.products_id = products_picture.products_id
//   ) as products_picture
// FROM products
//  ${
//    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
//  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;

//   return await db`
//     SELECT
//       products.*,
//       (
//         SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json)
//         FROM products_picture
//         WHERE products.products_id = products_picture.products_id
//       ) as products_picture
//     FROM products
//     ORDER BY products.${orderColumn} ${orderDirection}
//     LIMIT ${limit} OFFSET ${limit * (page - 1)}
//   `;
// };

const getAllProductPaginationSort = async (params) => {
  const { limit, page, sort, orderBy } = params;

  let result;

  if (!orderBy) {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ${sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`}
  LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  if (orderBy == "popular") {
    result = await db`SELECT
  products.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
    FROM products_picture 
    WHERE products.products_id = products_picture.products_id
  ) as products_picture
FROM products
${sort ? db`ORDER BY avg_review DESC` : db`ORDER BY avg_review ASC`}
LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (orderBy == "sold") {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ${sort ? db`ORDER BY item_sold_count DESC` : db`ORDER BY item_sold_count ASC`}
  LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  return result;
};

const getAllProductSort = async (params) => {
  const { sort, orderBy } = params;

  let result;

  if (!orderBy) {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ${sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`}`;
  }

  if (orderBy == "popular") {
    result = await db`SELECT
  products.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
    FROM products_picture 
    WHERE products.products_id = products_picture.products_id
  ) as products_picture
FROM products
${sort ? db`ORDER BY avg_review DESC` : db`ORDER BY avg_review ASC`}`;
  } else if (orderBy == "sold") {
    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
  FROM products
  ${
    sort ? db`ORDER BY item_sold_count DESC` : db`ORDER BY item_sold_count ASC`
  }`;
  }

  return result;
};

const checkProductName = async (params) => {
  const { product_name } = params;

  return await db`SELECT product_name FROM products WHERE product_name ILIKE '%' || ${product_name} || '%'`;
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

const createUsersCust = async (params) => {
  const { email, username, password } = params;

  return await db`INSERT INTO customers ("email", "username", "password") VALUES
  (${email}, ${username}, ${password})`;
};

const addProductReview = async (params) => {
  const { review, id } = params;

  // Retrieve the current review array from the products table
  const currentReview =
    await db`SELECT review FROM products WHERE products_id = ${id}`;

  // Concatenate the new review with the current review array
  const newReview = currentReview[0].review.concat(JSON.parse(review));

  // Update the products table with the new review array
  await db`UPDATE products SET review = ${newReview}, 
  updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE products_id = ${id}`;

  // Update the avg_review column in the products table with the new average review score
  await db`UPDATE products SET avg_review = (
    SELECT AVG(value) FROM (
      SELECT UNNEST(review) AS value FROM products
      WHERE products_id = ${id}
    ) AS review_values
  ) WHERE products_id = ${id}`;
};

const addProduct = async (params) => {
  const {
    users_id,
    product_name,
    price,
    qty,
    store_name,
    color,
    category,
    size,
    brand,
    condition,
    description,
    slug,
  } = params;

  const result =
    await db`INSERT INTO products ("users_id", "product_name", "price", "qty", "store_name", "color", "category", "size", "brand", "condition", "description", "slug") VALUES (${users_id}, ${product_name}, ${price}, ${qty}, ${store_name}, ${color}, ${category}, ${size}, ${brand}, ${condition}, ${description}, ${slug}) RETURNING products_id`;

  return result[0].products_id;
};

const addProductPicture = async (params) => {
  const { product_picture, products_id, users_id } = params;

  return await db`INSERT INTO products_picture ("product_picture", "products_id", "users_id") VALUES (${product_picture}, ${products_id}, ${users_id})`;
};

const createUsersSeller = async (params) => {
  const { email, username, password, phone_number, store_name } = params;

  return await db`INSERT INTO sellers ("email", "username", "password", "phone_number", "store_name") VALUES
    (${email}, ${username}, ${password}, ${phone_number}, ${store_name})`;
};

const createUsersParallel = async (params) => {
  const { email, username, password } = params;

  return await db`INSERT INTO customers ("email", "username", "password") VALUES
    (${email}, ${username}, ${password})`;
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
  getAllProduct,
  getAllProductById,
  getAllProductPaginationSort,
  getAllProductSort,
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
  createUsersSeller,
  checkSellerId,
  createUsersParallel,
  updateUsersCustParallel,
  getPhoneSeller,
  checkEmailSeller,
  checkEmail,
  checkUsernameSellers,
  checkUsername,
  checkProductName,
  addProduct,
  addProductPicture,
  addProductReview,
};
