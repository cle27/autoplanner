// Generic const
const dateOpt = {weekday: 'long', month: 'long', day: 'numeric'};
const weekendDays = ['samedi','dimanche']

// Ajouter une ligne par défaut au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  addInputGroup();
});

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
  nameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInputGroup();
      // Focus sur le nouveau champ nom
      const newRow = this.closest('tr').nextElementSibling;
      if (newRow) {
        const newNameInput = newRow.querySelector('.name');
        if (newNameInput) {
          newNameInput.focus();
        }
      }
    }
  });
  nameCell.appendChild(nameInput);
  newRow.appendChild(nameCell);

  // Repos
  const reposCell = document.createElement('td');
  const reposSelect = document.createElement('select');
  reposSelect.classList.add('repos', 'form-control');
  reposSelect.required = false;
  // Array of days of the week (excluding weekends)
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  // Create options for each day
  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.text = '-- Repos auto --';
  reposSelect.appendChild(emptyOption);
  
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
  vacationInput.placeholder = 'Ex : 2024-03-04, 2024-03-05';
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
  // Réinitialiser complètement les données avant de générer un nouveau planning
  window.globalDynamicInputs = null;

  // Obtenez les valeurs d'entrée
  let nbDeGarde, initialDateInput, numberOfWeeksInput;
  let dynamicInputs = [];

  // Get les valeurs des champs statiques
  nbDeGarde = document.getElementById('nbDeGarde').value.trim();
  initialDateInput = document.getElementById('initialDate').value;
  numberOfWeeksInput = document.getElementById('numberOfWeeks').value;

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
    
    // Initialiser le compteur de repos par jour (pour auto repos)
    const reposCounts = { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 };

    // Créer un nouvel objet pour chaque personne pour éviter les références partagées
    dynamicInputs.push({ 
      name, 
      repos, 
      vacation: [...vacationArray], 
      percentage, 
      gardeArray: [...gardeArray], 
      gardeArrayWE: [...gardeArrayWE], 
      gardeArrayJF: [...gardeArrayJF], 
      reposCounts: {...reposCounts} 
    });
  });

  console.log(dynamicInputs);
  
  
  // Rendre dynamicInputs accessible globalement pour le tableau récapitulatif
  window.globalDynamicInputs = dynamicInputs;
  
  // Convertissez la chaîne de date initiale en objet Date
  const initialDate = new Date(initialDateInput);

  // Générez les données du planning
  const calendarData = generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeksInput, true, true, true);
  console.log(calendarData);

  // Affichez le tableau du planning en mode pas debug
  if (!DEBUG_MODE) {
    // Effacer complètement le contenu précédent
    const plannerContainer = document.getElementById('plannerTable');
    plannerContainer.innerHTML = '';
    
    displayPlannerTable(nbDeGarde, calendarData);

    // Scroll vers le tableau généré
    plannerContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }  
}

function nameFulfiller(currNbDeGarde, currentDate, currentDayName, calendarData, dynamicInputs, nameUsed, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated) {
  let nameResult = "";
  const currentDateStr = currentDate.toLocaleDateString('fr-FR', dateOpt);
  const isWeekend = weekendDays.includes(currentDayName);
  const isJourFerie = isBankHoliday(currentDate);

  // Calculer le numéro de la semaine (0-based)
  const weekNumber = Math.floor(calendarData.length / 7);

  // Si c'est un weekend
  if (isWeekend) {
    // Récupérer le vendredi précédent
    const fridayIndex = calendarData.length - (weekendDays.indexOf(currentDayName) + 1);
    const fridayData = calendarData[fridayIndex];

    // Si c'est le samedi ou le dimanche
    if (currentDayName === 'samedi' || currentDayName === 'dimanche') {
      // Si on est en position 1, on prend la personne qui était en position 2 le vendredi
      if (currNbDeGarde === 1) {
        nameResult = fridayData.garde2;
      }
      // Si on est en position 2, on prend la personne qui était en position 1 le vendredi
      else if (currNbDeGarde === 2) {
        nameResult = fridayData.garde1;
      }
      // Pour les positions 3 et plus, on garde la même personne que le vendredi
      else {
        nameResult = fridayData[`garde${currNbDeGarde}`];
      }
    } else {
      // Pour le vendredi, on utilise la logique normale avec les règles de priorité
      let availablePeople = dynamicInputs.filter(person => !nameUsed.includes(person.name));
      
      if (availablePeople.length > 0) {
        availablePeople.sort((a, b) => {
          // Vérifier si la personne a déjà été dans cette position cette semaine
          const hasBeenInPositionA = a.gardeArray[currNbDeGarde - 1] > 0;
          const hasBeenInPositionB = b.gardeArray[currNbDeGarde - 1] > 0;
          
          // Pour les positions 1 et 2, prioriser ceux qui n'ont pas encore été dans cette position
          if (currNbDeGarde <= 2) {
            if (!hasBeenInPositionA && hasBeenInPositionB) return -1;
            if (hasBeenInPositionA && !hasBeenInPositionB) return 1;
          }
          
          // Pour la position 3 et plus, vérifier si la personne a été dans cette position le jour précédent
          if (currNbDeGarde >= 3) {
            const lastDay = calendarData[calendarData.length - 1];
            const wasInPositionYesterdayA = lastDay && lastDay[`garde${currNbDeGarde}`] === a.name;
            const wasInPositionYesterdayB = lastDay && lastDay[`garde${currNbDeGarde}`] === b.name;
            
            if (wasInPositionYesterdayA && !wasInPositionYesterdayB) return 1;
            if (!wasInPositionYesterdayA && wasInPositionYesterdayB) return -1;
          }
          
          // Si les règles de priorité ne s'appliquent pas, utiliser le compteur normal
          const countA = a.gardeArray[currNbDeGarde - 1] / (a.percentage / 100);
          const countB = b.gardeArray[currNbDeGarde - 1] / (b.percentage / 100);
          
          if (Math.abs(countA - countB) < 0.001) {
            return Math.random() - 0.5;
          }
          
          return countA - countB;
        });
        
        nameResult = availablePeople[0].name;
      }
    }
  } else {
    // Logique pour les jours normaux
    let availablePeople = dynamicInputs.filter(person => !nameUsed.includes(person.name));
    
    if (availablePeople.length > 0) {
      let arrayToUse = 'gardeArray';
      if (isJourFerie && isJourFerieSeparated) {
        arrayToUse = 'gardeArrayJF';
      }
      
      availablePeople.sort((a, b) => {
        // Vérifier si la personne a déjà été dans cette position cette semaine
        const hasBeenInPositionA = a[arrayToUse][currNbDeGarde - 1] > 0;
        const hasBeenInPositionB = b[arrayToUse][currNbDeGarde - 1] > 0;
        
        // Pour les positions 1 et 2, prioriser ceux qui n'ont pas encore été dans cette position
        if (currNbDeGarde <= 2) {
          if (!hasBeenInPositionA && hasBeenInPositionB) return -1;
          if (hasBeenInPositionA && !hasBeenInPositionB) return 1;
        }
        
        // Pour la position 3 et plus, vérifier si la personne a été dans cette position le jour précédent
        if (currNbDeGarde >= 3) {
          const lastDay = calendarData[calendarData.length - 1];
          const wasInPositionYesterdayA = lastDay && lastDay[`garde${currNbDeGarde}`] === a.name;
          const wasInPositionYesterdayB = lastDay && lastDay[`garde${currNbDeGarde}`] === b.name;
          
          if (wasInPositionYesterdayA && !wasInPositionYesterdayB) return 1;
          if (!wasInPositionYesterdayA && wasInPositionYesterdayB) return -1;
        }
        
        // Si les règles de priorité ne s'appliquent pas, utiliser le compteur normal
        const countA = a[arrayToUse][currNbDeGarde - 1] / (a.percentage / 100);
        const countB = b[arrayToUse][currNbDeGarde - 1] / (b.percentage / 100);
        
        if (Math.abs(countA - countB) < 0.001) {
          return Math.random() - 0.5;
        }
        
        return countA - countB;
      });
      
      nameResult = availablePeople[0].name;
    }
  }

  return nameResult;
}


function generatePlannerData(dynamicInputs, nbDeGarde, initialDate, numberOfWeeks, isOneIsTwoWE, isJourFerieSeparated, isWeekendSeparated) {
  // Réinitialiser les personnes avant la génération
  dynamicInputs.forEach(person => {
    // Réinitialiser les compteurs de garde
    for (let i = 0; i < person.gardeArray.length; i++) {
      person.gardeArray[i] = 0;
      person.gardeArrayWE[i] = 0;
      person.gardeArrayJF[i] = 0;
    }
    // Réinitialiser les compteurs de repos
    person.reposCounts = { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 };
    // Réinitialiser les jours de repos auto
    person.autoReposDays = [];
  });

  // Générez les données du calendrier pour le nombre spécifié de semaines
  const calendarData = [];
  
  // Initialiser les compteurs de repos auto pour chaque jour de la semaine
  const reposDaysCount = {
    'lundi': 0,
    'mardi': 0,
    'mercredi': 0,
    'jeudi': 0,
    'vendredi': 0
  };
  
  // Compteur pour suivre le nombre de personnes avec repos auto
  const autoReposCount = dynamicInputs.filter(input => !input.repos).length;

  for (let i = 0; i < 7 * numberOfWeeks; i++) {
    const currentDate = new Date(initialDate.getTime() + i * 24 * 60 * 60 * 1000);
    const currentDayName = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    const nameUsed = [];
    const dayOfWeek = currentDayName.toLowerCase();

    // Create an object to store the calendar data for the current week
    const dayData = {
      date: currentDate.toLocaleDateString('fr-FR', dateOpt),
      repos: []
    };

    // First, assign fixed repos days
    dynamicInputs.forEach(input => {
      // Si un jour de repos fixe est défini ou si c'est un jour de congé
      if ((input.repos && currentDayName.toLowerCase() === input.repos.toLowerCase()) ||
          (input.vacation.includes(currentDate.toISOString().split('T')[0]))) {
        nameUsed.push(input.name);
        dayData.repos.push(input.name);
      }
    });
    
    // Ensuite, attribuer les repos automatiques si c'est le début d'une semaine (lundi)
    if (dayOfWeek === 'lundi' && autoReposCount > 0) {
      // Répartir les repos pour la semaine
      assignAutoReposDays(dynamicInputs, i / 7, reposDaysCount);
    }
    
    // Vérifier si quelqu'un a un repos auto aujourd'hui
    dynamicInputs.forEach(input => {
      // Si la personne n'a pas de jour de repos fixe et n'est pas déjà en repos
      if (!input.repos && !nameUsed.includes(input.name) && !input.vacation.includes(currentDate.toISOString().split('T')[0])) {
        // Si cette personne a un repos auto pour ce jour de la semaine
        if (input.autoReposDays && input.autoReposDays.includes(dayOfWeek)) {
          nameUsed.push(input.name);
          dayData.repos.push(input.name);
        }
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

// Fonction pour assigner des jours de repos automatiquement et équitablement
function assignAutoReposDays(dynamicInputs, weekIndex, reposDaysCount) {
  // Filtrer les personnes qui n'ont pas de jour de repos fixe
  const autoReposPeople = dynamicInputs.filter(input => !input.repos);
  
  if (autoReposPeople.length === 0) return;
  
  // Réinitialiser les jours de repos auto pour chaque personne
  autoReposPeople.forEach(person => {
    person.autoReposDays = [];
  });
  
  // Jours de la semaine (en minuscules pour correspondre à la sortie de toLocaleDateString)
  // Exclusion des jours de weekend (samedi et dimanche)
  const weekdays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  
  // Distribution équitable sur les jours de la semaine en tenant compte des compteurs
  weekdays.forEach(day => {
    // Trier les personnes par le nombre de repos qu'elles ont eu ce jour (moins de repos d'abord)
    autoReposPeople.sort((a, b) => {
      // Initialiser les compteurs si nécessaire
      a.reposCounts = a.reposCounts || { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 };
      b.reposCounts = b.reposCounts || { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 };
      
      // Calculer un score basé sur le pourcentage et le nombre de repos déjà pris
      const scoreA = a.reposCounts[day] / (a.percentage / 100);
      const scoreB = b.reposCounts[day] / (b.percentage / 100);
      
      // Si les scores sont égaux, utiliser un élément aléatoire
      if (Math.abs(scoreA - scoreB) < 0.001) {
        return Math.random() - 0.5;
      }
      
      return scoreA - scoreB;
    });
    
    // Attribuer le jour de repos à la personne en haut de la liste (celle qui a eu le moins de repos)
    if (autoReposPeople.length > 0) {
      const selectedPerson = autoReposPeople[0];
      selectedPerson.autoReposDays.push(day);
      
      // Incrémenter le compteur de repos pour ce jour et cette personne
      selectedPerson.reposCounts = selectedPerson.reposCounts || { lundi: 0, mardi: 0, mercredi: 0, jeudi: 0, vendredi: 0 };
      selectedPerson.reposCounts[day]++;
      reposDaysCount[day]++;
      
      // Déplacer cette personne à la fin de la liste pour le prochain jour
      autoReposPeople.push(autoReposPeople.shift());
    }
  });
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
    const gardePersonnes = [];
    for (let j = 0; j < nbDeGarde; j++) {
      cell.innerHTML += `${j + 1}: ${calendarData[i][`garde${j + 1}`]}<br>`;
      gardePersonnes.push(calendarData[i][`garde${j + 1}`]);
    }

    // Repos - inclure uniquement ceux qui sont explicitement en repos
    if (calendarData[i].repos && calendarData[i].repos.length > 0) {
      cell.innerHTML += `R: <i>${calendarData[i].repos.join(', ')}</i><br>`;      
    }

    // Autres personnes (ni de garde ni en repos)
    const allNames = window.globalDynamicInputs.map(person => person.name);
    const autresPersonnes = allNames.filter(name => 
      !gardePersonnes.includes(name) && 
      !calendarData[i].repos.includes(name)
    );
    
    if (autresPersonnes.length > 0) {
      cell.innerHTML += `Ø: <i>${autresPersonnes.join(', ')}</i><br>`;
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
  
  // Afficher le tableau récapitulatif de répartition
  displaySummaryTable(nbDeGarde, tableContainer);
}

// Fonction pour afficher un tableau récapitulatif des statistiques de garde
function displaySummaryTable(nbDeGarde, tableContainer) {
  const dynamicInputs = document.querySelectorAll('.dynamic-input-group');
  
  if (dynamicInputs.length === 0) return;
  
  // Créer un tableau récapitulatif
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'mt-5';
  summaryDiv.innerHTML = '<h3>Statistiques de répartition des gardes</h3>';
  
  const summaryTable = document.createElement('table');
  summaryTable.className = 'table table-bordered table-striped';
  
  // Créer l'en-tête du tableau
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th>Nom</th>`;
  
  // Ajouter les colonnes pour chaque position de garde
  for (let i = 0; i < nbDeGarde; i++) {
    headerRow.innerHTML += `<th>Garde ${i+1} (Sem)</th>`;
  }
  
  // Ajouter les colonnes WE et JF
  for (let i = 0; i < nbDeGarde; i++) {
    headerRow.innerHTML += `<th>Garde ${i+1} (WE)</th>`;
  }
  
  for (let i = 0; i < nbDeGarde; i++) {
    headerRow.innerHTML += `<th>Garde ${i+1} (JF)</th>`;
  }
  
  thead.appendChild(headerRow);
  summaryTable.appendChild(thead);
  
  // Créer le corps du tableau
  const tbody = document.createElement('tbody');
  
  // Utiliser les données de window.globalDynamicInputs
  const globalData = window.globalDynamicInputs || [];
  
  // Si les données sont disponibles globalement
  if (globalData.length > 0) {
    globalData.forEach(person => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${person.name}</td>`;
      
      // Ajouter les valeurs pour chaque position de garde
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>${person.gardeArray[i] || 0}</td>`;
      }
      
      // Ajouter les valeurs WE
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>${person.gardeArrayWE[i] || 0}</td>`;
      }
      
      // Ajouter les valeurs JF
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>${person.gardeArrayJF[i] || 0}</td>`;
      }
      
      tbody.appendChild(row);
    });
  } else {
    // Fallback pour les cellules DOM (maintien de la compatibilité)
    document.querySelectorAll('.dynamic-input-group').forEach(group => {
      const row = document.createElement('tr');
      const name = group.querySelector('.name').value.trim();
      
      row.innerHTML = `<td>${name}</td>`;
      
      // Valeurs par défaut
      const defaultArray = Array(nbDeGarde).fill(0);
      
      // Ajouter les valeurs pour chaque position de garde
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>0</td>`;
      }
      
      // Ajouter les valeurs WE
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>0</td>`;
      }
      
      // Ajouter les valeurs JF
      for (let i = 0; i < nbDeGarde; i++) {
        row.innerHTML += `<td>0</td>`;
      }
      
      tbody.appendChild(row);
    });
  }
  
  summaryTable.appendChild(tbody);
  summaryDiv.appendChild(summaryTable);
  
  // Vérifier si des personnes ont un repos automatique
  const autoReposCount = (window.globalDynamicInputs || []).filter(input => !input.repos).length;
    
  if (autoReposCount > 0) {
    // Ajouter un tableau pour les statistiques de repos automatique
    const reposStatsDiv = document.createElement('div');
    reposStatsDiv.className = 'mt-5';
    reposStatsDiv.innerHTML = '<h3>Statistiques des jours de repos automatiques</h3>';
    
    const reposTable = document.createElement('table');
    reposTable.className = 'table table-bordered table-striped';
    
    // Créer l'en-tête du tableau de repos
    const reposThead = document.createElement('thead');
    const reposHeaderRow = document.createElement('tr');
    reposHeaderRow.innerHTML = '<th>Nom</th><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th>';
    reposThead.appendChild(reposHeaderRow);
    reposTable.appendChild(reposThead);
    
    // Créer le corps du tableau de repos
    const reposTbody = document.createElement('tbody');
    
    // Récupérer les informations de repos depuis le tableau dynamicInputs
    const dynamicInputsData = window.globalDynamicInputs || [];
    
    if (dynamicInputsData.length > 0) {
      // Parcourir les personnes avec repos auto
      const autoReposPeople = dynamicInputsData.filter(input => !input.repos);
      
      autoReposPeople.forEach(person => {
        const reposRow = document.createElement('tr');
        reposRow.innerHTML = `<td>${person.name}</td>`;
        
        // Ajouter les compteurs pour chaque jour (seulement jours de semaine)
        ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].forEach(day => {
          reposRow.innerHTML += `<td>${person.reposCounts?.[day] || 0}</td>`;
        });
        
        reposTbody.appendChild(reposRow);
      });
    } else {
      // Fallback si les données ne sont pas disponibles globalement
      const messageRow = document.createElement('tr');
      messageRow.innerHTML = '<td colspan="6">Statistiques détaillées des repos automatiques non disponibles pour ce planning.</td>';
      reposTbody.appendChild(messageRow);
    }
    
    reposTable.appendChild(reposTbody);
    reposStatsDiv.appendChild(reposTable);
    summaryDiv.appendChild(reposStatsDiv);
  }
  
  tableContainer.appendChild(summaryDiv);
}

//TEST
let DEBUG_MODE = false;