const db = require("../config/database");

const getAllProductFilter = async (params) => {
  const { orderBy, colorFilter, sizeFilter, categoryFilter, brandFilter } =
    params;
  let result;

  if (sizeFilter && !colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    console.log("masuk");
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND products.qty > 0
      ORDER BY size ASC, created_at ASC`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND products.qty > 0
      ORDER BY color ASC, created_at ASC`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND products.qty > 0
      ORDER BY category ASC, created_at ASC`;
  } else if (!sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE brand = ${brandFilter} AND products.qty > 0
      ORDER BY brand ASC, created_at ASC`;
  }
  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND products.qty > 0
      ORDER BY size ASC, color ASC, created_at ASC`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY category ASC, brand ASC, created_at ASC`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY color ASC, brand ASC, created_at ASC`;
  } else if (sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND products.qty > 0
      ORDER BY size ASC, category ASC, created_at ASC`;
  } else if (!sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ORDER BY color ASC, category ASC, created_at ASC`;
  } else if (sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY size ASC, brand ASC, created_at ASC`;
  }

  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY size ASC, color ASC, category ASC, brand ASC, created_at ASC`;
  } else if (sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ORDER BY size ASC, color ASC, category ASC, created_at ASC`;
  } else if (!sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY color ASC, category ASC, brand ASC, created_at ASC`;
  } else if (sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY size ASC, category ASC, brand ASC, created_at ASC`;
  } else if (sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ORDER BY size ASC, color ASC, brand ASC, created_at ASC`;
  }

  return result;
};

const getAllProductFilterSort = async (params) => {
  const {
    sort,
    orderBy,
    colorFilter,
    sizeFilter,
    categoryFilter,
    brandFilter,
  } = params;
  let result;

  if (sizeFilter && !colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, created_at DESC`
          : db`ORDER BY size ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, created_at DESC`
          : db`ORDER BY color ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY category DESC, created_at DESC`
          : db`ORDER BY category ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY brand DESC, created_at DESC`
          : db`ORDER BY brand ASC, created_at ASC`
      }`;
  }
  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY category DESC, brand DESC, created_at DESC`
          : db`ORDER BY category ASC, brand ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, brand DESC, created_at DESC`
          : db`ORDER BY color ASC, brand ASC, created_at ASC`
      }`;
  } else if (sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, category DESC, created_at DESC`
          : db`ORDER BY size ASC, category ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, category DESC, created_at DESC`
          : db`ORDER BY color ASC, category ASC, created_at ASC`
      }`;
  } else if (sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, brand ASC, created_at ASC`
      }`;
  }

  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, category ASC, brand ASC, created_at ASC`
      }`;
  } else if (sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, category DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, category ASC, created_at ASC`
      }`;
  } else if (!sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY color ASC, category ASC, brand DESC, created_at ASC`
      }`;
  } else if (sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, category ASC, brand DESC, created_at ASC`
      }`;
  } else if (sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, brand DESC, created_at ASC`
      }`;
  }

  return result;
};

const getAllProductFilterPaginationSort = async (params) => {
  const {
    limit,
    page,
    sort,
    orderBy,
    colorFilter,
    sizeFilter,
    categoryFilter,
    brandFilter,
  } = params;
  let result;

  if (sizeFilter && !colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
    products.*, 
    (
      SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
      FROM products_picture 
      WHERE products.products_id = products_picture.products_id
    ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, created_at DESC, created_at DESC`
          : db`ORDER BY size ASC, created_at ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, created_at DESC`
          : db`ORDER BY color ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY category DESC, created_at DESC`
          : db`ORDER BY category ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY brand DESC, created_at DESC`
          : db`ORDER BY brand ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }
  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && !categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY category DESC, brand DESC, created_at DESC`
          : db`ORDER BY category ASC, brand ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");
    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, brand DESC, created_at DESC`
          : db`ORDER BY color ASC, brand ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (sizeFilter && !colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, category DESC, created_at DESC`
          : db`ORDER BY size ASC, category ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, category DESC, created_at DESC`
          : db`ORDER BY color ASC, category ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (sizeFilter && !colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, brand ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  ////////////////////////@
  ////////////////////////@
  else if (sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, category ASC, brand ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (sizeFilter && colorFilter && categoryFilter && !brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND category = ${categoryFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, category DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, category ASC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (!sizeFilter && colorFilter && categoryFilter && brandFilter) {
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE color @> ${colors} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY color DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY color ASC, category ASC, brand DESC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (sizeFilter && !colorFilter && categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND category = ${categoryFilter} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, category DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, category ASC, brand DESC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  } else if (sizeFilter && colorFilter && !categoryFilter && brandFilter) {
    const sizes = sizeFilter.split(",");
    const colors = colorFilter.split(",");

    result = await db`SELECT
        products.*, 
        (
          SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
          FROM products_picture 
          WHERE products.products_id = products_picture.products_id
        ) as products_picture
      FROM products
      WHERE size @> ${sizes} AND color @> ${colors} AND brand = ${brandFilter} AND products.qty > 0
      ${
        sort
          ? db`ORDER BY size DESC, color DESC, brand DESC, created_at DESC`
          : db`ORDER BY size ASC, color ASC, brand DESC, created_at ASC`
      }
      LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  return result;
};

const getAllProduct = async (params) => {
  const { orderBy, colorFilter, sizeFilter, categoryFilter, brandFilter } =
    params;

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
  WHERE products.qty > 0
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
  WHERE products.qty > 0
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
  WHERE products.qty > 0
  ORDER BY products.item_sold_count ASC`;
  }

  return result;
};

const getAllBrand = async () => {
  return await db`SELECT brand FROM products`;
};

const getAllProductByName = async (params) => {
  const { id } = params;

  return await db`SELECT
  products.*, 
  (
    SELECT COALESCE(json_agg(row_to_json(products_picture.*)), '[]'::json) 
    FROM products_picture 
    WHERE products.products_id = products_picture.products_id
  ) as products_picture
FROM products
WHERE product_name ILIKE '%' || ${id} || '%' AND products.qty > 0
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
  WHERE products.qty > 0
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
WHERE products.qty > 0
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
  WHERE products.qty > 0
  ${sort ? db`ORDER BY item_sold_count DESC` : db`ORDER BY item_sold_count ASC`}
  LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
  }

  return result;
};

const getAllProductSort = async (params) => {
  const {
    sort,
    orderBy,
    colorFilter,
    sizeFilter,
    categoryFilter,
    brandFilter,
  } = params;

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
  WHERE products.qty > 0
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
WHERE products.qty > 0
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
  WHERE products.qty > 0
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

const addReviewOnly = async (params) => {
  const { review, id } = params;

  await db`UPDATE products SET review = ${review}, 
  updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE products_id = ${id}`;

  await db`UPDATE products SET avg_review = (
    SELECT AVG(value) FROM (
      SELECT UNNEST(review) AS value FROM products
      WHERE products_id = ${id}
    ) AS review_values
  ) WHERE products_id = ${id}`;
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

const updateProducts = async (params) => {
  const {
    product_name,
    price,
    qty,
    color,
    category,
    size,
    brand,
    condition,
    description,
    id,
    defaultValue,
  } = params;

  return await db`UPDATE products
  SET product_name = ${product_name || defaultValue?.product_name},
   price = ${price || defaultValue?.price},
   qty = ${qty || defaultValue?.qty},
   color =${color || defaultValue?.color},
   category = ${category || defaultValue?.category},
   size = ${size || defaultValue?.size},
   brand = ${brand || defaultValue?.brand},
   condition =${condition || defaultValue?.condition},
   description = ${description || defaultValue?.description},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE products_id = ${id} `;
};

const updateProductPicture = async (params) => {
  const { product_picture, id, defaultValue } = params;

  return await db`UPDATE products_picture
  SET product_picture = ${product_picture || defaultValue?.product_picture},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE products_picture_id = ${id} `;
};

const updateUsersCustParallel = async (params) => {
  const { phone_number, id } = params;

  return await db`UPDATE customers
    SET phone_number = ${phone_number || defaultValue?.phone_number},
     updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
    WHERE seller_id = ${id} `;
};

const deleteProductPicture = async (params) => {
  const { id } = params;

  return await db`DELETE FROM products_picture WHERE products_picture_id = ${id}`;
};

const deleteProduct = async (params) => {
  const { id } = params;

  return await db`DELETE FROM products WHERE products_id = ${id}`;
};

const getRoles = async (params) => {
  const { sellerIdvalidator } = params;

  return await db`SELECT role from sellers WHERE users_id = ${sellerIdvalidator}`;
};

const getProductId = async (params) => {
  const { id } = params;

  return await db`SELECT * from products WHERE products_id = ${id}`;
};

const getProductPictureId = async (params) => {
  const { id } = params;

  return await db`SELECT * from products_picture WHERE products_picture_id = ${id}`;
};

const getProductPictureByProductId = async (params) => {
  const { id } = params;

  return await db`SELECT * from products_picture WHERE products_id = ${id}`;
};

const getProductName = async (params) => {
  const { product_name } = params;

  return await db`SELECT * from products WHERE product_name = ${product_name}`;
};

module.exports = {
  getAllProductFilter,
  getProductPictureId,
  getProductName,
  getAllProductFilterSort,
  getAllProductFilterPaginationSort,
  getAllProduct,
  getAllProductByName,
  getAllProductPaginationSort,
  getAllProductSort,
  getEmail,
  getUsername,
  getPhoneNumber,
  createUsersCust,
  updateProducts,
  deleteProductPicture,
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
  getProductId,
  updateProductPicture,
  getProductPictureByProductId,
  deleteProduct,
  addReviewOnly,
  getAllBrand,
};
