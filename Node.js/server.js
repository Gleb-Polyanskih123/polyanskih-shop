const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. НАСТРОЙКА ПУТЕЙ (Чтобы Vercel видел файлы)
// __dirname — это папка Node.js. Мы выходим на уровень выше (..), в корень проекта.
const rootPath = path.join(__dirname, "..");

app.use(cors());
app.use(express.json());
// Раздаем статику (картинки, css) из корня
app.use(express.static(rootPath));

// 2. НАСТРОЙКА БАЗЫ (Обязательно включаем SSL для Neon)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // ЭТО ВАЖНО для облачной базы!
  },
});

// Проверка базы при запуске
pool.connect((err, client, release) => {
  if (err) {
    console.error("Ошибка подключения к БД:", err.stack);
  } else {
    console.log("✅ Успешное подключение к базе данных Neon!");
    release();
  }
});

// === МАРШРУТЫ (API) ===

// Вход
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
      res
        .status(401)
        .json({ success: false, message: "Неверный логин или пароль" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Проверяем, есть ли такой юзер
    const check = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (check.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Пользователь уже существует" });
    }
    // Создаем
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение товаров
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения товаров" });
  }
});

// Покупка
app.post("/buy", async (req, res) => {
  const { customer_name, customer_phone, product_name, product_size } =
    req.body;
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

// === ГЛАВНЫЕ СТРАНИЦЫ ===
// Любой другой запрос возвращает index.html (для одностраничного приложения)
app.get("*", (req, res) => {
  res.sendFile(path.join(rootPath, "index.html"));
});

// === ЗАПУСК (Специально для Vercel) ===
// Мы не запускаем app.listen внутри Vercel, он делает это сам.
// Но экспортируем приложение.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на порту ${PORT}`);
  });
}

module.exports = app;
