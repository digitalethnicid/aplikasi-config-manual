// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);
document.getElementById('sheetSelect').addEventListener('change', handleSheetChange, false);
document.getElementById('convertButton').addEventListener('click', convertToJson, false);
document.getElementById('downloadButton').addEventListener('click', downloadJson, false);
document.getElementById('searchInput').addEventListener('input', filterResults, false);

let workbook;
let jsonData = [];
let selectedColumns = [];

// Load data from localStorage when the page loads
window.addEventListener('load', () => {
    const storedData = localStorage.getItem('convertedData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        displayJson(parsedData);
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('downloadButton').style.display = 'inline-block';
    }
});

function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        workbook = XLSX.read(data, { type: 'array' });

        populateSheetSelect();

        // Notify user that file has been uploaded successfully
        alert('File uploaded successfully! Please select a sheet and columns.');
    };
    reader.readAsArrayBuffer(file);
}

function populateSheetSelect() {
    const sheetSelect = document.getElementById('sheetSelect');
    sheetSelect.innerHTML = '<option value="">Select Sheet</option>'; // Clear previous options

    workbook.SheetNames.forEach(sheetName => {
        const option = document.createElement('option');
        option.value = sheetName;
        option.textContent = sheetName;
        sheetSelect.appendChild(option);
    });
}

function handleSheetChange() {
    const sheetName = document.getElementById('sheetSelect').value;
    if (!sheetName) return;

    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Remove headers and use the first row as headers
    const headers = json.shift();
    jsonData = json
        .map(row => {
            let obj = {};
            row.forEach((cell, i) => obj[headers[i]] = cell);
            return obj;
        })
        .filter(row => Object.values(row).some(value => value !== null && value !== undefined && value !== ''));

    populateColumnSelect(headers);
}

function populateColumnSelect(headers) {
    const columnSelect = document.getElementById('columnSelect');
    columnSelect.innerHTML = ''; // Clear previous options

    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        columnSelect.appendChild(option);
    });
}

function convertToJson() {
    const columnSelect = document.getElementById('columnSelect');
    selectedColumns = Array.from(columnSelect.selectedOptions).map(option => option.value);

    if (selectedColumns.length > 5) {
        alert('Please select no more than 5 columns.');
        return;
    }

    const filteredData = jsonData.map(row => {
        let obj = {};
        selectedColumns.forEach(col => {
            obj[col] = row[col];
        });
        return obj;
    });

    // Save result to localStorage
    localStorage.setItem('convertedData', JSON.stringify(filteredData));

    displayJson(filteredData);
    document.getElementById('searchSection').style.display = 'block'; // Show search section
    document.getElementById('clearData').style.display = 'inline-block';
    document.getElementById('downloadButton').style.display = 'inline-block';
}


// Load data from localStorage when the page loads
window.addEventListener('load', () => {
    const storedData = localStorage.getItem('convertedData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        displayJson(parsedData);
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('clearData').style.display = 'inline-block';
        document.getElementById('downloadButton').style.display = 'inline-block';
    }
});

function displayJson(data) {
    const result = document.getElementById('result');
    result.textContent = JSON.stringify(data, null, 2);
    // filterResults(); // Apply search filter to the newly displayed results
}

function downloadJson() {
    const convertedData = localStorage.getItem('convertedData');
    if (!convertedData) {
        alert('No data available to download.');
        return;
    }

    const blob = new Blob([convertedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hasil.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function filterResults() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().replace(/\s+/g, ''); // Remove all whitespace
    const storedData = localStorage.getItem('convertedData');
    
    if (!storedData) {
        document.getElementById('result').textContent = 'No data available.';
        return;
    }

    const jsonData = JSON.parse(storedData);

    const filteredData = jsonData.filter(item => 
        Object.values(item).some(value => {
            if (typeof value === 'string') {
                // Remove whitespace and convert to lowercase for comparison
                const cleanValue = value.toLowerCase().replace(/\s+/g, '');
                return cleanValue.includes(searchTerm);
            }
            return false;
        })
    );

// Limit the number of items to display to 2
const limitedData = filteredData.slice(0, 2);

document.getElementById('customer-detail').textContent = JSON.stringify(limitedData, null, 2);
}

function clearLocalStorage() {
    localStorage.removeItem('convertedData');
    document.getElementById('result').textContent = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('downloadButton').style.display = 'none';
    document.getElementById('clearData').style.display = 'none';
}