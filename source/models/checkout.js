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

  return await db`SELECT * FROM checkout WHERE users_id = ${id} AND status IS DISTINCT FROM 'paid'`;
};

const getCheckoutAll = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM checkout WHERE users_id = ${id}`;
};

module.exports = {
  getAllProductById,
  addCheckout,
  getCheckout,
  updateProductsParallel,
  getCheckoutPaid,
  getCheckoutAll,
};
