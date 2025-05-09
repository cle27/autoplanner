# AutoPlanner

AutoPlanner is a web-based application designed to automatically generate and manage work schedules, specifically tailored for managing guard rotations and time off. It's particularly useful for teams that need to maintain continuous coverage while respecting various constraints like vacations, fixed rest days, and work percentages.

## Features

- **Dynamic Schedule Generation**: Automatically generates schedules based on multiple parameters
- **Flexible Input System**: 
  - Add/remove team members dynamically
  - Set fixed rest days
  - Input vacation dates
  - Adjust work percentages
- **Smart Distribution**:
  - Even distribution of guard duties
  - Automatic rest day assignment
  - Weekend guard rotation management
  - Holiday coverage handling
- **Visual Calendar Display**:
  - Monthly view of the schedule
  - Color-coded assignments
  - Clear indication of rest days and vacations
- **Statistics and Summary**:
  - Guard duty distribution statistics
  - Rest day distribution overview
  - Workload balance indicators

## Usage

1. **Add Team Members**:
   - Click "Ajout nouveau nom" to add a new team member
   - Fill in their details:
     - Name (required)
     - Fixed rest day (optional)
     - Vacation dates (format: YYYY-MM-DD, comma-separated)
     - Work percentage (default: 100%)

2. **Configure Schedule Parameters**:
   - Number of simultaneous guards
   - Initial date (must be a Monday)
   - Number of weeks to generate

3. **Generate Schedule**:
   - Click "Générer le Planning" to create the schedule
   - The system will automatically:
     - Assign weekend guards
     - Distribute weekday guards
     - Handle vacation coverage
     - Manage rest days

## Technical Details

### Dependencies

- Bootstrap 4.3.1
- jQuery 3.3.1
- Popper.js 1.14.7
- Lodash 4.17.21

### Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Rules and Constraints

1. **Guard Assignment Rules**:
   - No same position twice in a week (unless necessary)
   - No consecutive days in same position
   - No same person in different positions same day
   - At least one day between positions 1 and 2

2. **Weekend Handling**:
   - Friday assignments are linked to weekend coverage
   - Saturday and Sunday share the same guards
   - Weekend guards are assigned first

3. **Rest Day Management**:
   - Fixed rest days are respected
   - Automatic rest day distribution when no fixed day is set
   - Rest days are distributed evenly across the week

4. **Vacation Coverage**:
   - Vacation days are excluded from guard duty
   - System automatically adjusts for vacation coverage
   - Red indicators for emergency coverage when needed

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 