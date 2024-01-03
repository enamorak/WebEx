const url = 'http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes';
const apiKey = '6373c0af-0602-46bc-9074-1f58d8d4ac19';

fetch(`${url}?api_key=${apiKey}`, {
  method: 'GET'
})
  .then(response => response.json())
  .then(data => {
    let routesData = document.getElementById('routesData');
    for (let route of data) {
      let row = document.createElement('tr');
      let nameCell = document.createElement('td');
      nameCell.textContent = route.name;
      let descriptionCell = document.createElement('td');
      descriptionCell.textContent = route.description;
      row.appendChild(nameCell);
      row.appendChild(descriptionCell);
      routesData.appendChild(row);
    }
  })
  .catch(error => console.error('Error:', error));