import express from "express";
import mysql2 from "mysql2/promise";

const app = express();

const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "store_db",
});

app.use(express.json());

/************************** START  2- create REST API Products *******************************/
app.post("/product", async (req, res) => {
  const { name, price, stock, supplier_id } = req.body;
  const [supplierExist] = await pool.execute(
    `SELECT * FROM suppliers where id = ?`,
    [supplier_id],
  );
  if (supplierExist.length == 0) {
    return res
      .status(404)
      .json({ message: `Supplier where Id = ${supplier_id} Not Found` });
  }
  const sqlQuery = `INSERT INTO products (name, price, stock_quantity, supplier_id) VALUES (?, ?, ?, ?)`;
  try {
    const [rows] = await pool.execute(sqlQuery, [
      name,
      price,
      stock,
      supplier_id,
    ]);
    res.status(201).json({ message: "The Product created Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/products", async (req, res) => {
  const sqlQuery = `SELECT * FROM products`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    res
      .status(200)
      .json({ message: "Get All Products Successfully", products: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM products WHERE id = ?`;
  try {
    const [rows] = await pool.execute(sqlQuery, [id]);
    if (rows.length > 0) {
      return res
        .status(200)
        .json({ message: `Get product where id is ${id}`, product: rows[0] });
    }
    res
      .status(404)
      .json({ message: `This Product Where id = ${id} Not Found` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/product/:id", async (req, res) => {
  const { id } = req.params;
  const { ...rest } = req.body;
  const entites = Object.entries(rest);

  if (entites.length == 0) {
    return res.status(404).json({ message: "No Fields Provided to Update" });
  }
  const allowedFileds = ["name", "price", "stock_quantity", "supplier_id"];
  const fields = entites.filter(([key, value]) => allowedFileds.includes(key));
  if (fields.length == 0) {
    return res.status(404).json({ message: "No Valid fields provided" });
  }
  const updateCondition = fields.map(([key, value]) => `${key} = ?`).join(", ");
  const updateKeys = fields.map(([key, value]) => key);
  const updateValues = fields.map(([key, value]) => value);
  const sqlQuery = `UPDATE products SET ${updateCondition} WHERE id = ?`;
  try {
    const [result] = await pool.execute(sqlQuery, [...updateValues, id]);
    if (result.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: `Product Not Found To Update Where id = ${id}` });
    }
    res.status(200).json({
      message: `Product (${updateKeys}) Successfully Updated Where Id = ${id}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/product/:id", async (req, res) => {
  const { id } = req.params;
  const sqlQuery = `DELETE FROM products WHERE id = ?`;
  try {
    const [result] = await pool.execute(sqlQuery, [id]);
    if (result.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: `Product Where Id = ${id} Not Found` });
    }
    res
      .status(200)
      .json({ message: `Deleted Successfully The Product Where id = ${id}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/************************** END  2- create REST API Products *******************************/
/************************** START  3- create REST API Suppliers *******************************/
app.post("/supplier", async (req, res) => {
  const { name, number } = req.body;
  const sqlQuery = `INSERT INTO suppliers (name, contact_number) VALUES (?, ?)`;
  try {
    const [rows] = await pool.execute(sqlQuery, [name, number]);
    res.status(201).json({ message: "The Supplier Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/suppliers", async (req, res) => {
  const sqlQuery = `SELECT * FROM suppliers`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    res
      .status(200)
      .json({ message: "Get All suppliers Successfully", suppliers: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/supplier/:id", async (req, res) => {
  const { id } = req.params;
  const { ...rest } = req.body;
  const entites = Object.entries(rest);

  if (entites.length == 0) {
    return res.status(404).json({ message: "No Fields Provided to Update" });
  }
  const allowedFileds = ["name", "contact_number"];
  const fields = entites.filter(([key, value]) => allowedFileds.includes(key));
  if (fields.length == 0) {
    return res.status(404).json({ message: "No Valid fields provided" });
  }
  const updateCondition = fields.map(([key, value]) => `${key} = ?`).join(", ");
  const updateKeys = fields.map(([key, value]) => key);
  const updateValues = fields.map(([key, value]) => value);
  const sqlQuery = `UPDATE suppliers SET ${updateCondition} WHERE id = ?`;
  try {
    const [result] = await pool.execute(sqlQuery, [...updateValues, id]);
    if (result.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: `supplier Not Found To Update Where id = ${id}` });
    }
    res.status(200).json({
      message: `supplier (${updateKeys}) Successfully Updated Where Id = ${id}`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/supplier/:id", async (req, res) => {
  const { id } = req.params;
  const sqlQuery = `DELETE FROM suppliers WHERE id = ?`;
  try {
    const [result] = await pool.execute(sqlQuery, [id]);
    if (result.affectedRows == 0) {
      return res
        .status(404)
        .json({ message: `supplier Where Id = ${id} Not Found` });
    }
    res
      .status(200)
      .json({ message: `Deleted Successfully The supplier Where id = ${id}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/************************** END  3- create REST API Suppliers *******************************/
/************************** START  4- create REST API Sales *******************************/
app.post("/sale", async (req, res) => {
  const { productID, quantity, saleDate } = req.body;
  const [productExist] = await pool.execute(
    `SELECT * FROM products where id = ?`,
    [productID],
  );
  if (productExist.length == 0) {
    return res
      .status(404)
      .json({ message: `product where Id = ${productID} Not Found` });
  }
  console.log(productExist);
  if (productExist[0].stock_quantity == 0) {
    return res
      .status(404)
      .json({ message: `The Product Where id = ${productID} Sold Out` });
  } else if (productExist[0].stock_quantity < quantity) {
    return res.status(400).json({
      message: `The quantity of buying this product is higher than the quantity's stock, so select the correct quantity`,
    });
  }
  const sqlQuery = `INSERT INTO sales (product_id, sold_quantity, sale_date) VALUES (?, ?, ?)`;
  const sqlUpdateProductQuantity = `UPDATE products SET stock_quantity = ? WHERE id = ?`;
  const new_value_product_quantity = productExist[0].stock_quantity - quantity;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(sqlQuery, [
      productID,
      quantity,
      saleDate,
    ]);
    const [rows] = await connection.execute(sqlUpdateProductQuantity, [
      new_value_product_quantity,
      productID,
    ]);
    await connection.commit();
    res.status(201).json({ message: "The sale Recorded Successfully" });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ message: err.message });
  }
});

app.get("/sales", async (req, res) => {
  const sqlQuery = `SELECT * FROM sales`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    res
      .status(200)
      .json({ message: "Get All Sales Successfully", Sales: rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/sale/:id", async (req, res) => {
  const { id } = req.params;
  const sqlQuery = `SELECT * FROM sales WHERE id = ?`;
  try {
    const [rows] = await pool.execute(sqlQuery, [id]);
    if (rows.length > 0) {
      return res
        .status(200)
        .json({ message: `Get Sale where id is ${id}`, sale: rows[0] });
    }
    res.status(404).json({ message: `This Sale Where id = ${id} Not Found` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/************************** END  4- create REST API Sales *******************************/
/************************** Start  5- DB Modification *******************************/
app.post("/productsAddColumn", async (req, res) => {
  const allowedColumns = ["category"];
  const allowedTypes = ["INT", "TEXT", "VARCHAR(255)"];
  const allowedConstraints = ["NULL", "NOT NULL"];

  const { column, type, constraint } = req.body;

  if (!allowedColumns.includes(column.toLowerCase())) {
    return res.status(400).json({
      message: "Invalid column name",
    });
  }

  if (!allowedTypes.includes(type.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid data type",
    });
  }

  if (!allowedConstraints.includes(constraint.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid constraint",
    });
  }

  const sqlQuery = `
    ALTER TABLE products
    ADD COLUMN ${column.toLowerCase()} ${type.toUpperCase()} ${constraint.toUpperCase()}
  `;

  try {
    await pool.execute(sqlQuery);

    return res.status(200).json({
      message: "Column added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add column",
      error: err.message,
    });
  }
});

app.delete("/productsRemoveColumn", async (req, res) => {
  const allowedColumns = ["category"];
  const { column } = req.body;

  if (!allowedColumns.includes(column.toLowerCase())) {
    return res.status(400).json({
      message: "Invalid column name",
    });
  }
  const sqlQuery = `
    ALTER TABLE products
    DROP COLUMN ${column} 
  `;
  try {
    await pool.execute(sqlQuery);

    return res.status(200).json({
      message: "Column removed successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to remove column",
      error: err.message,
    });
  }
});

app.put("/modifySupplierNumberConstraints", async (req, res) => {
  const allowedTypes = ["VARCHAR(12)", "VARCHAR(15)"];
  const allowedConstraints = ["NULL", "NOT NULL"];
  const { type, constraint } = req.body;
  if (!allowedTypes.includes(type.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid data type",
    });
  }

  if (!allowedConstraints.includes(constraint.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid constraint",
    });
  }

  const sqlQuery = `ALTER TABLE suppliers MODIFY contact_number ${type} ${constraint} `;
  try {
    await pool.execute(sqlQuery);
    return res.status(200).json({
      message: "Type of Contact Number Modified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to modify Contact Number",
      error: err.message,
    });
  }
});

app.put("/modifyProductNameConstraint", async (req, res) => {
  const allowedTypes = ["VARCHAR(255)", "VARCHAR(150)"];
  const allowedConstraints = ["NULL", "NOT NULL"];
  const { type, constraint } = req.body;
  if (!allowedTypes.includes(type.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid data type",
    });
  }

  if (!allowedConstraints.includes(constraint.toUpperCase())) {
    return res.status(400).json({
      message: "Invalid constraint",
    });
  }

  const sqlQuery = `ALTER TABLE products MODIFY name ${type} ${constraint} `;
  try {
    await pool.execute(sqlQuery);
    return res.status(200).json({
      message: "Type of Product Name Modified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to modify Product Name",
      error: err.message,
    });
  }
});
/************************** END  5- DB Modification *******************************/
/************************** START  9- Total Quantity Sold *******************************/
app.get("/products_Quantity_Sold", async (req, res) => {
  const sqlQuery = `SELECT
    p.id,
    p.name,
    COALESCE(SUM(s.sold_quantity), 0) AS total_quantity_sold
    FROM products p
    LEFT JOIN sales s
    ON p.id = s.product_id
    GROUP BY p.id, p.name`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    return res.status(200).json({
      message: "Get All Products Quantity where sold",
      rows: rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to Get All Products Quantity",
      error: err.message,
    });
  }
});
/************************** END  9- Total Quantity Sold *******************************/
/************************** START  10- product with highest stock quantity *******************************/
app.get("/productHighestStock", async (req, res) => {
  const sqlQuery = `SELECT *
FROM products
ORDER BY stock_quantity DESC
LIMIT 1`;

  try {
    const [rows] = await pool.execute(sqlQuery);
    return res.status(200).json({
      message: "Get the product with highest stock",
      rows: rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to Get All Products Quantity",
      error: err.message,
    });
  }
});
/************************** END  10- product with highest stock quantity *******************************/
/************************** START  11- Supplier Starts with custom character *******************************/
app.get("/getSupplierName", async (req, res) => {
  const { startWith } = req.query;
  const sqlQuery = `SELECT *
FROM suppliers
WHERE name LIKE ?
`;
  try {
    const [rows] = await pool.execute(sqlQuery, [
      `${startWith.toLowerCase()}%`,
    ]);
    if (rows.length == 0) {
      return res
        .status(404)
        .json({ message: `No Supplier Founded Starts With ${startWith}` });
    }
    res.status(200).json({
      message: `Get Supplier Where start with ${startWith}`,
      row: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Get All Products Quantity",
      error: err.message,
    });
  }
});
/************************** END  11- Supplier Starts with custom character *******************************/
/************************** START  12- products that have never been sold *******************************/
app.get("/productsNotSold", async (req, res) => {
  const sqlQuery = `SELECT p.*
FROM products p
LEFT JOIN sales s ON p.id = s.product_id
WHERE s.id IS NULL
`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    if (rows.length == 0) {
      return res.status(404).json({ message: `No Exist products not solded` });
    }
    res.status(200).json({
      message: `Get products Where not sold successfully`,
      row: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Get products Where not sold",
      error: err.message,
    });
  }
});
/************************** END  12- products that have never been sold *******************************/
/************************** START  13- Get all sales *******************************/
app.get("/getAllSales", async (req, res) => {
  const sqlQuery = `select 
  p.name as productName, s.sold_quantity as quantitySold, s.sale_date as saleDate 
  from products as p 
  inner join sales as s 
  on p.id = s.product_id
`;
  try {
    const [rows] = await pool.execute(sqlQuery);
    if (rows.length == 0) {
      return res.status(404).json({ message: `No Exist Sales` });
    }
    res.status(200).json({
      message: `Get All Sales successfully`,
      row: rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Get All Sales",
      error: err.message,
    });
  }
});
/************************** END  13- Get all sales *******************************/
/************************** START  14- create user and give access *******************************/
app.post("/createRoleAuthorized", async (req, res) => {
  const { userName, password, permissions } = req.body;
  const splitPermissions = permissions.split(",");
  const endPermissions = splitPermissions.map((permission) =>
    permission.trim(),
  );
  const allowedPermissions = ["insert", "select", "update"];
  const fields = endPermissions.filter((value) =>
    allowedPermissions.includes(value),
  );
  const account = `'${userName}'@'localhost'`;
  const Access = fields
    .map((permission) => permission.toUpperCase())
    .join(", ");
  const connection = await pool.getConnection();
  const escapedPassword = connection.escape(password);
  const sqlQueryCreateUser = `CREATE USER ${account} IDENTIFIED BY ${escapedPassword}`;
  const sqlQueryGiveAccess = `GRANT ${Access} ON store_db.* TO ${account}`;

  let userCreated = false;
  try {
    await connection.execute(sqlQueryCreateUser);
    userCreated = true;

    await connection.query(sqlQueryGiveAccess);

    return res.status(201).json({
      message: "User created and permissions granted successfully",
      userName,
      permissions: fields,
    });
  } catch (err) {
    console.error(err);

    if (userCreated && connection) {
      try {
        await connection.query(`DROP USER IF EXISTS ${account}`);
      } catch (cleanupError) {
        console.error("Failed to clean up user:", cleanupError);
      }
    }

    return res.status(500).json({
      message: "Failed to create user or grant permissions",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
/************************** END  14- create user and give access *******************************/
/************************** START  15- Revoke access *******************************/
app.delete("/removeSpecificAccess", async (req, res) => {
  const { userName, permissions } = req.body;
  const splitPermissions = permissions.split(",");
  const endPermissions = splitPermissions.map((permission) =>
    permission.trim(),
  );
  const allowedPermissions = ["insert", "select", "update", "delete"];
  const fields = endPermissions.filter((value) =>
    allowedPermissions.includes(value),
  );

  const account = `'${userName}'@'localhost'`;
  const Access = fields
    .map((permission) => permission.toUpperCase())
    .join(", ");

  const sqlQueryRemoveAccess = `Revoke ${Access} ON store_db.* from ${account}`;

  try {
    await pool.execute(sqlQueryRemoveAccess);
    return res.status(200).json({
      message: `Removed (${Access}) Access Successfully from ${account}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove access", error: err });
  }
});
/************************** END  15- Revoke access *******************************/
/************************** START  16- GRANT access *******************************/
app.post("/giveSpecificAccess", async (req, res) => {
  const { userName, permissions } = req.body;
  const splitPermissions = permissions.split(",");
  const endPermissions = splitPermissions.map((permission) =>
    permission.trim(),
  );
  const allowedPermissions = ["insert", "select", "update", "delete"];
  const fields = endPermissions.filter((value) =>
    allowedPermissions.includes(value),
  );

  const account = `'${userName}'@'localhost'`;
  const Access = fields
    .map((permission) => permission.toUpperCase())
    .join(", ");

  const sqlQueryRemoveAccess = `GRANT ${Access} ON store_db.* TO ${account}`;

  try {
    await pool.execute(sqlQueryRemoveAccess);
    return res.status(200).json({
      message: `Give (${Access}) Access Successfully To ${account}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to give access", error: err });
  }
});
/************************** END  16- GRANT access *******************************/
/************************** START Error Handling *******************************/
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});
/************************** END Error Handling *******************************/
app.listen(3000);
