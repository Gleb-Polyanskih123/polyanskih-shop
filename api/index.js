const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();

// Настройка CORS и JSON
app.use(cors());
app.use(express.json());

// Настройка подключения к базе Neon с отдельными переменными
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Проверка подключения при старте
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// === API МАРШРУТЫ ===

app.get("/", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Укажите логин и пароль",
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Неверный логин или пароль" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера",
      details: err.message,
    });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Укажите логин и пароль",
    });
  }

  try {
    const check = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (check.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Пользователь уже существует",
      });
    }

    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);

    res.json({ success: true, message: "Регистрация успешна" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера",
      details: err.message,
    });
  }
});

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error("Products error:", err);
    res.status(500).json({
      error: "Ошибка получения товаров",
      details: err.message,
    });
  }
});

app.post("/buy", async (req, res) => {
  const { customer_name, customer_phone, product_name, product_size } =
    req.body;

  if (!customer_name || !customer_phone || !product_name) {
    return res.status(400).json({
      success: false,
      message: "Заполните все обязательные поля",
    });
  }

  try {
    await pool.query(
      "INSERT INTO orders (customer_name, customer_phone, product_name, product_size) VALUES ($1, $2, $3, $4)",
      [customer_name, customer_phone, product_name, product_size || "Не указан"]
    );

    res.json({ success: true, message: "Заказ оформлен" });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({
      success: false,
      error: "Ошибка оформления заказа",
      details: err.message,
    });
  }
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Маршрут не найден" });
});

// Экспорт для Vercel
module.exports = app;
