// Generic const
const dateOpt = {weekday: 'long', month: 'long', day: 'numeric'};
const weekendDays = ['samedi','dimanche']

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
  const reposSelect = document.createElement('select');
  reposSelect.classList.add('repos', 'form-control');
  reposSelect.required = true;
  // Array of days of the week
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  // Create options for each day
  daysOfWeek.forEach(day => {
    const option = document.createElement('option');
    option.value = day;
    option.text = day;
    reposSelect.appendChild(option);
  });
  reposCell.appendChild(reposSelect);
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
  let nbDeGarde, initialDateInput, numberOfWeeksInput, oneIsTwoWE, isOneIsTwoWE;
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
    oneIsTwoWE = true;
  }
  else {
    // Get les valeurs des champs statiques
    nbDeGarde = document.getElementById('nbDeGarde').value.trim();
    initialDateInput = document.getElementById('initialDate').value;
    numberOfWeeksInput = document.getElementById('numberOfWeeks').value;
    oneIsTwoWE = document.getElementById('oneIsTwoWE');
    isOneIsTwoWE = oneIsTwoWE.checked;

    // Check input
    // Not empty
    if (!initialDateInput) {
      alert('Veuillez remplir la date initiale du calendrier (un lundi).');
      return;
    }

    // nbDeGarde and numberOfWeeks are numbers
    if (!nbDeGarde) {
      alert('Le nombre de personnes de garde doit être un nombre valide.');
      return;
    }
    if (!numberOfWeeksInput) {
      alert('Le nombre de semaines doit être un nombre valide.');
      return;
    }

    // Get les valeurs des champs dynamiques
    const inputGroups = document.querySelectorAll('.dynamic-input-group');

    inputGroups.forEach(group => {
      const name = group.querySelector('.name').value.trim();
      const repos = group.querySelector('.repos').value.trim().toLowerCase();
      const vacationInput = group.querySelector('.vacation').value.trim();
      const percentage = group.querySelector('.percentage').value.trim();

      // Checks
      // Name is not empty
      if (!name) {
        alert('Le nom ne doit pas être vide.');
        return;
      }
      // Percentage is valid number
      if (!percentage) {
        alert('Le pourcentage doit être un nombre valide.');
        return;
      }

      // Split the comma-separated values into an array
      const vacationArray = vacationInput.split(',').map(date => date.trim());
      const vacationRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
      
      for (const date of vacationArray) {
        if (!vacationRegex.test(date)) {
          alert('Le format des dates de congés doit être YYYY-MM-DD séparé par des virgules pour chaque jour de vacances.');
          return; // Stop further processing
        }
      }

      // Créé un array basé sur le nbDeGarde
      const gardeArray = Array.from({ length: nbDeGarde }, () => 0);

      dynamicInputs.push({ name, repos, vacation: vacationArray, percentage, gardeArray});
    });

    console.log(dynamicInputs);
  }
  
  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Générez les données du planning
  const calendarData = generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeksInput, isOneIsTwoWE);
  console.log(calendarData);

  // Affichez le tableau du planning en mode pas debug
  if (!DEBUG_MODE) {displayPlannerTable(nbDeGarde, calendarData);}  
}

function nameFulfiller(currNbDeGarde, currentDate, calendarData, dynamicInputs, nameUsed, isOneIsTwoWE) {
  let nameResult = "";
  let nameList = [];
  const currentDateStr = currentDate.toLocaleDateString('fr-FR', dateOpt);
  const currentDayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })

  // Get the names from dynamicInputs
  for (let i = 0; i < dynamicInputs.length; i++) {
    const currName = dynamicInputs[i].name
    // If the name is already used for the day, don't use it
    if (!nameUsed.includes(currName)) {
      nameList.push(currName);
    }
  }

  // If the day is weekend, use Friday values
  if (weekendDays.includes(currentDayName) && isOneIsTwoWE){
    if (currNbDeGarde == 1) {
      nameResult = calendarData[calendarData.length - (weekendDays.indexOf(currentDayName)+1)].garde2;
    } else if (currNbDeGarde == 2) {
      nameResult = calendarData[calendarData.length - (weekendDays.indexOf(currentDayName)+1)].garde1;
    } else {
      nameResult = calendarData[calendarData.length - (weekendDays.indexOf(currentDayName)+1)][`garde${currNbDeGarde}`]
    }
  } else if (nameList.length > 0) { // If there are available names, randomly select one
    const randomIndex = Math.floor(Math.random() * nameList.length);
    nameResult = nameList[randomIndex];
  } else {
    // Handle the case where all names are already assigned, if needed
    console.log("Tous les noms sont déjà assignés pour " + currentDateStr);
  }

  return nameResult;
}


function generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeks, isOneIsTwoWE) {
  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];

  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    const currentDate = new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000);
    const nameUsed = [];

    // Create an object to store the calendar data for the current week
    const dayData = {
      date: currentDate.toLocaleDateString('fr-FR', dateOpt),
      repos: []
    };

    // Check if today is a jour de repos or congé for any person and add them to the list
    dynamicInputs.forEach(input => {
      if ((currentDate.toLocaleDateString('fr-FR', { weekday: 'long' }) === input.repos) ||
          (input.vacation.includes(currentDate.toISOString().split('T')[0])) ) { // Format Current Date
        nameUsed.push(input.name)
        dayData.repos.push(input.name);
      }
    });

    // Add garde properties dynamically based on the names array
    for (let j = 0; j < nbDeGarde; j++) {
      dayData[`garde${j + 1}`] = nameFulfiller(j + 1, currentDate, calendarData, dynamicInputs, nameUsed, isOneIsTwoWE);
      nameUsed.push(dayData[`garde${j + 1}`]);
    }

    // Push the dayData object into the calendarData array
    calendarData.push(dayData);

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

    // Garde
    for (let j = 0; j < nbDeGarde; j++) {
      cell.innerHTML += `${j + 1}: ${calendarData[i][`garde${j + 1}`]}<br>`;
    }

    //Repos
    if (calendarData[i][`repos`].length > 0){
      cell.innerHTML += `R: <i>${calendarData[i][`repos`]}</i><br>`;      
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