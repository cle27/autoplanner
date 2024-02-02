// Add a new input group dynamically
// Add a new input group and update the table dynamically
function addInputGroup() {
  const tableBody = document.getElementById('dataTableBody');

  const newRow = document.createElement('tr');

  // Nom
  const nameCell = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.classList.add('name', 'form-control');
  nameInput.required = true;
  nameCell.appendChild(nameInput);
  newRow.appendChild(nameCell);

  // Vacances
  const vacationCell = document.createElement('td');
  const vacationInput = document.createElement('input');
  vacationInput.type = 'text';
  vacationInput.classList.add('vacation', 'form-control');
  vacationInput.placeholder = 'e.g., 2024-03-05 to 2024-04-05';
  vacationInput.required = true;
  vacationCell.appendChild(vacationInput);
  newRow.appendChild(vacationCell);

  // Pourcentage
  const percentageCell = document.createElement('td');
  const percentageInput = document.createElement('input');
  percentageInput.type = 'number';
  percentageInput.classList.add('percentage', 'form-control');
  percentageInput.placeholder = 'e.g., 80';
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
  let namesInput, nbDeGarde, initialDateInput, numberOfWeeksInput;

  if (DEBUG_MODE) {
    namesInput = "riri, fifi, loulou"; 
    nbDeGarde = 2 ;
    initialDateInput = "2024-01-10";
    numberOfWeeksInput = 3;
  }
  else {
    namesInput = document.getElementById('names').value.trim();
    nbDeGarde = document.getElementById('nbDeGarde').value.trim();
    initialDateInput = document.getElementById('initialDate').value;
    numberOfWeeksInput = document.getElementById('numberOfWeeks').value;
    // Validez les entrées
    if (!namesInput || !nbDeGarde || !initialDateInput || !numberOfWeeksInput) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  }
  
  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Séparez les noms et les semaines de congé en tableaux
  const names = namesInput.split(',').map(name => name.trim());

  // Générez les données du planning
  const calendarData = generatePlannerData(names, nbDeGarde, initialDate, numberOfWeeksInput);

  // Affichez le tableau du planning
  if (!DEBUG_MODE) {displayPlannerTable(nbDeGarde, calendarData);}  
}

function nameFulfiller(nbDeGarde, date, names) {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

function generatePlannerData(names, nbDeGarde, initialDate, numberOfWeeks) {
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
      weekData[`garde${j + 1}`] = nameFulfiller(j + 1, currentDate, names);
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