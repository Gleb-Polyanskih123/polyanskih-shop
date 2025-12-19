const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Настройка CORS и JSON
app.use(cors());
app.use(express.json());

// Настройка подключения к базе Neon
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  // Важно для Vercel: закрываем простои соединения, чтобы функция не зависала
  max: 1, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// === API МАРШРУТЫ ===

app.get("/", (req, res) => {
    res.send("Server is working via API folder!");
});

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
    res.status(500).json({ error: "Ошибка сервера: " + err.message });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const check = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (check.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Пользователь существует" });
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
    console.error("DB Error:", err);
    res.status(500).json({ error: "Ошибка получения товаров" });
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

// Экспортируем приложение для Vercel
module.exports = app;