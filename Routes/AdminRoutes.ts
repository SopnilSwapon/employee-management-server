import express from "express";
import connection from "../utils/db.js";
import jwt from "jsonwebtoken";

type TUser = {
  id: number;
  email: string;
  password: string;
};
type TCategory = {
  id: number;
  category_name: string;
};

type TEmployee = {
  name: string;
  category_name: string;
  salary: number | string;
  join_date: string | undefined;
};

const router = express.Router();

// login
router.post(
  "/adminlogin",
  (req: express.Request<{}, {}, TUser>, res: express.Response) => {
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    connection.query(
      sql,
      [req.body.email, req.body.password],
      (err, result: any, fields) => {
        if (err)
          return res.json({ loginStatus: false, Error: "Query error", err });
        if (result.length > 0 && result[0]) {
          const email = result[0].email;
          const token = jwt.sign(
            { role: "admin", email: email },
            "jwt_secret_key",

            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true });
        } else {
          return res.json({
            loginStatus: false,
            Error: "Wrong email or password",
          });
        }
      }
    );
  }
);

// add a category
router.post(
  "/add-category",
  (req: express.Request<{}, {}, TCategory>, res: express.Response) => {
    const sql = "INSERT INTO category (`category_name`) VALUES (?)";
    connection.query(sql, [req.body.category_name], (err, result) => {
      if (err) return res.json({ status: false, Error: "Query Error" });
      return res.json({ status: true });
    });
  }
);

// get categories
router.get(
  "/categories",
  (req: express.Request<{}, {}, TCategory>, res: express.Response) => {
    const sql = "SELECT * FROM category";
    connection.query(sql, (err, result) => {
      if (err) return res.json({ status: false, Error: "Query Error" });
      return res.json({ status: true, data: result });
    });
  }
);

// add a employee
router.post("/add-employee", (req: express.Request<{}, {}, TEmployee>, res) => {
  const sql = `INSERT INTO employees (name, category_name, salary, join_date) VALUES (?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      req.body.name,
      req.body.category_name,
      req.body.salary,
      req.body.join_date,
    ],
    (err, result) => {
      if (err) return res.json({ status: false, Error: err.message });
      return res.json({ status: true });
    }
  );
});

// get all employees
router.get(
  "/employees",
  (req: express.Request<{}, {}, TEmployee>, res: express.Response) => {
    const sql = `SELECT * FROM employees`;
    connection.query(sql, (err, result) => {
      if (err) return res.json({ status: false, Error: err.message });
      return res.json({ status: true, data: result });
    });
  }
);

// update a employee

router.put(
  "/update-employee/:id",
  (req: express.Request<{ id: string }, {}, TEmployee>, res) => {
    const id = req.params.id;
    const { name, category_name, salary, join_date } = req.body;
    const sql = `UPDATE employees SET name = ?, category_name = ?, salary = ?, join_date = ? WHERE id = ?`;
    connection.query(
      sql,
      [name, category_name, salary, join_date, id],
      (err, result) => {
        if (err) return res.json({ status: false, Error: err.message });
        return res.json({ status: true });
      }
    );
  }
);

export { router as adminRouter };
