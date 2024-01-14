function generatePlanner() {
  // Obtenez les valeurs d'entrée
  const namesInput = document.getElementById('names').value.trim();
  //const weeksOffInput = document.getElementById('weeksOff').value.trim();
  const initialDateInput = document.getElementById('initialDate').value;
  const numberOfWeeksInput = document.getElementById('numberOfWeeks').value;

  // Validez les entrées
  if (!namesInput || !initialDateInput || !numberOfWeeksInput) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Séparez les noms et les semaines de congé en tableaux
  const names = namesInput.split(',').map(name => name.trim());
  //const weeksOff = weeksOffInput.split(',').map(Number);

  // Générez les données du planning
  const calendarData = generatePlannerData(names, initialDate, numberOfWeeksInput);

  // Affichez le tableau du planning
  displayPlannerTable(calendarData);
}

function generatePlannerData(names, initialDate, numberOfWeeks) {
  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];
  const dateOpt = {weekday: 'long', month: 'long', day: 'numeric'};
  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    calendarData.push(new Date(initialDate.getTime() + i * 86400000).toLocaleDateString('fr-FR', dateOpt));
  }

  return calendarData;
}

function displayPlannerTable(calendarData) {
  const tableContainer = document.getElementById('plannerTable');

  // Effacez le tableau précédent
  tableContainer.innerHTML = '';

  // Créez et ajoutez le tableau
  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Créez l'en-tête du tableau
  const thead = document.createElement('thead');

  //Header pour le mois
  const headerRowMonth = document.createElement('tr');
  headerRowMonth.innerHTML = `<th scope="col" colspan="7" style="text-align: center;">${calendarData[0].split(' ')[2]}</th>`;
  thead.appendChild(headerRowMonth);

  //Header pour les jours
  const headerRowDay = document.createElement('tr');
  for (let i = 0; i < 7 ; i++) {
    headerRowDay.insertAdjacentHTML('beforeend', `<th scope="col" style="text-align: center;">${calendarData[i].split(' ')[0]}</th>`);
  }
  thead.appendChild(headerRowDay);

  table.appendChild(thead);

  // Créez le corps du tableau
  const tbody = document.createElement('tbody');
  for (let i = 0; i < calendarData.length; i++) {
    if (i % 7 === 0) {
      // Create a new row for every 7 cells
      var row = document.createElement('tr');
    }

    // Remplissez les cellules pour chaque jour de la semaine
    const cell = document.createElement('td');
    cell.textContent = calendarData[i];
    row.appendChild(cell);

    // If this is the last cell in the row or the last iteration, add the row to the tbody
    if (i % 7 === 6 || i === calendarData.length - 1) {
      tbody.appendChild(row);
    }
  }
  table.appendChild(tbody);


  // Ajoutez le tableau au conteneur
  tableContainer.appendChild(table);
}
