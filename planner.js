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
  headerRow.innerHTML = '<th scope="col">Week 1</th><th scope="col">Week 2</th><th scope="col">Week 3</th><th scope="col">Week 4</th>';
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  for (let i = 0; i < plannerData.length; i += 4) {
    const row = document.createElement('tr');
    for (let j = i; j < i + 4; j++) {
      const cell = document.createElement('td');
      cell.textContent = plannerData[j] ? plannerData[j].name : '';
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Append table to the container
  tableContainer.appendChild(table);
}
