//Выгрузка маршрутов из API
function getRoutes() {
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=6373c0af-0602-46bc-9074-1f58d8d4ac19';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let routesData = document.getElementById('routesData');
            data.forEach(route => {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${route.name}</td><td>${route.description}</td><td>${parseAndFormatMainObjects(route.mainObject)}</td>`;
                routesData.appendChild(row);
            });
        });
}

//Очень кривой парсер
function parseAndFormatMainObjects(mainObject) {
    let regex = /\d+\.\s(.*?)(?=\d+\.\s|$)/gs;
    let matches = mainObject.match(regex);
    if (matches) {
        let listItems = matches.map(match => `<li>${match}</li>`).join('');
        return `<ul>${listItems}</ul>`;
    } else {
        // Разделение по тире, точкам, запятым и нумерации
        let objects = mainObject.split(/[,-]\s|\d+\.\s/);
        // Удаление пустых элементов и обертка каждой достопримечательности в тег <li>
        objects = objects.filter(object => object.trim() !== '').map(object => `<li>${object.trim()}</li>`);
        // Форматирование результатов как список
        return `<ul>${objects.join('')}</ul>`;
    }
}

// Функция для получения маршрутов по введенному названию и вывода их в таблицу
function searchRoutesByName(value) {
    const url = `http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes?api_key=6373c0af-0602-46bc-9074-1f58d8d4ac19&name=${value}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let routesData = document.getElementById('routesData');
            routesData.innerHTML = ''; // Очищаем предыдущие результаты
            data.forEach(route => {
                let row = document.createElement('tr');
                row.innerHTML = `<td>${route.name}</td><td>${route.description}</td><td>${parseAndFormatMainObjects(route.mainObject)}</td>`;
                routesData.appendChild(row);
            });
        });
}

// Получение элемента кнопки "search"
const searchButton = document.getElementById('searchButton');

// Добавление обработчика события при нажатии кнопки "search"
searchButton.addEventListener('click', function() {
    const value = document.getElementById('routeName').value; // Получаем значение из поля ввода
    searchRoutesByName(value); // Вызываем функцию поиска маршрутов по значению и выводим их в таблицу
});
