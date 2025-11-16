// System E - CSV Data Plotter
// Global variables to store data
let xData = [];
let yData = [];
let spreadsheetInstance = null;

// Initialize event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('csvFileInput').addEventListener('change', handleFileUpload);
});

// Handle CSV file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseCSV(content);
    };
    reader.readAsText(file);
}

// Load data from textarea
function loadFromTextArea() {
    const content = document.getElementById('csvTextArea').value.trim();
    if (!content) {
        alert('Please paste CSV data first!');
        return;
    }
    parseCSV(content);
}

// Parse CSV content
function parseCSV(content) {
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
        alert('CSV must have at least a header row and one data row!');
        return;
    }
    
    // Parse header
    const header = lines[0].split(',').map(h => h.trim());
    const xIndex = header.findIndex(h => h.toUpperCase() === 'X');
    const yIndex = header.findIndex(h => h.toUpperCase() === 'Y');
    
    if (xIndex === -1 || yIndex === -1) {
        alert('CSV must contain X and Y columns!');
        return;
    }
    
    // Clear previous data
    xData = [];
    yData = [];
    
    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length > Math.max(xIndex, yIndex)) {
            const x = parseFloat(values[xIndex]);
            const y = parseFloat(values[yIndex]);
            
            if (!isNaN(x) && !isNaN(y)) {
                xData.push(x);
                yData.push(y);
            }
        }
    }
    
    if (xData.length === 0) {
        alert('No valid data points found!');
        return;
    }
    
    // Update UI
    document.getElementById('dataInfo').textContent = `Data loaded: ${xData.length} points`;
    document.getElementById('plotButton').disabled = false;
    document.getElementById('cadqueryBtn').disabled = false;
    document.getElementById('openscadBtn').disabled = false;
    
    // Auto-plot
    updatePlot();
}

// Update plot with current data and selected plot type
function updatePlot() {
    if (xData.length === 0) {
        alert('No data to plot!');
        return;
    }
    
    const plotType = document.getElementById('plotType').value;
    
    const trace = {
        x: xData,
        y: yData,
        mode: plotType === 'scatter' ? 'markers' : plotType,
        type: 'scatter',
        marker: {
            size: 8,
            color: '#007bff'
        },
        line: {
            color: '#007bff',
            width: 2
        }
    };
    
    const layout = {
        title: 'CSV Data Plot',
        xaxis: {
            title: 'X',
            showgrid: true,
            zeroline: true
        },
        yaxis: {
            title: 'Y',
            showgrid: true,
            zeroline: true,
            scaleanchor: 'x',
            scaleratio: 1
        },
        hovermode: 'closest',
        showlegend: false,
        margin: { l: 60, r: 40, t: 60, b: 60 }
    };
    
    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };
    
    Plotly.newPlot('plotDiv', [trace], layout, config);
}

// Clear all data
function clearData() {
    xData = [];
    yData = [];
    document.getElementById('csvFileInput').value = '';
    document.getElementById('csvTextArea').value = '';
    document.getElementById('formattedOutput').value = '';
    document.getElementById('dataInfo').textContent = 'No data loaded';
    document.getElementById('plotButton').disabled = true;
    document.getElementById('cadqueryBtn').disabled = true;
    document.getElementById('openscadBtn').disabled = true;
    document.getElementById('exportBtn').disabled = true;
    document.getElementById('copyBtn').disabled = true;
    Plotly.purge('plotDiv');
}

// Format data for CadQuery
function formatForCADQuery() {
    if (xData.length === 0) {
        alert('No data to format!');
        return;
    }
    
    // CadQuery format: list of tuples [(x1, y1), (x2, y2), ...]
    const points = xData.map((x, i) => `(${x}, ${yData[i]})`).join(', ');
    const formatted = `points = [${points}]`;
    
    document.getElementById('formattedOutput').value = formatted;
    document.getElementById('exportBtn').disabled = false;
    document.getElementById('copyBtn').disabled = false;
}

// Format data for OpenSCAD
function formatForOpenSCAD() {
    if (xData.length === 0) {
        alert('No data to format!');
        return;
    }
    
    // OpenSCAD format: vector of vectors [[x1, y1], [x2, y2], ...]
    const points = xData.map((x, i) => `[${x}, ${yData[i]}]`).join(', ');
    const formatted = `points = [${points}];`;
    
    document.getElementById('formattedOutput').value = formatted;
    document.getElementById('exportBtn').disabled = false;
    document.getElementById('copyBtn').disabled = false;
}

// Copy formatted data to clipboard
function copyFormatted() {
    const content = document.getElementById('formattedOutput').value;
    if (!content) {
        alert('No formatted data to copy!');
        return;
    }
    
    navigator.clipboard.writeText(content).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard');
    });
}

// Export formatted data as TXT file
function exportFormatted() {
    const content = document.getElementById('formattedOutput').value;
    if (!content) {
        alert('No formatted data to export!');
        return;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted_data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Spreadsheet functions
function openSpreadsheet() {
    const modal = document.getElementById('spreadsheetModal');
    modal.style.display = 'block';
    
    // Initialize spreadsheet if not already created
    if (!spreadsheetInstance) {
        // Create columns A-Z
        const columns = [];
        for (let i = 0; i < 26; i++) {
            columns.push({
                type: 'text',
                title: String.fromCharCode(65 + i), // A-Z
                width: 100
            });
        }
        
        spreadsheetInstance = jspreadsheet(document.getElementById('spreadsheet'), {
            data: Array(3000).fill(null).map(() => Array(26).fill('')),
            columns: columns,
            minDimensions: [26, 3000],
            allowInsertRow: true,
            allowInsertColumn: true,
            allowDeleteRow: true,
            allowDeleteColumn: true,
            allowRenameColumn: true,
            allowComments: false,
            columnSorting: true,
            columnDrag: true,
            tableOverflow: true,
            tableWidth: '100%',
            tableHeight: '500px',
            onselection: highlightFormulas,
            editable: true,
            search: false,
            filters: true,
            autoCasting: true,
            parseFormulas: true
        });
    }
}

function highlightFormulas(instance, x1, y1, x2, y2) {
    // This helps identify formula cells when selected
    return true;
}

function searchSpreadsheet(query) {
    if (!spreadsheetInstance) return;
    spreadsheetInstance.search(query);
}

function clearSearch() {
    const searchInput = document.getElementById('spreadsheetSearch');
    searchInput.value = '';
    if (spreadsheetInstance) {
        spreadsheetInstance.search('');
        spreadsheetInstance.resetSelection();
        // Force refresh the spreadsheet view
        const container = document.querySelector('.jexcel_content');
        if (container) {
            container.scrollTop = 0;
            container.scrollLeft = 0;
        }
    }
}

function closeSpreadsheet() {
    document.getElementById('spreadsheetModal').style.display = 'none';
}

function exportSpreadsheetCSV() {
    if (!spreadsheetInstance) {
        alert('No spreadsheet data to export!');
        return;
    }
    
    // Get data without headers
    const data = spreadsheetInstance.getData();
    const csv = data.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importSpreadsheetCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.trim().split('\n');
        const data = lines.map(line => {
            // Simple CSV parsing - split by comma
            const values = line.split(',').map(v => v.trim());
            // Pad to 26 columns if needed
            while (values.length < 26) {
                values.push('');
            }
            return values.slice(0, 26); // Take only first 26 columns
        });
        
        // Pad to 3000 rows if needed
        while (data.length < 3000) {
            data.push(Array(26).fill(''));
        }
        
        if (spreadsheetInstance) {
            spreadsheetInstance.setData(data.slice(0, 3000));
            alert(`CSV imported successfully! Loaded ${Math.min(lines.length, 3000)} rows.`);
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function clearSpreadsheet() {
    if (spreadsheetInstance && confirm('Clear all spreadsheet data?')) {
        spreadsheetInstance.setData(Array(3000).fill(null).map(() => Array(26).fill('')));
    }
}

function showFormulaReference() {
    const content = `
        <div class="formula-reference">
            <h4>Mathematical Functions</h4>
            <code>=SUM(A1:A10)</code> - Sum of values in range<br>
            <code>=SUM(A1:A3000)</code> - Sum of column A (use max row instead of A:A)<br>
            <code>=AVERAGE(A1:A10)</code> - Average of values<br>
            <code>=MIN(A1:A10)</code> - Minimum value<br>
            <code>=MAX(A1:A10)</code> - Maximum value<br>
            <code>=ROUND(A1, 2)</code> - Round to 2 decimal places<br>
            <code>=ABS(A1)</code> - Absolute value<br>
            <code>=SQRT(A1)</code> - Square root<br>
            <code>=POWER(A1, 2)</code> - Power (A1 squared)<br>
            
            <h4>Counting Functions</h4>
            <code>=COUNT(A1:A10)</code> - Count numbers in range<br>
            <code>=COUNT(A1:A3000)</code> - Count numbers in column A (use max row)<br>
            <code>=COUNTA(A1:A10)</code> - Count non-empty cells<br>
            <code>=COUNTIF(A1:A10, ">5")</code> - Count cells matching condition<br>
            <code>=COUNTIFS(A1:A10, ">5", B1:B10, "<10")</code> - Count with multiple conditions<br>
            
            <h4>Logical Functions</h4>
            <code>=IF(A1>10, "Yes", "No")</code> - If-then-else condition<br>
            <code>=IF(A1>10, SUM(B:B), 0)</code> - Nested formulas in IF<br>
            <code>=AND(A1>5, B1<10)</code> - Returns TRUE if all conditions are true<br>
            <code>=OR(A1>5, B1<10)</code> - Returns TRUE if any condition is true<br>
            <code>=NOT(A1>5)</code> - Returns opposite boolean<br>
            
            <h4>Text Functions</h4>
            <code>=CONCAT(A1, " ", B1)</code> - Concatenate text<br>
            <code>=CONCATENATE(A1, B1, C1)</code> - Join multiple values<br>
            <code>=UPPER(A1)</code> - Convert to uppercase<br>
            <code>=LOWER(A1)</code> - Convert to lowercase<br>
            <code>=LEN(A1)</code> - Length of text<br>
            <code>=TRIM(A1)</code> - Remove extra spaces<br>
            
            <h4>Lookup & Reference</h4>
            <code>=VLOOKUP(value, A1:C10, 2, FALSE)</code> - Vertical lookup<br>
            <code>=HLOOKUP(value, A1:J3, 2, FALSE)</code> - Horizontal lookup<br>
            <code>=INDEX(A1:A10, 5)</code> - Get value at position 5<br>
            <code>=MATCH("value", A1:A10, 0)</code> - Find position of value<br>
            
            <h4>Date & Time</h4>
            <code>=NOW()</code> - Current date and time<br>
            <code>=TODAY()</code> - Current date<br>
            <code>=YEAR(A1)</code> - Extract year from date<br>
            <code>=MONTH(A1)</code> - Extract month from date<br>
            <code>=DAY(A1)</code> - Extract day from date<br>
            
            <h4>Statistical Functions</h4>
            <code>=MEDIAN(A1:A10)</code> - Median value<br>
            <code>=MODE(A1:A10)</code> - Most frequent value<br>
            <code>=STDEV(A1:A10)</code> - Standard deviation<br>
            <code>=VAR(A1:A10)</code> - Variance<br>
            
            <h4>Usage Tips</h4>
            • Use <code>A1:A3000</code> for entire column (A:A not supported in this version)<br>
            • Use <code>1:3000</code> for entire row range<br>
            • Use <code>A1:C10</code> for rectangular range<br>
            • Combine formulas: <code>=SUM(A1:A3000) + MAX(B1:B3000)</code><br>
            • Drag corner handle to copy formulas<br>
        </div>
    `;
    
    // Create a temporary modal for formulas
    const existingModal = document.getElementById('formulaModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'formulaModal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3 style="margin: 0;">Formula Reference Guide</h3>
                <span class="close" onclick="closeFormulaReference()">&times;</span>
            </div>
            ${content}
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="closeFormulaReference()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeFormulaReference();
        }
    };
}

function closeFormulaReference() {
    const modal = document.getElementById('formulaModal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('spreadsheetModal');
    if (event.target === modal) {
        closeSpreadsheet();
    }
}