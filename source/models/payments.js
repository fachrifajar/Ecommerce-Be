const db = require("../config/database");

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
  const { idValidator } = params;

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
  WHERE customers.users_id = ${idValidator}
  GROUP BY customers.users_id
  ORDER BY customers.created_at ASC
  `;
};

const addPayments = async (params) => {
  const {
    users_id,
    payment_method,
    address_id,
    products_id,
    total_order,
    total_delivery,
    grand_total,
    checkout_id,
  } = params;

  await db`INSERT INTO payments ("users_id" ,"payment_method", "address_id", "products_id", "total_order", "total_delivery", "grand_total", "checkout_id") VALUES (${users_id}, ${payment_method}, ${address_id}, ${products_id}, ${total_order}, ${total_delivery}, ${grand_total}, ${checkout_id})`;

  return await db`UPDATE checkout SET status = 'paid', 
  updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE checkout_id = ${checkout_id}`;
};

const updateCheckoutParallel = async (params) => {
  const { checkout_id } = params;

  return await db`UPDATE checkout SET status = 'paid',
    updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
    WHERE checkout_id = ${checkout_id}`;
};

const updateProductsParallel = async (params) => {
  const { products_id, qtyDecrement, item_sold_count } = params;

  return await db`UPDATE products SET qty = ${qtyDecrement},
    item_sold_count = ${item_sold_count},
    updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
    WHERE products_id = ${products_id}`;
};

const getCheckout = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM checkout WHERE checkout_id = ${id}`;
};

const getProduct = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM products WHERE products_id = ${id}`;
};

module.exports = {
  getAllProductById,
  addPayments,
  getCheckout,
  getProfile,
  updateProductsParallel,
  getProduct,
  updateCheckoutParallel,
};
