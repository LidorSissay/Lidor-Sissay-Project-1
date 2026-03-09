const LOCAL_STORAGE_EX = 'expenses';
//general functions
function getEx() {
    const data = localStorage.getItem(LOCAL_STORAGE_EX);
    return data ? JSON.parse(data) : [];
}
function saveEx(data) {
    localStorage.setItem(LOCAL_STORAGE_EX, JSON.stringify(data));
}
//Navbar function
function displayNav() {
    const navbar = `
    <div class="flex flex-wrap justify-center gap-4 md:gap-8">
        <a href="projectHome.html" class="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">Home</a>
        <a href="projectFilter.html" class="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">Filters</a>
        <a href="projectData.html" class="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">Data</a>
        <a href="projectAbout.html" class="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200">About Us</a>
    </div>
    `;
    document.getElementById('navigate').innerHTML = navbar;
}
//--------------------------------------------------------------------------
//Home page functions
function deleteEx(deEx) {
    const expenses = getEx();
    let index = 0;
    if (confirm('Are you sure ?')) {
        for (const ex of expenses) {
            if (ex.id === +deEx) {
                expenses.splice(index, 1);
                saveEx(expenses);
                displayEx();
                return;
            }
            index++;
        }
    }
}
function updateEx(upEx) {
    const expenses = getEx();
    for (const expense of expenses) {
        if (expense.id === +upEx) {
            document.getElementById('category').value = expense.category;
            document.getElementById('description').value = expense.description;
            document.getElementById('amount').value = expense.amount.toString();
            document.getElementById('date').value = expense.date;
            document.getElementById('update').value = expense.id.toString();
        }
    }
}
function displayEx() {
    let htmlString = ``;
    for (const expense of getEx()) {
        htmlString += `
        <tr class="hover:bg-indigo-50 transition-colors border-b border-gray-100">
            <td class="p-4 text-gray-700 capitalize font-medium">${expense.category}</td>
            <td class="p-4 text-gray-600 italic">${expense.description || '-'}</td>
            <td class="p-4 font-bold text-indigo-700 text-lg">${Number(expense.amount).toLocaleString()} ₪</td>
            <td class="p-4 text-gray-500 font-mono text-sm">${expense.date}</td>
            <td class="p-4">
                <div class="flex flex-col sm:flex-row gap-2">
                    <button onclick="updateEx(${expense.id})" 
                        class="bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold py-2 px-4 rounded-lg shadow-sm transition-all">
                        Update
                    </button>
                    <button onclick="deleteEx(${expense.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white text-xs font-extrabold py-2 px-4 rounded-lg shadow-sm transition-all">
                        Delete
                    </button>
                </div>
            </td>
        </tr>
        `;
    }
    document.getElementById('newRow').innerHTML = htmlString;
}
function addEx(event) {
    event.preventDefault();
    const categoryInput = document.getElementById('category');
    const category = categoryInput.value;
    const descriptionInput = document.getElementById('description');
    const description = descriptionInput.value;
    const amountInput = document.getElementById('amount');
    const amount = amountInput.value;
    const dateInput = document.getElementById('date');
    const date = dateInput.value;
    const updateInput = document.getElementById('update');
    const update = updateInput.value;
    if (category === 'other' && description.trim() === '') {
        alert(`You must describe expenses in category 'Other'`);
        return;
    }
    const today = (new Date()).toLocaleDateString('en-CA');
    if (date > today) {
        alert(`Do not enter a future date`);
        return;
    }
    const expenses = getEx();
    if (update) {
        for (const expense of expenses) {
            if (expense.id === +update) {
                expense.category = category;
                expense.description = description;
                expense.amount = +amount;
                expense.date = date;
                break;
            }
        }
    }
    else {
        expenses.push({
            category,
            description,
            amount: +amount,
            date,
            id: Date.now()
        });
    }
    if (updateInput) {
        updateInput.value = '';
    }
    document.getElementById('form')?.reset();
    saveEx(expenses);
    displayEx();
}
//--------------------------------------------------------------------------
//Filters page functions
function displaySelectYear() {
    let years = [];
    for (const expense of getEx()) {
        const year = expense.date.substring(0, 4);
        if (!years.includes(year)) {
            years.push(year);
        }
    }
    let htmlString = '<option value="" disabled selected>Year</option>';
    for (const year of years) {
        htmlString += `
        <option value="${year}">${year}</option>
        `;
    }
    document.getElementById('selectYear').innerHTML = htmlString;
}
function displaySelectMonth() {
    const selectedYear = document.getElementById('selectYear').value;
    let months = [];
    for (const expense of getEx()) {
        const year = expense.date.substring(0, 4);
        const month = expense.date.substring(5, 7);
        if (!months.includes(month) && year === selectedYear) {
            months.push(month);
        }
    }
    let htmlString = '<option value="" disabled selected>Month</option>';
    for (const month of months) {
        htmlString += `
        <option value="${month}">${month}</option>
        `;
    }
    document.getElementById('selectMonth').innerHTML = htmlString;
}
function displaySelectDay() {
    const selectedYear = document.getElementById('selectYear').value;
    const selectedMonth = document.getElementById('selectMonth').value;
    let days = [];
    for (const expense of getEx()) {
        const year = expense.date.substring(0, 4);
        const month = expense.date.substring(5, 7);
        const day = expense.date.substring(8, 10);
        if (!days.includes(day) && year === selectedYear && month === selectedMonth) {
            days.push(day);
        }
    }
    let htmlString = '<option value="" disabled selected>Day</option>';
    for (const day of days) {
        htmlString += `
        <option value="${day}">${day}</option>
        `;
    }
    document.getElementById('selectDay').innerHTML = htmlString;
}
function addFilteredEx() {
    const year = document.getElementById('selectYear').value;
    const month = document.getElementById('selectMonth').value;
    const day = document.getElementById('selectDay').value;
    const maxAmount = +document.getElementById('maxAmount').value || Infinity;
    let yearForDisaply = year;
    if (month) {
        yearForDisaply += '-' + month;
    }
    if (day) {
        yearForDisaply += '-' + day;
    }
    let filteredEx = [];
    for (const expense of getEx()) {
        if (expense.date.startsWith(yearForDisaply) && expense.amount <= maxAmount) {
            filteredEx.push(expense);
        }
    }
    let htmlString = ``;
    for (const expense of filteredEx) {
        htmlString += `
        <tr class="hover:bg-indigo-50 transition-colors border-b border-gray-100">
            <td class="p-4 text-gray-700 capitalize font-medium">${expense.category}</td>
            <td class="p-4 text-gray-600">${expense.description || '-'}</td>
            <td class="p-4 font-bold text-indigo-700">${Number(expense.amount).toLocaleString()} ₪</td>
            <td class="p-4 text-gray-500 font-mono text-sm">${expense.date}</td>
        </tr>
        `;
    }
    document.getElementById('newFilteredEx').innerHTML = htmlString;
}
//--------------------------------------------------------------------------
//Data page functions (Prod by Gemini)
document.addEventListener('DOMContentLoaded', () => {
    const pieCanvas = document.getElementById('pieChart');
    const barCanvas = document.getElementById('barChart');
    if (pieCanvas && barCanvas) {
        const expenses = getEx();
        if (expenses.length > 0) {
            renderPieChart(expenses);
            renderBarChart(expenses);
        }
    }
});
function renderPieChart(expenses) {
    const categories = {};
    expenses.forEach(ex => {
        categories[ex.category] = (categories[ex.category] || 0) + Number(ex.amount);
    });
    new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#64748b']
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
function renderBarChart(expenses) {
    const monthlyData = {};
    expenses.forEach(ex => {
        const month = ex.date.substring(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + Number(ex.amount);
    });
    const sortedMonths = Object.keys(monthlyData).sort();
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: sortedMonths,
            datasets: [{
                    label: 'Total Amount',
                    data: sortedMonths.map(m => monthlyData[m]),
                    backgroundColor: '#6366f1'
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
function exportToCSV() {
    const expenses = getEx();
    let csv = "Category,Description,Amount,Date\n";
    expenses.forEach(ex => {
        csv += `${ex.category},${ex.description || ''},${ex.amount},${ex.date}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses_report.csv';
    a.click();
}
function exportToPDF() {
    if (typeof jspdf === 'undefined') {
        alert("PDF library is not loaded. Please check your internet connection.");
        return;
    }
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const expenses = getEx();
    const rows = expenses.map(ex => [ex.category, ex.description || '', ex.amount, ex.date]);
    doc.setFontSize(18);
    doc.text("Expenses Report", 14, 20);
    doc.autoTable({
        startY: 30,
        head: [['Category', 'Description', 'Amount', 'Date']],
        body: rows,
        headStyles: { fillColor: [79, 70, 229] }
    });
    doc.save('expenses_report.pdf');
}
displayNav();
if (document.getElementById('newRow')) {
    displayEx();
}
if (document.getElementById('selectYear')) {
    displaySelectYear();
    addFilteredEx();
}
if (document.getElementById('selectMonth')) {
    displaySelectMonth();
}
if (document.getElementById('selectDay')) {
    displaySelectDay();
}
window.addEx = addEx;
window.deleteEx = deleteEx;
window.updateEx = updateEx;
window.displaySelectMonth = displaySelectMonth;
window.displaySelectDay = displaySelectDay;
window.addFilteredEx = addFilteredEx;
window.exportToPDF = exportToPDF;
window.exportToCSV = exportToCSV;
export {};
