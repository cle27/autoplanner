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
  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    calendarData.push(new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }));
  }

  return { calendarData };
}

function displayPlannerTable({ plannerData, calendarData }) {
  const tableContainer = document.getElementById('plannerTable');

  // Effacez le tableau précédent
  tableContainer.innerHTML = '';

  // Créez et ajoutez le tableau
  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Créez l'en-tête du tableau
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th scope="col">Lundi</th><th scope="col">Mardi</th><th scope="col">Mercredi</th><th scope="col">Jeudi</th><th scope="col">Vendredi</th><th scope="col">Samedi</th><th scope="col">Dimanche</th>';
  thead.appendChild(headerRow);
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
