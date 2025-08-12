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

const router = express.Router();

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

export { router as adminRouter };
