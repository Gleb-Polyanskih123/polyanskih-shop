export function initGallery() {
  const mainImage = document.querySelector(".main-image img");
  const thumbnails = document.querySelectorAll(".mini-image");

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        // Убираем класс active у всех
        thumbnails.forEach((t) => t.classList.remove("active"));
        // Добавляем текущему
        this.classList.add("active");
        
        // Меняем главное фото
        const imgTag = this.querySelector("img");
        if (imgTag) mainImage.src = imgTag.src;
      });
    });
  }
}