const express = require("express");
const { Pool } = require("pg");
const cors = require("cors"); // Мы оставили cors, пригодится

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ВАЖНО: Мы убрали express.static и rootPath.
// Сервер теперь занимается ТОЛЬКО данными.

// Настройка базы Neon
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// === API МАРШРУТЫ ===

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Неверный логин" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const check = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Пользователь есть" });
    }
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка БД" });
  }
});

app.post("/buy", async (req, res) => {
  const { customer_name, customer_phone, product_name, product_size } = req.body;
  try {
    await pool.query(
      "INSERT INTO orders (customer_name, customer_phone, product_name, product_size) VALUES ($1, $2, $3, $4)",
      [customer_name, customer_phone, product_name, product_size]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Экспорт для Vercel
module.exports = app;