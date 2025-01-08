// Get references to the necessary HTML elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;  // Flag to track if there is any input error

// Function to clean input strings by removing invalid characters (+, -, spaces)
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Function to check if an input contains scientific notation (e.g., 1e3, 2e-5)
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Function to add a new entry (food/drink or exercise) to the respective section
function addEntry() {
  // Get the container where the inputs will be added based on selected entry type
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // Determine the entry number (the number of existing text inputs in the selected section + 1)
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  let nameLabel = '';  // Label for the name input
  let nameInput = '';  // Placeholder for the name input
  let caloriesLabel = '';  // Label for the calories input
  let caloriesPlaceholder = '';  // Placeholder for the calories input

  // Check if the selected entry is "exercise" and set the appropriate labels and placeholders
  if (entryDropdown.value === 'exercise') {
    nameLabel = `Exercise Name ${entryNumber}`;
    nameInput = `Time to sweat it out!`;
    caloriesLabel = `Exercise Burned Calories`;
    caloriesPlaceholder = `Calories: Burned them like a pro!`;
  } else {
    // Default case for food or drink entries
    nameLabel = `Food or Drink  ${entryNumber}`;
    nameInput = `Nom nom, what’s on the menu?`;
    caloriesLabel = `Food or Drink Calories`;
    caloriesPlaceholder = `How many bites does it take?`;
  }
  // Generate the HTML for the new entry (name and calories inputs)
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">${nameLabel}</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="${nameInput}" class="entry-name-input" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">${caloriesLabel}</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="${caloriesPlaceholder}"
    class="entry-calories-input"
  />`;

  // Insert the generated HTML string into the target input container
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);

  // Apply custom styles based on the entry type (exercise or food/drink)
  if (entryDropdown.value === 'exercise') {
    // Apply green border and other styles for exercise-related inputs
    const nameInputElement = document.querySelector(`#${entryDropdown.value}-${entryNumber}-name`);
    const caloriesInputElement = document.querySelector(`#${entryDropdown.value}-${entryNumber}-calories`);
  
    // Apply styling for the exercise name input
    nameInputElement.style.border = '2px solid #4caf50'; // Green border
    nameInputElement.style.padding = '8px';  // Reduced padding
    nameInputElement.style.margin = '8px 0'; // Adjusted margin
    nameInputElement.style.borderRadius = '5px';
  
    // Apply styling for the exercise calories input
    caloriesInputElement.style.border = '2px solid #4caf50'; // Green border
    caloriesInputElement.style.padding = '8px';  // Reduced padding
    caloriesInputElement.style.margin = '8px 0'; // Adjusted margin
    caloriesInputElement.style.borderRadius = '5px';
  } else {
    // Apply red border and other styles for food/drink-related inputs
    const nameInputElement = document.querySelector(`#${entryDropdown.value}-${entryNumber}-name`);
    const caloriesInputElement = document.querySelector(`#${entryDropdown.value}-${entryNumber}-calories`);
  
    // Apply styling for the food/drink name input
    nameInputElement.style.border = '2px solid #f44336'; // Red border
    nameInputElement.style.padding = '8px';  // Reduced padding
    nameInputElement.style.margin = '8px 0'; // Adjusted margin
    nameInputElement.style.borderRadius = '5px';
  
    // Apply styling for the food/drink calories input
    caloriesInputElement.style.border = '2px solid #f44336'; // Red border
    caloriesInputElement.style.padding = '8px';  // Reduced padding
    caloriesInputElement.style.margin = '8px 0'; // Adjusted margin
    caloriesInputElement.style.borderRadius = '5px';
  }
}

// Function to calculate total calories based on inputs
function calculateCalories(e) {
  e.preventDefault();  // Prevent default form submission behavior
  isError = false;  // Reset error flag

  // Get all number inputs for each section (breakfast, lunch, dinner, etc.)
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  // Get the total calories for each section
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // If there is an error in any input, stop further calculations
  if (isError) {
    return;
  }

  // Calculate total consumed calories and remaining calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  // Display the results in the output section
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  // Make the output visible
  output.classList.remove('hide');
}

// Function to extract the total calories from a list of input elements
function getCaloriesFromInputs(list) {
  let calories = 0;

  // Loop through each input in the list and calculate the total calories
  for (const item of list) {
    const currVal = cleanInputString(item.value);  // Clean the input value
    const invalidInputMatch = isInvalidInput(currVal);  // Check if the value is invalid

    // If an invalid input is found, display an error and stop calculation
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);  // Add valid calories to the total
  }
  return calories;
}

// Function to clear all inputs and reset the form
function clearForm() {
  // Get all input containers and clear their content
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  // Clear the budget input and output section
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');  // Hide the output until calculations are done
}

// Event listeners for the buttons
addEntryButton.addEventListener("click", addEntry);  // Listen for "Add Entry" button click
calorieCounter.addEventListener("submit", calculateCalories);  // Listen for form submit to calculate calories
clearButton.addEventListener("click", clearForm);  // Listen for "Clear" button click to reset the form
