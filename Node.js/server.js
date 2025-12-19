require("dotenv").config(); // Подключаем чтение .env файла
const dns = require("node:dns");
dns.setDefaultResultOrder("ipv4first");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");

const app = express();
// Порт будет выдавать хостинг, либо 3000 для локальной работы
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// === САМОЕ ВАЖНОЕ: РАЗДАЧА ФАЙЛОВ ===
// Сервер теперь отдает браузеру все файлы из текущей папки (html, css, js, img)
app.use(express.static(path.join(__dirname, '..'))); 

app.get('/', (req, res) => {
  // Ищем index.html тоже на уровень выше
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
// Настройка базы данных
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // В облаке нужно SSL соединение (secure), локально — нет
  ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

// === МАРШРУТЫ (API) ===

// 1. РЕГИСТРАЦИЯ
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: "Заполните все поля!" });
  if (password.length < 6) return res.json({ success: false, message: "Пароль должен быть не менее 6 символов" });
  if (username.length < 3) return res.json({ success: false, message: "Логин должен быть не менее 3 символов" });

  try {
    const checkUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (checkUser.rows.length > 0) return res.json({ success: false, message: "Пользователь уже существует" });

    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
    res.json({ success: true, message: "Регистрация успешна!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// 2. ВХОД
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ success: false, message: "Введите логин и пароль!" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.json({ success: false, message: "Пользователь не найден" });

    const user = result.rows[0];
    if (user.password === password) {
      res.json({ success: true, username: user.username, message: "Вход выполнен!" });
    } else {
      res.json({ success: false, message: "Неверный пароль" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// 3. ПОЛУЧЕНИЕ ОДНОГО ТОВАРА
app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Товар не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// 4. ПОКУПКА
app.post("/buy", async (req, res) => {
  const { name, phone, product, size } = req.body;
  if (!name || !phone) return res.json({ success: false, message: "Заполните все поля" });

  try {
    await pool.query(
      "INSERT INTO orders (customer_name, customer_phone, product_name, product_size) VALUES ($1, $2, $3, $4)",
      [name, phone, product, size]
    );
    res.json({ success: true, message: "Заказ оформлен!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Ошибка сервера" });
  }
});

// ЗАПУСК
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Сервер работает на порту ${PORT}`);
  });
}

// Обязательно экспортируем app для Vercel
module.exports = app;