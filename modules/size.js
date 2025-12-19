export function initSizeSelection() {
  const sizeOptions = document.querySelectorAll(".size-option");

  if (sizeOptions.length > 0) {
    sizeOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Убираем класс active у всех кнопок
        sizeOptions.forEach((opt) => opt.classList.remove("active"));
        // Добавляем класс active той, на которую нажали
        this.classList.add("active");
      });
    });
  }
}