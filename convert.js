// script.js
document.getElementById('fileInput').addEventListener('change', handleFile, false);
document.getElementById('sheetSelect').addEventListener('change', handleSheetChange, false);
document.getElementById('convertButton').addEventListener('click', convertToJson, false);
document.getElementById('downloadButton').addEventListener('click', downloadJson, false);
document.getElementById('searchInput').addEventListener('input', filterResults, false);
document.getElementById('clearData').addEventListener('click', clearIndexedDB, false);

let workbook;
let jsonData = [];
let selectedColumns = [];
let db;

// Initialize IndexedDB
const request = indexedDB.open('myDatabase', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('convertedDataStore')) {
        db.createObjectStore('convertedDataStore', { keyPath: 'id' });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
};

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

// Handle file upload
function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        workbook = XLSX.read(data, { type: 'array' });

        populateSheetSelect();

        alert('File uploaded successfully! Please select a sheet and columns.');
    };
    reader.readAsArrayBuffer(file);
}

// Populate sheet select options
function populateSheetSelect() {
    const sheetSelect = document.getElementById('sheetSelect');
    sheetSelect.innerHTML = '<option value="">Select Sheet</option>';

    workbook.SheetNames.forEach(sheetName => {
        const option = document.createElement('option');
        option.value = sheetName;
        option.textContent = sheetName;
        sheetSelect.appendChild(option);
    });
}

// Handle sheet selection
function handleSheetChange() {
    const sheetName = document.getElementById('sheetSelect').value;
    if (!sheetName) return;

    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const headers = json.shift();
    jsonData = json.map(row => {
        let obj = {};
        row.forEach((cell, i) => obj[headers[i]] = cell);
        return obj;
    }).filter(row => {
        // Filter out rows that are completely empty or only have empty values
        return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
    });

    populateColumnSelect(headers);
}

// Populate column select options
function populateColumnSelect(headers) {
    const columnSelect = document.getElementById('columnSelect');
    columnSelect.innerHTML = '';

    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        columnSelect.appendChild(option);
    });
}

// Save data to IndexedDB
function saveToIndexedDB(data) {
    const transaction = db.transaction(['convertedDataStore'], 'readwrite');
    const store = transaction.objectStore('convertedDataStore');
    const request = store.put({ id: 'convertedData', data: data });

    request.onsuccess = function() {
        console.log('Data saved to IndexedDB.');
    };

    request.onerror = function(event) {
        console.error('Error saving data to IndexedDB:', event.target.errorCode);
    };
}

// Get data from IndexedDB
function getFromIndexedDB(callback) {
    const transaction = db.transaction(['convertedDataStore'], 'readonly');
    const store = transaction.objectStore('convertedDataStore');
    const request = store.get('convertedData');

    request.onsuccess = function(event) {
        const result = event.target.result;
        if (result) {
            callback(result.data);
        } else {
            console.error('No data found in IndexedDB.');
        }
    };

    request.onerror = function(event) {
        console.error('Error retrieving data from IndexedDB:', event.target.errorCode);
    };
}

// Convert data to JSON and save to IndexedDB
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
    }).filter(row => {
        // Filter out rows that are completely empty or only have empty values
        return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
    });

    // Save result to IndexedDB
    saveToIndexedDB(filteredData);

    displayJson(filteredData);
    document.getElementById('searchSection').style.display = 'block';
    document.getElementById('clearData').style.display = 'inline-block';
    document.getElementById('downloadButton').style.display = 'inline-block';
}

// Display JSON data
function displayJson(data) {
    const result = document.getElementById('result');
    result.textContent = JSON.stringify(data, null, 2);
}

// Download JSON data
function downloadJson() {
    getFromIndexedDB(data => {
        if (!data) {
            alert('No data available to download.');
            return;
        }

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hasil.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}

// Filter results
function filterResults() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().replace(/\s+/g, '');
    getFromIndexedDB(data => {
        if (!data) {
            document.getElementById('result').textContent = 'No data available.';
            return;
        }

        const filteredData = data.filter(item =>
            Object.values(item).some(value => {
                if (typeof value === 'string') {
                    const cleanValue = value.toLowerCase().replace(/\s+/g, '');
                    return cleanValue.includes(searchTerm);
                }
                return false;
            })
        );

        // Limit the number of items to display to 2
        const limitedData = filteredData.slice(0, 2);

        document.getElementById('customer-detail').textContent = JSON.stringify(limitedData, null, 2);
    });
}

// Clear data from IndexedDB
function clearIndexedDB() {
    const transaction = db.transaction(['convertedDataStore'], 'readwrite');
    const store = transaction.objectStore('convertedDataStore');
    const request = store.delete('convertedData');

    request.onsuccess = function() {
        console.log('Data cleared from IndexedDB.');
        document.getElementById('result').textContent = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('downloadButton').style.display = 'none';
        document.getElementById('clearData').style.display = 'none';
    };

    request.onerror = function(event) {
        console.error('Error clearing data from IndexedDB:', event.target.errorCode);
    };
}

// Load data from IndexedDB on page load
window.addEventListener('load', () => {
    getFromIndexedDB(data => {
        if (data) {
            displayJson(data);
            document.getElementById('searchSection').style.display = 'block';
            document.getElementById('downloadButton').style.display = 'inline-block';
        }
    });
});
