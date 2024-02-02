// Add a new input group and update the table dynamically
function addInputGroup() {
  const tableBody = document.getElementById('dataTableBody');

  const newRow = document.createElement('tr');
  newRow.classList.add('dynamic-input-group'); 

  // Nom
  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('name', 'form-control');
  nameInput.required = true;
  nameCell.appendChild(nameInput);
  newRow.appendChild(nameCell);

  // Repos
  const reposCell = document.createElement('td');
  const reposInput = document.createElement('input');
  reposInput.type = 'text';
  reposInput.classList.add('repos', 'form-control');
  reposInput.required = true;
  reposCell.appendChild(reposInput);
  newRow.appendChild(reposCell);

  // Vacances
  const vacationCell = document.createElement('td');
  const vacationInput = document.createElement('input');
  vacationInput.type = 'text';
  vacationInput.classList.add('vacation', 'form-control');
  vacationInput.placeholder = '2024-03-04, 2024-03-05';
  vacationInput.required = true;
  vacationCell.appendChild(vacationInput);
  newRow.appendChild(vacationCell);

  // Pourcentage
  const percentageCell = document.createElement('td');
  const percentageInput = document.createElement('input');
  percentageInput.type = 'number';
  percentageInput.classList.add('percentage', 'form-control');
  percentageInput.placeholder = '80';
  percentageInput.required = true;
  percentageCell.appendChild(percentageInput);
  newRow.appendChild(percentageCell);

  // Remove button
  const removeCell = document.createElement('td');
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('btn', 'btn-danger');
  removeButton.textContent = '[-]';
  removeButton.onclick = function () {
    removeInputGroup(this);
  };
  removeCell.appendChild(removeButton);
  newRow.appendChild(removeCell);

  tableBody.appendChild(newRow);
}

function removeInputGroup(button) {
  const tableRow = button.closest('tr'); // Find the closest ancestor tr element
  tableRow.parentNode.removeChild(tableRow); // Remove the entire row
}

function generatePlanner() {
  // Obtenez les valeurs d'entrée
  let nbDeGarde, initialDateInput, numberOfWeeksInput;
  let dynamicInputs = [];

  if (DEBUG_MODE) {
    dynamicInputs = [
      {
        "name": "riri",
        "repos": "Lundi",
        "vacation": "2024-02-02",
        "percentage": "80"
      },
      {
        "name": "fifi",
        "repos": "Mardi",
        "vacation": "2024-02-08",
        "percentage": "100"
      },
      {
        "name": "loulou",
        "repos": "Mercredi",
        "vacation": "2024-02-15",
        "percentage": "100"
      }
    ];
    nbDeGarde = 2 ;
    initialDateInput = "2024-01-10";
    numberOfWeeksInput = 3;
  }
  else {
    // Obtenez les valeurs des champs dynamiques
    const inputGroups = document.querySelectorAll('.dynamic-input-group');

    inputGroups.forEach(group => {
      const name = group.querySelector('.name').value.trim();
      const repos = group.querySelector('.repos').value.trim();
      const vacation = group.querySelector('.vacation').value.trim();
      const percentage = group.querySelector('.percentage').value.trim();

      dynamicInputs.push({ name, repos, vacation, percentage });
    });

    // Maintenant, vous avez les valeurs dans dynamicInputs
    console.log(dynamicInputs);

    // Champs d'options
    nbDeGarde = document.getElementById('nbDeGarde').value.trim();
    initialDateInput = document.getElementById('initialDate').value;
    numberOfWeeksInput = document.getElementById('numberOfWeeks').value;
    // Validez les entrées
    if (!nbDeGarde || !initialDateInput || !numberOfWeeksInput) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  }
  
  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Générez les données du planning
  const calendarData = generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeksInput);

  // Affichez le tableau du planning
  if (!DEBUG_MODE) {displayPlannerTable(nbDeGarde, calendarData);}  
}

function nameFulfiller(nbDeGarde, date, dynamicInputs) {
  const randomIndex = Math.floor(Math.random() * dynamicInputs.length);
  return dynamicInputs[randomIndex].name;
}

function generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeks) {
  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];
  const dateOpt = {weekday: 'long', month: 'long', day: 'numeric'};

  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    const currentDate = new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000);

    // Create an object to store the calendar data for the current week
    const weekData = {
      date: currentDate.toLocaleDateString('fr-FR', dateOpt)
    };

    // Add garde properties dynamically based on the names array
    for (let j = 0; j < nbDeGarde; j++) {
      weekData[`garde${j + 1}`] = nameFulfiller(j + 1, currentDate, dynamicInputs);
    }

    // Push the weekData object into the calendarData array
    calendarData.push(weekData);

    if (DEBUG_MODE) {console.log(calendarData);}
  }

  return calendarData;
}

function displayPlannerTable(nbDeGarde, calendarData) {
  const tableContainer = document.getElementById('plannerTable');

  // Effacez le tableau précédent
  tableContainer.innerHTML = '';

  // Créez le corps du tableau
  const tbody = document.createElement('tbody');
  let storedMonth = '';

  // Set this as global variable
  let isNewMonth = false;

  for (let i = 0; i < calendarData.length; i++) {
    // Evaluate when there is a new month
    let currentMonth = calendarData[i].date.split(' ')[2];
    
    if (i % 7 === 0) { //Reinit isNewMonth after 7 days 
      isNewMonth = false;
    }

    // If we are in a new month, save its new value.
    if (i === 0 || currentMonth !== storedMonth) {
      storedMonth = currentMonth;
      isNewMonth = true;
    }
    
    // Create a new table every sunday of each new month
    if (calendarData[i].date.split(' ')[0] === 'dimanche' && isNewMonth) { 
      // Close the previous table and add it to the container
      if (i !== 0) {
        const table = document.createElement('table');
        table.className = 'table table-bordered';
        table.appendChild(tbody.cloneNode(true)); // Clone the tbody to avoid moving nodes
        tableContainer.appendChild(table);
      }

      // Create a new tbody for the next table
      tbody.innerHTML = '';

      // Header pour le mois
      const headerRowMonth = document.createElement('tr');
      headerRowMonth.innerHTML = `<th scope="col" colspan="7" style="text-align: center;">${calendarData[i].date.split(' ')[2]}</th>`;
      tbody.appendChild(headerRowMonth);
    }

    // Add rows to the current tbody
    if (i % 7 === 0) {
      var row = document.createElement('tr');
    }

    // Remplissez les cellules pour chaque jour de la semaine
    const cell = document.createElement('td');
    cell.innerHTML = `<strong>${calendarData[i].date}</strong><br>`;

    for (let j = 0; j < nbDeGarde; j++) {
      cell.innerHTML += `${calendarData[i][`garde${j + 1}`]}<br>`;
    }
    cell.style.textAlign = 'center'; // Apply text-align style to center-align the content
    row.appendChild(cell);

    // If this is the last cell in the row or the last iteration, add the row to the tbody
    if (i % 7 === 6 || i === calendarData.length - 1) {
      tbody.appendChild(row);
    }
  }

  // Ajoutez le dernier tableau au conteneur
  const lastTable = document.createElement('table');
  lastTable.className = 'table table-bordered';
  lastTable.appendChild(tbody);
  tableContainer.appendChild(lastTable);
}

//TEST
let DEBUG_MODE = false ;
DEBUG_MODE = process.argv[2];
if (DEBUG_MODE) {generatePlanner();}