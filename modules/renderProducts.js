export async function renderProductPage() {
  // 1. Получаем ID из URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) return;

  try {
    // 2. Делаем запрос к твоему серверу
    const response = await fetch(`/api/product/${productId}`);
    
    if (!response.ok) {
      document.querySelector(".product-main").innerHTML = "<h2>Товар не найден</h2>";
      return;
    }

    // Получаем данные из БД
    const product = await response.json();

    // 3. Заполняем страницу (обрати внимание, поля теперь называются как в БД)
    
    document.title = `${product.title} — POLYANSKIH SHOP`;
    
    // Хлебные крошки
    const crumbEl = document.getElementById("crumb-title");
    if (crumbEl) crumbEl.textContent = product.title;

    // Название
    const titleEl = document.querySelector(".product-info-product h1");
    if (titleEl) titleEl.textContent = product.title;

    // Картинки
    const mainImg = document.querySelector(".main-image img");
    if (mainImg) {
      mainImg.src = product.image_url;
      mainImg.alt = product.title;
    }

    // Миниатюры
    const miniImgs = document.querySelectorAll(".mini-image");
    
    // 1. Первое мини-фото (ПЕРЕД)
    if (miniImgs[0]) {
        const img = miniImgs[0].querySelector("img");
        if (img) img.src = product.image_url;
    }

    // 2. Второе мини-фото (ЗАД)
    if (miniImgs[1]) {
        if (product.image_back_url) {
            const img = miniImgs[1].querySelector("img");
            if (img) img.src = product.image_back_url;
            miniImgs[1].style.display = "block"; // Показываем, если есть фото
        } else {
            miniImgs[1].style.display = "none"; // Скрываем, если фото нет
        }
    }

    // 3. Третье мини-фото (Скрываем, так как у нас всего 2 фото)
    if (miniImgs[2]) {
        miniImgs[2].style.display = "none";
    }

    // Цены
    const oldPriceEl = document.querySelector(".old-price");
    const newPriceEl = document.querySelector(".new-price");
    if (oldPriceEl) oldPriceEl.textContent = `${product.old_price} руб.`;
    if (newPriceEl) newPriceEl.textContent = `${product.price} руб.`;

    // Описание и рейтинг
    const descEl = document.querySelector(".opisanie-product");
    const ratingEl = document.querySelector(".reviews");

    if (descEl) descEl.textContent = product.description;

    // === НОВАЯ ЛОГИКА ДЛЯ РЕЙТИНГА ===
    if (ratingEl && product.rating) {
        // Строка в базе выглядит так: "★★★★★ (12 отзывов)"
        // Мы разбиваем её на части по первому пробелу
        const parts = product.rating.split(' '); 
        const stars = parts[0]; // Получаем только звезды: "★★★★★"
        
        // Собираем оставшийся текст обратно (например, "(12 отзывов)")
        const restOfText = parts.slice(1).join(' ');

        // Используем innerHTML, чтобы вставить span с классом для цвета
        ratingEl.innerHTML = `<span class="gold-stars">${stars}</span> ${restOfText}`;
    }

    // Характеристики
    // Обрати внимание: product.spec_material (как в базе), а не product.specs.material
    const matEl = document.getElementById("spec-material");
    if (matEl) matEl.textContent = product.spec_material;

    const brandEl = document.getElementById("spec-brand");
    if (brandEl) brandEl.textContent = product.spec_brand;

    const seasonEl = document.getElementById("spec-season");
    if (seasonEl) seasonEl.textContent = product.spec_season;

    const artEl = document.getElementById("spec-article");
    if (artEl) artEl.textContent = product.spec_article;

  } catch (error) {
    console.error("Ошибка загрузки товара:", error);
    document.querySelector(".product-main").innerHTML = "<h2>Ошибка соединения с сервером</h2>";
  }
}