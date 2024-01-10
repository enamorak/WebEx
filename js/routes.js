document.addEventListener("DOMContentLoaded", function() {
    const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
    const apiKey = '6373c0af-0602-46bc-9074-1f58d8d4ac19';
    const itemsPerPage = 10; // Количество маршрутов на одной странице

    // Парсер для столбца "mainObject"
    function parseAndFormatMainObjects(mainObject) {
        let objects = mainObject.split(/[,-]\s|\d+\.\s/);
        objects = objects.filter(object => object.trim() !== '');
        return objects;
    }

    // Функция для запроса списка маршрутов по заданным параметрам
    function searchRoutesByNameAndLandmark(routeName, landmark) {
        fetch(`${url}?api_key=${apiKey}&name=${routeName}&mainObject=${landmark}`)
            .then(response => response.json())
            .then(data => displayRoutesData(data));
    }

    // Функция для отображения данных о маршрутах в таблице
    function displayRoutesData(routes) {
        const routesData = document.getElementById('routesData');
        routesData.innerHTML = '';
        
        routes.forEach(route => {
            let row = document.createElement('tr');
            row.innerHTML = `<td>${route.name}</td><td>${route.description}</td><td>${parseAndFormatMainObjects(route.mainObject).join(', ')}</td>`;
            routesData.appendChild(row);
        });
    }

    // Обработчик для кнопки "Search"
    document.getElementById('searchButton').addEventListener('click', function() {
        const routeName = document.getElementById('routeName').value;
        const landmark = document.getElementById('landmark').value;
        searchRoutesByNameAndLandmark(routeName, landmark);
    });

    // Обработчик события "change" для select
    document.getElementById('landmark').addEventListener('change', function() {
        const routeName = document.getElementById('routeName').value;
        const landmark = this.value; // Получаем выбранное значение из select
        searchRoutesByNameAndLandmark(routeName, landmark);
    });

    // Получение списка маршрутов при загрузке страницы
    fetch(`${url}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let landmarkSelect = document.getElementById('landmark');
            // Очищаем все текущие опции
            landmarkSelect.innerHTML = '';
            data.forEach(route => {
                parseAndFormatMainObjects(route.mainObject).forEach(landmark => {
                    let option = document.createElement('option');
                    option.value = landmark;
                    option.textContent = landmark;
                    landmarkSelect.appendChild(option);
                });
            });
            displayRoutesData(data);
    });

    // Функция для отображения данных о маршрутах в таблице с учетом номера страницы  
    function displayRoutesDataPage(routes, page) { 
        const routesData = document.getElementById('routesData'); 
        routesData.innerHTML = ''; 
 
        const startIndex = (page - 1) * itemsPerPage; 
        const endIndex = startIndex + itemsPerPage; 
        const displayRoutes = routes.slice(startIndex, endIndex); 
 
        displayRoutes.forEach(route => { 
            let row = document.createElement('tr'); 
 
            // Создаем ячейки для каждого поля маршрута 
            let nameCell = document.createElement('td'); 
            nameCell.textContent = route.name; 
            row.appendChild(nameCell); 
 
            let descriptionCell = document.createElement('td'); 
            descriptionCell.textContent = route.description; 
            row.appendChild(descriptionCell); 
 
            let mainObjectsCell = document.createElement('td'); 
            mainObjectsCell.textContent = parseAndFormatMainObjects(route.mainObject).join(', '); 
            row.appendChild(mainObjectsCell); 
 
            // Добавляем кнопку "Выбрать маршрут" в новой ячейке 
            let selectButton = document.createElement('button'); 
            selectButton.textContent = 'Выбрать'; 
            selectButton.addEventListener('click', function() { 
                loadGuidesForRoute(route.id); 
                alert(`Выбран маршрут: ${route.name}`); 
            }); 
            let selectButtonCell = document.createElement('td'); 
            selectButtonCell.appendChild(selectButton); 
            row.appendChild(selectButtonCell); 
 
            routesData.appendChild(row); 
        }); 
    }

    // Обработчики событий для кнопок пагинации
    document.querySelectorAll('.rounded-md').forEach(button => {
        button.addEventListener('click', function() {
            const pageNumber = parseInt(this.textContent);
            fetch(`${url}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(data => displayRoutesDataPage(data, pageNumber));
        });
    });

    // Получение списка маршрутов при загрузке страницы
    fetch(`${url}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            let pageCount = Math.ceil(data.length / itemsPerPage);
            let paginationDiv = document.getElementById('paginationButtons');
            for (let i = 1; i <= pageCount; i++) {
                let button = document.createElement('button');
                button.textContent = i;
                button.classList.add('bg-pink-200', 'mx-2', 'px-3', 'py-1', 'rounded-md');
                button.addEventListener('click', function() {
                    fetch(`${url}?api_key=${apiKey}`)
                        .then(response => response.json())
                        .then(data => displayRoutesDataPage(data, i));
                });
                paginationDiv.appendChild(button);
            }
            
            // Отображаем первую страницу маршрутов при загрузке страницы
            displayRoutesDataPage(data, 1);
        });
});