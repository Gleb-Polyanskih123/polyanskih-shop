// Импортируем функции из модулей
import { initAuth } from "./modules/auth.js";
import { initBuyOneClick } from "./modules/buy.js";
import { initMap } from "./modules/map.js";
import { initGallery } from "./modules/gallery.js";
import { initScrollToTop } from "./modules/scroll.js";
import { initSizeSelection } from "./modules/size.js";

// ВАЖНО: Проверь название файла. Ты загрузил "renderProducts.js" (во множественном числе).
// Если файл называется так, то импорт должен быть таким:
import { renderProductPage } from "./modules/renderProducts.js"; 

document.addEventListener("DOMContentLoaded", function () {
  // Запускаем стандартные модули
  initAuth();
  
  initBuyOneClick();
  initMap();
  initGallery();
  initScrollToTop();
  initSizeSelection();
  // ЗАПУСКАЕМ ЗАГРУЗКУ ТОВАРА
  // Эта функция сработает только если мы на странице product.html
  console.log("Пытаемся загрузить товар..."); // Для проверки в консоли
  renderProductPage(); 
});