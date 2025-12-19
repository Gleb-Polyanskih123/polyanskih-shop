export function initBuyOneClick() {
  const buyBtn = document.getElementById("buy-click-btn");
  const buyModal = document.getElementById("buy-modal");
  const closeBuyBtn = document.getElementById("close-buy-modal");
  const buyForm = document.getElementById("buy-form");

  if (buyBtn && buyModal) {
    buyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      buyModal.classList.add("open");
    });

    if (closeBuyBtn) {
      closeBuyBtn.addEventListener("click", () => {
        buyModal.classList.remove("open");
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === buyModal) {
        buyModal.classList.remove("open");
      }
    });

    if (buyForm) {
      buyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("buy-name").value.trim();
        const phone = document.getElementById("buy-phone").value.trim();
        
        // Получаем название товара
        const productTitle = document.querySelector(".product-info-product h1")
          ? document.querySelector(".product-info-product h1").innerText
          : "Неизвестный товар";

        // === НОВОЕ: ПОЛУЧАЕМ РАЗМЕР ===
        // Ищем элемент с классом active внутри блока размеров
        const activeSizeEl = document.querySelector(".size-option.active");
        // Если нашли, берем текст (S, M, L...), иначе пишем "Не выбран"
        const size = activeSizeEl ? activeSizeEl.textContent.trim() : "Не выбран";

        if (!name || !phone) {
          alert("Заполните все поля!");
          return;
        }

        try {
          const response = await fetch("/buy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name,
              phone: phone,
              product: productTitle,
              size: size, // <--- Отправляем размер на сервер
            }),
          });

          const data = await response.json();

          if (data.success) {
            alert(data.message);
            buyModal.classList.remove("open");
            buyForm.reset();
          } else {
            alert("Ошибка: " + data.message);
          }
        } catch (error) {
          console.error("Ошибка:", error);
          alert("Не удалось отправить заказ. Проверьте сервер.");
        }
      });
    }
  }
}