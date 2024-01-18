// Функция для получения списка доступных гидов для выбранного маршрута
async function loadGuidesForRoute(routeId) {
    const guidesUrl = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=6373c0af-0602-46bc-9074-1f58d8d4ac19`;
  
    try {
      const response = await fetch(guidesUrl);
      if (response.ok) {
        const data = await response.json();
        displayGuidesData(data);
        document.getElementById('guidesContainer').style.display = 'flex'; // Отображаем контейнер с гидами
      } else {
        throw new Error('Failed to load guides');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
// Функция для отображения информации о доступных гидах в виде карточек
function displayGuidesData(guides) {
    const guidesContainer = document.getElementById('guidesContainer');
    guidesContainer.innerHTML = '';

    guides.forEach(guide => {
        const template = document.getElementById('guideCardTemplate');
        let clone = document.importNode(template.content, true);

        clone.querySelector('img').src = "img/photo.jpg";
        clone.querySelector('img').alt = `${guide.name} profile picture`;
        clone.querySelector('h3').textContent = guide.name;
        clone.querySelector('p:nth-of-type(1)').textContent = `Языки: ${guide.language}`;
        clone.querySelector('p:nth-of-type(2)').textContent = `Опыт работы: ${guide.workExperience} лет`;
        clone.querySelector('p:nth-of-type(3)').textContent = `Стоимость: ${guide.pricePerHour} руб./час`;
        clone.querySelector('button').setAttribute('onclick', `selectGuide(${guide.id})`);

        guidesContainer.appendChild(clone);
    });
}
  
// Функция для отображения кнопки "Оформить заявку"
function showApplyButton() {
  const applyButton = document.getElementById('applyButton');
  applyButton.style.display = 'block';
}

let selectedGuide = null;

// Функция для выбора гида
function selectGuide(guideName, guidePrice) {
  showApplyButton(); // Вызываем функцию для отображения кнопки "Оформить заявку"
  selectedGuide = {
    name: guideName,
    price: guidePrice
  };
}

// Обработчик события для кнопки "Выбрать" в карточке гида
document.querySelectorAll('.guide-select-button').forEach(button => {
  button.addEventListener('click', function() {
    const guideId = this.dataset.guideId;
    const guideName = this.dataset.guideName;
    selectGuide(guideName);
  });
});

// Функция для отображения модального окна с формой оформления заявки
function openBookingModal(routeName, guideName) {
  const modal = document.getElementById('modal');

  // Установка значений полей формы
  document.getElementById('selectedRoute').value = routeName;
  document.getElementById('selectedGuide').value = guideName;

  // Открытие модального окна
  modal.classList.remove('hidden');
}

// Обработчик события для кнопки "Оформить заявку"
document.getElementById('applyButton').addEventListener('click', function() {
  const routeName = document.getElementById('selectedRoute').value;
  const guideName = document.getElementById('selectedGuide').value;
  openBookingModal(routeName, guideName);
});

// Функция для отображения модального окна
function toggleModal() {
    const modal = document.getElementById('modal');
    modal.classList.toggle('hidden');
}

// Обработчик события для кнопки "Оформить заявку"
document.getElementById('applyButton').addEventListener('click', function() {
    toggleModal(); // Вызываем функцию для отображения/скрытия модального окна
  });

function calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors, isStudentDiscount, isSignLanguageSupport) {
    let price = guideServiceCost * hoursNumber;
    
    // Множитель для праздничных и выходных дней
    const dayOffMultiplier = isThisDayOff ? 1.5 : 1;
    price *= dayOffMultiplier;

    // Надбавка за раннее время экскурсии
    if (isItMorning) {
        price += 400;
    }

    // Надбавка за вечернее время экскурсии
    if (isItEvening) {
        price += 1000;
    }

    // Надбавка за количество посетителей
    if (numberOfVisitors > 10) {
        price += 1500;
    } else if (numberOfVisitors > 5) {
        price += 1000;
    }

    // Применение скидки для школьников и студентов
    if (isStudentDiscount) {
        price *= 0.85; // Уменьшение на 15%
    }
    
    // Применение сопровождения сурдопереводчика
    if (isSignLanguageSupport) {
        if (numberOfVisitors <= 5) {
            price *= 1.15; // Увеличение на 15%
        } else if (numberOfVisitors <= 10) {
            price *= 1.25; // Увеличение на 25%
        }
    }

    return price;  // Возвращение рассчитанной цены
}

// Функция для расчета цены и ее отображения
function calculateAndDisplayPrice() {
    // Получение значений из формы
    const guideServiceCost = selectedGuide.price;
    const hoursNumber = parseInt(document.getElementById('duration').value);
    const isThisDayOff = false; // Пример значения для дня выхода
    const isItMorning = false; // Пример значения для утреннего времени
    const isItEvening = false; // Пример значения для вечернего времени
    const numberOfVisitors = parseInt(document.getElementById('numberOfVisitors').value);
    const isStudentDiscount = document.getElementById('studentDiscount').checked;
    const isSignLanguageSupport = document.getElementById('signLanguageSupport').checked;
  
    // Вызов функции для расчета цены и получение результата
    const price = calculatePrice(guideServiceCost, hoursNumber, isThisDayOff, isItMorning, isItEvening, numberOfVisitors, isStudentDiscount, isSignLanguageSupport);
  
    // Отображение цены пользователю
    const finalPrice = document.getElementById('finalPrice');
    finalPrice.textContent = `${price} руб.`;
}

// Добавление обработчика события для отправки формы оформления заявки
document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращение отправки формы
    calculateAndDisplayPrice(); // Вызов функции для расчета и отображения цены
});