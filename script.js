var seniorPreserCount = 0;
var juniorPreserCount = 0;
var seniorAparatCount = 0;
var juniorAparatCount = 0;

var MAX_SENIOR_PRESER = 1;
var MAX_JUNIOR_PRESER = 2;
var MAX_SENIOR_APARAT = 3;
var MAX_JUNIOR_APARAT = 4;

function startDrag(event, workerId, workerName, category) {
    // Dodajte informacije o radniku u podatke o prenosu
    event.dataTransfer.setData('text', workerId);

    // Kreirajte element za prikazivanje tokom pomeranja
    var draggedElement = document.createElement('div');
    draggedElement.id = 'draggedElement';
    draggedElement.classList.add('dragged-worker');
    draggedElement.textContent = workerName;

    // Dodajte dodatne informacije kao podatke atributa
    draggedElement.dataset.workerId = workerId;
    draggedElement.dataset.workerName = workerName;
    draggedElement.dataset.workerCategory = category;

    // Dodajte element u telo dokumenta
    document.body.appendChild(draggedElement);

    // Postavite stilove za prikazivanje elementa tokom pomeranja
    draggedElement.style.position = 'absolute';
    draggedElement.style.left = event.clientX - draggedElement.clientWidth / 2 + 'px';
    draggedElement.style.top = event.clientY - draggedElement.clientHeight / 2 + 'px';

    // Dodajte događaj za praćenje kretanja miša
    document.addEventListener('mousemove', dragMove);

    // Dodajte događaj za završetak pomeranja
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(event) {
    var draggedElement = document.getElementById('draggedElement');
    if (draggedElement) {
        draggedElement.style.left = event.clientX - draggedElement.clientWidth / 2 + 'px';
        draggedElement.style.top = event.clientY - draggedElement.clientHeight / 2 + 'px';
    }
}

function dragEnd() {
    var draggedElement = document.getElementById('draggedElement');
    if (draggedElement) {
        // Uklonite element za prikazivanje nakon završetka pomeranja
        draggedElement.parentNode.removeChild(draggedElement);

        // Uklonite događaje praćenja kretanja miša i završetka pomeranja
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    var draggedElement = event.target;
    // Postavite podatke koji će se prenositi tokom operacije povlačenja i ispuštanja
    event.dataTransfer.setData("text/plain", "worker:" + draggedElement.id);
}

// Function to find the closest ancestor with the class 'line'
function findClosestLine(element) {
    while (element && !element.classList.contains('line')) {
        element = element.parentElement;
    }
    return element;
}

function drop(event) {
    event.preventDefault();
    console.log("Drop Event Triggered");

    // Get the dragged data from the event
    var draggedData = event.dataTransfer.getData('text/plain');
    console.log("Dragged Data:", draggedData);

    if (draggedData.startsWith("worker:")) {
    var workerId = draggedData.split(":")[1];
    console.log("Worker ID:", workerId);

    var draggedElement = document.getElementById(workerId);
    console.log("Element with ID", workerId, "not found.");

    // Ostatak vašeg koda...
  } else {
    console.error("Invalid dragged data format.");
  }

        // Dodajte provjeru je li draggedElement dostupan prije nego što pokušate pristupiti svojstvima
        if (draggedElement) {
          console.log("Dragged Element:", draggedElement);
          // Ostatak vašeg koda...
        } else {
          console.error("Element with ID " + workerId + " not found.");
        }

        // Get the target element where the drop event occurred
        var targetElement = event.currentTarget;
        console.log("Target Element:", targetElement);

        if (targetElement && targetElement.classList.contains('line')) {
            // Rest of your code...

            // Example: Add visual effect on the target element
            targetElement.style.backgroundColor = 'lightblue';
            setTimeout(() => {
                targetElement.style.backgroundColor = '';
            }, 1000);

            // Check category constraints on specific lines
            var category = draggedElement.classList[1]; // Assuming the category is the second class
            if (targetElement.classList.contains('line') && category) {
                switch (targetElement.getAttribute('line-id')) {
                    case 'line1':
                    case 'line4':
                    case 'line5':
                        checkAndMoveWorker(category, MAX_SENIOR_PRESER, MAX_JUNIOR_PRESER, targetElement);
                        break;
                    // Add similar checks for other lines
                }
            }

            // Check if draggedElement is a valid DOM element before adding
            if (draggedElement instanceof Element) {
                // Check the number of workers on the line before adding
                var lineWorkers = targetElement.querySelectorAll('.worker.' + category);
                var maxCategoryCount = getMaxCategoryCount(category);
                if (lineWorkers.length < maxCategoryCount) {
                    // If everything is fine, add draggedElement to the target element
                    targetElement.appendChild(draggedElement);
                    // Update counters for the added worker
                    updateCategoryCount(category, 'increment');
                } else {
                    console.log("Maximum number of workers in category " + category + " on the line reached.");
                }
            }
        } else {
            console.error('Target element is not valid.');
        }
    }

function checkAndMoveWorker(category) {
    var isSeniorPreser = category.toLowerCase() === 'senior-preser';
    var isJuniorPreser = category.toLowerCase() === 'junior-preser';
    var isSeniorAparat = category.toLowerCase() === 'senior-aparat';
    var isJuniorAparat = category.toLowerCase() === 'junior-aparat';

    if ((isSeniorPreser || isJuniorPreser) && (seniorPreserCount + juniorPreserCount < MAX_SENIOR_PRESER + MAX_JUNIOR_PRESER)) {
        updateCategoryCount(category, 'increment');
    } else if ((isSeniorAparat || isJuniorAparat) && (seniorAparatCount + juniorAparatCount < MAX_SENIOR_APARAT + MAX_JUNIOR_APARAT)) {
        updateCategoryCount(category, 'increment');
    } else {
        console.log("Nije moguće dodati radnika kategorije " + category + " na liniju.");
    }
}



function getMaxCategoryCount(category) {
    switch (category.toLowerCase()) {
        case 'senior-preser':
            return MAX_SENIOR_PRESER;
        case 'junior-preser':
            return MAX_JUNIOR_PRESER;
        case 'senior-aparat':
            return MAX_SENIOR_APARAT;
        case 'junior-aparat':
            return MAX_JUNIOR_APARAT;
        default:
            return 0;
    }
}

var categoryCounters = {
    'senior-preser': seniorPreserCount,
    'junior-preser': juniorPreserCount,
    'senior-aparat': seniorAparatCount,
    'junior-aparat': juniorAparatCount
};

function updateCategoryCount(category, action) {
    switch (category.toLowerCase()) {
        case 'senior-preser':
            seniorPreserCount = (action === 'decrement' && seniorPreserCount > 0) ? seniorPreserCount - 1 : seniorPreserCount + 1;
            break;
        case 'junior-preser':
            juniorPreserCount = (action === 'decrement' && juniorPreserCount > 0) ? juniorPreserCount - 1 : juniorPreserCount + 1;
            break;
        case 'senior-aparat':
            seniorAparatCount = (action === 'decrement' && seniorAparatCount > 0) ? seniorAparatCount - 1 : seniorAparatCount + 1;
            break;
        case 'junior-aparat':
            juniorAparatCount = (action === 'decrement' && juniorAparatCount > 0) ? juniorAparatCount - 1 : juniorAparatCount + 1;
            break;
    }
}

function generateUniqueID() {
    var generatedID;
    do {
        generatedID = Math.floor(Math.random() * 500) + 1;
    } while (document.getElementById("worker" + generatedID)); // Provjera jedinstvenosti ID broja
    return generatedID;
}

function addNewWorker() {
    var newWorkerName = document.getElementById("newWorkerInput").value;
    var selectedCategory = document.getElementById("categorySelection").value;

    if (newWorkerName.trim() !== "" && selectedCategory.trim() !== "") {
        var newWorkerElement = document.createElement("div");
        var workerColor;

        // Postavite boju temeljem kategorije radnika
        switch (selectedCategory.toLowerCase()) {
            case 'senior-preser':
                workerColor = 'lightblue';
                break;
            case 'junior-preser':
                workerColor = 'lightyellow';
                break;
            case 'senior-aparat':
                workerColor = 'orange';
                break;
            case 'junior-aparat':
                workerColor = 'lightgreen';
                break;
            // Dodajte slične case-ove za druge kategorije po potrebi
            default:
                workerColor = 'lightblue'; // Defaultna boja
        }

        newWorkerElement.className = "worker " + selectedCategory.toLowerCase();
        newWorkerElement.draggable = true;
        newWorkerElement.addEventListener("dragstart", drag);

        // Generiranje jedinstvenog ID broja
        var workerCount = generateUniqueID();
        newWorkerElement.id = "worker" + workerCount;

        newWorkerElement.innerHTML = `
            <div class="worker-name" style="background-color: ${workerColor};">${workerCount}. ${newWorkerName}</div>
            <div class="worker-category">${selectedCategory}</div>
            <div class="delete-button" onclick="deleteWorker(this)">X</div>
        `;

        // Dodajte novog radnika u #unassignedWorkers
        var targetElement = document.getElementById('unassignedWorkers');
        targetElement.appendChild(newWorkerElement);

        // Ažurirajte brojače za dodanog radnika
        updateCategoryCount(selectedCategory, 'increment');
    }
}

function deleteWorker(deleteButton) {
    var workerElement = deleteButton.closest('.worker');
    if (workerElement) {
        // Smanjite odgovarajući brojač pri brisanju radnika
        updateCategoryCount(workerElement.querySelector('.worker-category').textContent, 'decrement');
        workerElement.remove();
    }
}

var lineId = 'line1'; // Promijeni ovo prema stvarnom ID-u linije
var configurations = getLineConfigurations(lineId);
console.log('Line Configurations:', configurations);

var lineConfigurations = {};
function updateLineConfigurations(lineId) {
    switch (lineId) {
        case 'line1':
            lineConfigurations[lineId] = { 'senior-preser': 2, 'junior-preser': 3, 'senior-aparat': 3, 'junior-aparat': 4 };
            break;
        case 'line4':
            lineConfigurations[lineId] = { 'senior-aparat': 1, 'junior-aparat': 2 };
            break;
        case 'line5':
            lineConfigurations[lineId] = { 'senior-aparat': 1, 'junior-aparat': 2 };
            break;
        // Dodajte slične case-ove za druge linije
        default:
            lineConfigurations[lineId] = {};
            break;
    }
}

function getLineConfigurations(lineId) {
    var configurations = {
        'line1': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 },
        'line4': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 },
        'line5': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 },
        // Dodajte slične konfiguracije za druge linije
    };

    return configurations[lineId] || {};
}

function randomlyAssignWorkers() {
    console.log('Random Assignment Button Clicked');

    // Prikupite sve radnike iz neprioritetnih radnika
    var unassignedWorkers = Array.from(document.getElementById('unassignedWorkers').querySelectorAll('.worker'));
    console.log('Unassigned Workers:', unassignedWorkers);

    if (unassignedWorkers.length === 0) {
        console.log('No unassigned workers to assign.');
        return;
    }

    // Nasumično miješanje radnika
    unassignedWorkers.sort(() => Math.random() - 0.5);
    console.log('Shuffled Workers:', unassignedWorkers);

    // Iterirajte kroz linije i rasporedite radnike
    var lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        console.log(`Workers on line ${line.getAttribute('line-id')}:`, line.querySelectorAll('.worker'));
        var lineId = line.getAttribute('line-id');
        console.log('Processing line:', line);

        var configurations = getLineConfigurations(lineId);
        console.log('Line Configurations:', configurations);

        // Prikupite radnike samo za trenutnu liniju
        var workersForLine = unassignedWorkers.filter(worker => {
            var category = worker.classList[1]; // pretpostavljajući da je kategorija druga klasa
            return category && configurations[category] > 0;
        });

        // Miješanje radnika za trenutnu liniju
        workersForLine.sort(() => Math.random() - 0.5);

        // Ograničite broj radnika na najviše 10
        workersForLine = workersForLine.slice(0, 10);

        // Dodajte radnike na liniju, ograničavajući se na maksimalne vrijednosti
        workersForLine.forEach(worker => {
            var category = worker.classList[1];
            if (configurations[category] > 0) {
                if (line.childElementCount < 10) {
                    line.appendChild(worker);
                    configurations[category]--;
                }
            }
        });
    });

    // Ažurirajte brojače za raspoređene radnike
    updateCounters();
}

function updateCounters() {
    var element = document.getElementById('correctElementId');

    if (element) {
        // Update the counter
    } else {
        // Display a custom error message or take appropriate action
        console.error('Element not found!'); // Log the error to the console

        // You can display a message on the page or take other actions
        // For example, if you have an element to display errors, you can do something like:
        var errorDisplay = document.getElementById('errorDisplay');
        if (errorDisplay) {
            errorDisplay.textContent = 'An error occurred. Please try again.';
        }
    }
}


function randomizeWorkers() {
    // Dobivanje neraspoređenih radnika
    var unassignedWorkers = document.getElementById('unassignedWorkers');
    var workers = Array.from(unassignedWorkers.children);

    // Miješanje radnika
    var shuffledWorkers = shuffleArray(workers);

    // Ograničenja za linije
    var lineConstraints = {
        'line1': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 },
        'line4': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 },
        'line5': { 'senior-preser': 1, 'junior-preser': 2, 'senior-aparat': 3, 'junior-aparat': 4 }
        // Dodajte ovdje ograničenja za dodatne linije
    };

    // Raspoređivanje radnika na linije
    for (var lineId in lineConstraints) {
        if (lineConstraints.hasOwnProperty(lineId)) {
            var line = document.getElementById(lineId);
            var constraints = lineConstraints[lineId];

            for (var role in constraints) {
                if (constraints.hasOwnProperty(role)) {
                    var numWorkers = constraints[role];

                    for (var i = 0; i < numWorkers; i++) {
                        // Uzmite radnika iz miješanog niza i dodajte ga liniji
                        var worker = shuffledWorkers.pop();
                        line.appendChild(worker);
                    }
                }
            }
        }
    }
    // Added missing closing brace
}

// Funkcija za miješanje niza
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function returnAllWorkers() {
    console.log("Return All Workers Button Clicked");

    // Prikupite sve radnike s linija
    var lines = document.querySelectorAll('.line');
    var allWorkers = [];

    lines.forEach(line => {
        var workersOnLine = Array.from(line.querySelectorAll('.worker'));
        allWorkers = allWorkers.concat(workersOnLine);

        // Uklonite radnike sa linije
        workersOnLine.forEach(worker => {
            line.removeChild(worker);
        });
    });

    // Dodajte sve radnike u #unassignedWorkers
    var unassignedWorkers = document.getElementById('unassignedWorkers');
    allWorkers.forEach(worker => {
        unassignedWorkers.appendChild(worker);
    });

    // Ažurirajte brojače
    updateCounters();
}

document.addEventListener('DOMContentLoaded', function () {
    var excelImportButton = document.getElementById('excelImportButton');
    var fileInput = document.getElementById('fileInput');

    excelImportButton.addEventListener('click', function () {
        // Trigger a click on the file input
        fileInput.click();
    });

    fileInput.addEventListener('change', importWorkers);

    // Other event listeners and code...

    // Call the updateLineConfigurations function here or wherever appropriate
    // For example:
    updateLineConfigurations('line1');
    // You can update configurations for other lines as needed.
});



// Example using SheetJS library for XLSX format
function importWorkers() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var content = e.target.result;

            // Use SheetJS library to parse Excel data
            var workbook = XLSX.read(content, { type: 'binary' });
            var sheet = workbook.Sheets[workbook.SheetNames[0]];

            // Extract workers from the sheet
            var workers = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Check if the table has the expected structure
            if (workers.length > 0 && workers[0].length >= 3) {
                console.log('Workers:', workers);

                // Add workers to the unassigned workers list
                addWorkersToUnassigned(workers);

                // Update counters or perform any other necessary actions
                updateCounters();
            } else {
                alert('Invalid Excel table format. Please make sure the table has at least three columns.');
            }
        };

        // Read the file as binary data
        reader.readAsBinaryString(file);
    } else {
        alert("Please select a file before clicking the 'Import Workers' button.");
    }
}

function parseCSV(csvContent) {
    var lines = csvContent.split('\n');
    var workers = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        // Preskočite prazne linije
        if (line === '') continue;

        // Podijelite liniju na stupce
        var columns = line.split(',');

        // Dodajte radnika u listu
        workers.push(columns);
    }

    return workers;
}

function addWorkersToUnassigned(workers) {
    // Clear the existing workers in the unassigned list
    var unassignedWorkersList = document.getElementById('unassignedWorkers');
    unassignedWorkersList.innerHTML = '';

    // Iterate through the workers and add them to the unassigned list
    workers.slice(1).forEach((worker) => {
        var newWorkerElement = document.createElement("div");
        newWorkerElement.className = "worker";
        newWorkerElement.draggable = true;
        newWorkerElement.addEventListener("dragstart", drag);

        var serialNumber = worker[0];
        var name = worker[1];
        var category = worker[2];

        newWorkerElement.innerHTML = `
            <div class="worker-name">${serialNumber}. ${name}</div>
            <div class="worker-category">${category}</div>
            <div class="delete-button" onclick="deleteWorker(this)">X</div>
        `;

        unassignedWorkersList.appendChild(newWorkerElement);
    });
}

// Assume data is an array of objects representing workers from Excel
// Example: [{ ID: 1, Name: 'John', Category: 'Senior-Preser' }, ...]
function importWorkersFromExcel(data) {
    // Iterate through the data and create worker elements
    data.forEach(workerData => {
        // Create a new worker element
        const workerElement = createWorkerElement(workerData);

        // Append the worker element to the unassigned workers area
        document.getElementById('unassignedWorkers').appendChild(workerElement);
    });
}

// Function to create a worker element based on the worker data
function createWorkerElement(workerData) {
    const { ID, Name, Category } = workerData;

    // Create a new worker element
    const workerElement = document.createElement('div');
    workerElement.classList.add('worker');
    workerElement.classList.add(Category.toLowerCase()); // Add category class

    // Set worker data as attributes
    workerElement.setAttribute('data-id', ID);
    workerElement.setAttribute('data-name', Name);
    workerElement.setAttribute('data-category', Category);

    // Add draggable attribute
    workerElement.setAttribute('draggable', 'true');

    // Set the inner HTML or text content as desired (ID, Name)
    workerElement.innerHTML = `${ID}: ${Name}`;

    // Add event listeners for drag and drop if needed

    return workerElement;
}

// Call this function when importing workers from Excel
// Example: importWorkersFromExcel([{ ID: 1, Name: 'John', Category: 'Senior-Preser' }, ...]);
