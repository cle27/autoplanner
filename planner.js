// Generic const
const dateOpt = {weekday: 'long', month: 'long', day: 'numeric'};
const weekendDays = ['samedi','dimanche']

// Fonction pour déterminer si le jour est un jour férié
function isBankHoliday(currentDate) {
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  let isBankHoliday = false;

  // List of fixed jours fériés in France
  const holidays = [
    { day: 1, month: 0 },  // Nouvel an - January 1
    { day: 1, month: 4 },  // Fête du Travail - May 1
    { day: 8, month: 4 },  // Victoire 1945 - May 8
    { day: 14, month: 6 }, // Fête Nationale - July 14
    { day: 15, month: 7 }, // Assomption - August 15
    { day: 1, month: 10 }, // Toussaint - November 1
    { day: 11, month: 10 },// Armistice 1918 - November 11
    { day: 25, month: 11 } // Noël - December 25
  ];

  // Check if the current date is a jour férié
  for (const holiday of holidays) {
    if (day === holiday.day && month === holiday.month) {
      isBankHoliday = true;
      break;
    }
  }

  return isBankHoliday;
}

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
  percentageInput.placeholder = '100 par défaut';
  percentageInput.required = true;
  percentageCell.appendChild(percentageInput);
  newRow.appendChild(percentageCell);

  // gardeArray Output
  const gardeArrayCell = document.createElement('td');
  gardeArrayCell.classList.add('gardeArray', 'form-control');
  newRow.appendChild(gardeArrayCell);

  // gardeArrayWE Output
  const gardeArrayWECell = document.createElement('td');
  gardeArrayWECell.classList.add('gardeArrayWE', 'form-control');
  newRow.appendChild(gardeArrayWECell);

  // gardeArrayJF Output
  const gardeArrayJFCell = document.createElement('td');
  gardeArrayJFCell.classList.add('gardeArrayJF', 'form-control');
  newRow.appendChild(gardeArrayJFCell);

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
  let nbDeGarde, initialDateInput, numberOfWeeksInput, oneIsTwoWE, isOneIsTwoWE, jourFerieSeparated, isJourFerieSeparated, weekendSeparated, isWeekendSeparated;
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
    isOneIsTwoWE = true;
    isJourFerieSeparated = true;
    isWeekendSeparated = true;
  }
  else {
    // Get les valeurs des champs statiques
    nbDeGarde = document.getElementById('nbDeGarde').value.trim();
    initialDateInput = document.getElementById('initialDate').value;
    numberOfWeeksInput = document.getElementById('numberOfWeeks').value;
    oneIsTwoWE = document.getElementById('oneIsTwoWE');
    isOneIsTwoWE = oneIsTwoWE.checked;
    jourFerieSeparated = document.getElementById('jourFerieSeparated');
    isJourFerieSeparated = jourFerieSeparated.checked;
    weekendSeparated = document.getElementById('weekendSeparated');
    isWeekendSeparated = weekendSeparated.checked;

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
      const percentageInput = group.querySelector('.percentage').value.trim();

      // Checks
      // Name is not empty
      if (!name) {
        alert('Le nom ne doit pas être vide.');
        return;
      }
           
      // Ternary : If percentage is not empty, convert it to a number
      const percentage = percentageInput ? Number(percentageInput) : 100;

      // Split the comma-separated values into an array
      const vacationArray = vacationInput.split(',').map(date => date.trim());
      const vacationRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
      
      for (const date of vacationArray) {
        if (date && !vacationRegex.test(date)) {
          alert('Le format des dates de congés doit être YYYY-MM-DD séparé par des virgules pour chaque jour de vacances.');
          return; // Stop further processing
        }
      }

      // Créé des array basé sur le nbDeGarde
      const gardeArray = Array.from({ length: nbDeGarde }, () => 0);
      const gardeArrayWE = Array.from({ length: nbDeGarde }, () => 0);
      const gardeArrayJF = Array.from({ length: nbDeGarde }, () => 0);

      dynamicInputs.push({ name, repos, vacation: vacationArray, percentage, gardeArray, gardeArrayWE, gardeArrayJF});
    });

    console.log(dynamicInputs);
  }
  
  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Générez les données du planning
  const calendarData = generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeksInput, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated);
  console.log(calendarData);

  // Refresh Garde Output Cells
  const gardeArrayCells = document.querySelectorAll('.gardeArray');
  gardeArrayCells.forEach((cell, index) => {
    const gardeArrayValues = "Sem: " + dynamicInputs[index].gardeArray.join(', ');
    cell.textContent = gardeArrayValues;
  });
  if (isWeekendSeparated) { // If we consider Weekends as separated
  const gardeArrayWECells = document.querySelectorAll('.gardeArrayWE');
  gardeArrayWECells.forEach((cell, index) => {
    const gardeArrayWEValues = "WE: " + dynamicInputs[index].gardeArrayWE.join(', ');
    cell.textContent = gardeArrayWEValues;
  });
  }
  if (isJourFerieSeparated) { // If we consider Jours Férié as separated
    const gardeArrayJFCells = document.querySelectorAll('.gardeArrayJF');
    gardeArrayJFCells.forEach((cell, index) => {
      const gardeArrayJFValues = "Férié: " + dynamicInputs[index].gardeArrayJF.join(', ');
      cell.textContent = gardeArrayJFValues;
    });
  }

  // Affichez le tableau du planning en mode pas debug
  if (!DEBUG_MODE) {displayPlannerTable(nbDeGarde, calendarData);}  
}

function nameFulfiller(currNbDeGarde, currentDate, currentDayName, calendarData, dynamicInputs, nameUsed, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated) {
  let nameResult = "";
  let nameList = [];
  const currentDateStr = currentDate.toLocaleDateString('fr-FR', dateOpt);

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


function generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeks, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated) {
  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];

  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    const currentDate = new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000);
    const currentDayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' })
    const nameUsed = [];

    // Create an object to store the calendar data for the current week
    const dayData = {
      date: currentDate.toLocaleDateString('fr-FR', dateOpt),
      repos: []
    };

    // Check if today is a jour de repos or congé for any person and add them to the list
    dynamicInputs.forEach(input => {
      if ((currentDate.toLocaleDateString('fr-FR', { weekday: 'long' }) === input.repos) ||
          (input.vacation.includes(currentDate.toISOString().split('T')[0])) ) { // Format Current Date into YYYY-MM-DD
        nameUsed.push(input.name)
        dayData.repos.push(input.name);
      }
    });

    // Add garde properties dynamically based on the names array
    for (let j = 0; j < nbDeGarde; j++) {
      dayData[`garde${j + 1}`] = nameFulfiller(j + 1, currentDate, currentDayName, calendarData, dynamicInputs, nameUsed, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated);
      nameUsed.push(dayData[`garde${j + 1}`]);

      // Find the dynamic input for the current name
      const dynamicInput = dynamicInputs.find(input => input.name === dayData[`garde${j + 1}`]);

      // Update the gardeArrays for the found dynamic input
      if (dynamicInput) {
        if (weekendDays.includes(currentDayName) && isWeekendSeparated){
          if (isOneIsTwoWE){
            if (currentDayName === "dimanche") {
              dynamicInput.gardeArrayWE[j]++;
            }
          } else {
            dynamicInput.gardeArrayWE[j]++;
          }
        } else if (isBankHoliday(currentDate) && isJourFerieSeparated) {
          dynamicInput.gardeArrayJF[j]++;
        } else {
          dynamicInput.gardeArray[j]++;
        }
      }
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