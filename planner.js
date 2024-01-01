function generatePlanner() {
  // Get input values
  const namesInput = document.getElementById('names').value.trim();
  const weeksOffInput = document.getElementById('weeksOff').value.trim();

  // Validate inputs
  if (!namesInput || !weeksOffInput) {
    alert('Please enter names and weeks off.');
    return;
  }

  // Split names and weeks off into arrays
  const names = namesInput.split(',').map(name => name.trim());
  const weeksOff = weeksOffInput.split(',').map(Number);

  // Generate planner data
  const plannerData = generatePlannerData(names, weeksOff);

  // Display planner table
  displayPlannerTable(plannerData);
}

function generatePlannerData(names, weeksOff) {
  // Combine names and weeks off into an array of objects
  const data = names.map(name => ({ name }));

  // Shuffle the data using lodash to randomize names' positions
  const shuffledData = _.shuffle(data);

  // Iterate through weeks off and remove corresponding names
  weeksOff.forEach(week => {
    const startIndex = (week - 1) * 3;
    const endIndex = startIndex + 3;
    shuffledData.splice(startIndex, 3);
  });

  return shuffledData;
}

function displayPlannerTable(plannerData) {
  const tableContainer = document.getElementById('plannerTable');

  // Clear previous table
  tableContainer.innerHTML = '';

  // Create and append table
  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th scope="col">Week</th><th scope="col">Monday</th><th scope="col">Tuesday</th><th scope="col">Wednesday</th><th scope="col">Thursday</th><th scope="col">Friday</th><th scope="col">Saturday</th><th scope="col">Sunday</th>';
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');

  // Get the first day of the year 2024 (Monday)
  const firstDay = new Date(2024, 0, 1);
  // Iterate through weeks
  for (let weekNumber = 1; weekNumber <= 52; weekNumber++) {
    const row = document.createElement('tr');
    // Week number in the first column
    const weekCell = document.createElement('td');
    if (weekNumber % 2 === 0) {
      weekCell.textContent = weekNumber;
    }
    row.appendChild(weekCell);

    // Populate cells for each day of the week
    for (let day = 0; day < 7; day++) {
      const cell = document.createElement('td');
      const currentDate = new Date(firstDay.getTime() + (weekNumber - 1) * 7 * 24 * 60 * 60 * 1000 + day * 24 * 60 * 60 * 1000);
      // Display date only for Mondays
      if (day === 0) {
        cell.textContent = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);

  // Append table to the container
  tableContainer.appendChild(table);
}

