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
  } = params;

  return await db`INSERT INTO checkout ("users_id" ,"products_id", "color", "size", "qty", "product_name", "store_name", "total_est") VALUES (${users_id}, ${products_id}, ${color}, ${size}, ${qty}, ${product_name}, ${store_name}, ${total_est})`;
};

module.exports = {
  getAllProductById,
  addCheckout,
};
