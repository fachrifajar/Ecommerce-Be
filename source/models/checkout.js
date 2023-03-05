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

const addCheckout = async (params) => {
  const {
    color,
    size,
    qty,
    product_name,
    store_name,
    total_est,
    products_id,
    users_id,
    product_picture,
  } = params;

  return await db`INSERT INTO checkout ("users_id" ,"products_id", "color", "size", "qty", "product_name", "store_name", "total_est", "product_picture") VALUES (${users_id}, ${products_id}, ${color}, ${size}, ${qty}, ${product_name}, ${store_name}, ${total_est}, ${product_picture})`;
};

const updateCheckout = async (params) => {
  const { qty, checkout_id, products_id } = params;

  return await db`UPDATE checkout SET qty = ${qty},
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

const getCheckoutPaid = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM checkout WHERE users_id = ${id} AND NOT (status IS DISTINCT FROM 'paid')`;
};

const getCheckout = async (params) => {
  const { id } = params;

  return await db`SELECT 
    checkout.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products.*)), '[]'::json) 
      FROM products 
      WHERE products.products_id = checkout.products_id
    ) as products
  FROM checkout
  WHERE checkout.users_id = ${id} AND checkout.status IS DISTINCT FROM 'paid'
  GROUP BY checkout.checkout_id`;
};

const getCheckoutAll = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM checkout WHERE users_id = ${id}`;
};

const deleteCheckout = async (params) => {
  const { checkout_id } = params;

  return await db`DELETE FROM checkout WHERE checkout_id = ${checkout_id}`;
};

const checkCheckout = async (params) => {
  const { checkout_id, idValidator } = params;

  return await db`SELECT * FROM checkout WHERE checkout_id = ${checkout_id} AND users_id = ${idValidator}`;
};

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from customers WHERE users_id = ${roleValidator}`;
};

module.exports = {
  getAllProductById,
  addCheckout,
  getCheckout,
  updateProductsParallel,
  getCheckoutPaid,
  getCheckoutAll,
  updateCheckout,
  deleteCheckout,
  checkCheckout,
  getRoles,
};
