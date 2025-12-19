export function initMap() {
  const mapContainer = document.getElementById("map");

  // Проверяем, существует ли контейнер карты и загружена ли библиотека Yandex
  if (mapContainer && typeof ymaps !== "undefined") {
    
    // Яндекс карты инициализируются через функцию ready
    ymaps.ready(init);

    function init() {
      // Координаты магазина (Санкт-Петербург, из твоего старого кода)
      const shopCoords = [59.916279, 30.309086];

      // Создаем карту
      const myMap = new ymaps.Map("map", {
        center: shopCoords,
        zoom: 15, // Немного приблизил для удобства
        controls: ['zoomControl', 'fullscreenControl'] // Элементы управления
      });

      // Создаем метку
      const myPlacemark = new ymaps.Placemark(shopCoords, {
        balloonContentHeader: "POLYANSKIH SHOP",
        balloonContentBody: "Лучшая одежда здесь!",
        balloonContentFooter: "Ждем вас ежедневно",
        hintContent: "Магазин одежды"
      }, {
        preset: 'islands#blackDotIcon' // Черная точка, подходит под твой стиль
      });

      // Добавляем метку на карту
      myMap.geoObjects.add(myPlacemark);
      
      // Отключаем скролл карты колесиком мыши (чтобы не мешал прокрутке страницы)
      myMap.behaviors.disable('scrollZoom'); 
    }
  }
}