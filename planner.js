function generatePlanner() {
  // Obtenez les valeurs d'entrée
  const namesInput = document.getElementById('names').value.trim();
  const weeksOffInput = document.getElementById('weeksOff').value.trim();
  const initialDateInput = document.getElementById('initialDate').value;
  const numberOfWeeksInput = document.getElementById('numberOfWeeks').value;

  // Validez les entrées
  if (!namesInput || !weeksOffInput || !initialDateInput || !numberOfWeeksInput) {
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Séparez les noms et les semaines de congé en tableaux
  const names = namesInput.split(',').map(name => name.trim());
  const weeksOff = weeksOffInput.split(',').map(Number);

  // Générez les données du planning
  const plannerData = generatePlannerData(names, weeksOff, initialDate, numberOfWeeksInput);

  // Affichez le tableau du planning
  displayPlannerTable(plannerData);
}

function generatePlannerData(names, weeksOff, initialDate, numberOfWeeks) {
  // Combinez les noms et les semaines de congé en un tableau d'objets
  const data = names.map(name => ({ name }));

  // Mélangez les données à l'aide de lodash pour randomiser les positions des noms
  const shuffledData = _.shuffle(data);

  // Parcourez les semaines de congé et supprimez les noms correspondants
  weeksOff.forEach(week => {
    const startIndex = (week - 1) * 3;
    const endIndex = startIndex + 3;
    shuffledData.splice(startIndex, 3);
  });

  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const currentDate = new Date(initialDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    calendarData.push({
      weekNumber: i + 1,
      monday: currentDate.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      tuesday: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      wednesday: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      thursday: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      friday: new Date(currentDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      saturday: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' }),
      sunday: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })
    });
  }

  return { plannerData: shuffledData, calendarData };
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
  headerRow.innerHTML = '<th scope="col">Semaine</th><th scope="col">Lundi</th><th scope="col">Mardi</th><th scope="col">Mercredi</th><th scope="col">Jeudi</th><th scope="col">Vendredi</th><th scope="col">Samedi</th><th scope="col">Dimanche</th>';
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Créez le corps du tableau
  const tbody = document.createElement('tbody');
  for (let i = 0; i < calendarData.length; i++) {
    const row = document.createElement('tr');

    // Numéro de semaine dans la première colonne
    const weekCell = document.createElement('td');
    weekCell.textContent = calendarData[i].weekNumber;
    row.appendChild(weekCell);

    // Remplissez les cellules pour chaque jour de la semaine
    const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const dayName of dayNames) {
      const cell = document.createElement('td');
      cell.textContent = calendarData[i][dayName];
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Ajoutez le tableau au conteneur
  tableContainer.appendChild(table);
}
