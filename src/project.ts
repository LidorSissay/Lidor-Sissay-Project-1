const LOCAL_STORAGE_EX = 'expenses'

//TypeScript Methods
interface Expense {
    category: string,
    description: string,
    amount: number,
    date: string,
    id: number
}

declare var jspdf: any
declare var Chart: any

//general functions
function getEx(): Expense[] {
    const data = localStorage.getItem(LOCAL_STORAGE_EX)
    return data ? JSON.parse(data) : []
}

function saveEx(data: Expense[]) {
    localStorage.setItem(LOCAL_STORAGE_EX, JSON.stringify(data))
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
        (document.getElementById('navigate') as HTMLElement).innerHTML = navbar
}
//--------------------------------------------------------------------------

//Home page functions
function deleteEx(deEx: string | number) {
    const expenses: Expense[] = getEx()
    let index = 0
    if (confirm('Are you sure ?')) {
        for (const ex of expenses) {
            if (ex.id === +deEx) {
                expenses.splice(index, 1)
                saveEx(expenses)
                displayEx()
                return
            }
            index++
        }
    }
}

function updateEx(upEx: string | number) {
    const expenses = getEx()
    for (const expense of expenses) {
        if (expense.id === +upEx) {
            (document.getElementById('category') as HTMLSelectElement).value = expense.category;
                (document.getElementById('description') as HTMLTextAreaElement).value = expense.description;
                    (document.getElementById('amount') as HTMLInputElement).value = expense.amount.toString();
                        (document.getElementById('date') as HTMLInputElement).value = expense.date;
                            (document.getElementById('update') as HTMLInputElement).value = expense.id.toString();
        }
    }
}

function displayEx() {
    let htmlString = ``
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
        `
    }
    (document.getElementById('newRow') as HTMLElement).innerHTML = htmlString;
}

function addEx(event: Event) {

    event.preventDefault()

    const categoryInput = document.getElementById('category') as HTMLSelectElement
    const category = categoryInput.value
    const descriptionInput = document.getElementById('description') as HTMLTextAreaElement
    const description = descriptionInput.value
    const amountInput = document.getElementById('amount') as HTMLInputElement
    const amount = amountInput.value
    const dateInput = document.getElementById('date') as HTMLInputElement
    const date = dateInput.value
    const updateInput = document.getElementById('update') as HTMLInputElement
    const update = updateInput.value

    if (category === 'other' && description.trim() === '') {
        alert(`You must describe expenses in category 'Other'`)
        return
    }

    const today: string = (new Date()).toLocaleDateString('en-CA')
    if (date > today) {
        alert(`Do not enter a future date`)
        return
    }

    const expenses = getEx()

    if (update) {
        for (const expense of expenses) {
            if (expense.id === +update) {
                expense.category = category
                expense.description = description
                expense.amount = +amount
                expense.date = date
                break
            }
        }
    } else {
        expenses.push({
            category,
            description,
            amount: +amount,
            date,
            id: Date.now()
        })
    }

    if (updateInput) {
        updateInput.value = ''
    }
    (document.getElementById('form') as HTMLFormElement)?.reset()
    saveEx(expenses)
    displayEx()
}
//--------------------------------------------------------------------------

//Filters page functions
function displaySelectYear() {
    let years: string[] = []
    for (const expense of getEx() as Expense[]) {
        const year = expense.date.substring(0, 4)
        if (!years.includes(year)) {
            years.push(year)
        }
    }
    let htmlString = '<option value="" disabled selected>Year</option>'
    for (const year of years) {
        htmlString += `
        <option value="${year}">${year}</option>
        `
    }
    (document.getElementById('selectYear') as HTMLSelectElement).innerHTML = htmlString
}

function displaySelectMonth() {
    const selectedYear = (document.getElementById('selectYear') as HTMLSelectElement).value
    let months: string[] = []
    for (const expense of getEx() as Expense[]) {
        const year = expense.date.substring(0, 4)
        const month = expense.date.substring(5, 7)
        if (!months.includes(month) && year === selectedYear) {
            months.push(month)
        }
    }
    let htmlString = '<option value="" disabled selected>Month</option>'
    for (const month of months) {
        htmlString += `
        <option value="${month}">${month}</option>
        `
    }
    (document.getElementById('selectMonth') as HTMLSelectElement).innerHTML = htmlString
}

function displaySelectDay() {
    const selectedYear = (document.getElementById('selectYear') as HTMLSelectElement).value
    const selectedMonth = (document.getElementById('selectMonth') as HTMLSelectElement).value
    let days: string[] = []
    for (const expense of getEx() as Expense[]) {
        const year = expense.date.substring(0, 4)
        const month = expense.date.substring(5, 7)
        const day = expense.date.substring(8, 10)
        if (!days.includes(day) && year === selectedYear && month === selectedMonth) {
            days.push(day)
        }
    }
    let htmlString = '<option value="" disabled selected>Day</option>'
    for (const day of days) {
        htmlString += `
        <option value="${day}">${day}</option>
        `
    }
    (document.getElementById('selectDay') as HTMLSelectElement).innerHTML = htmlString
}

function addFilteredEx() {
    const year = (document.getElementById('selectYear') as HTMLSelectElement).value
    const month = (document.getElementById('selectMonth') as HTMLSelectElement).value
    const day = (document.getElementById('selectDay') as HTMLSelectElement).value

    const maxAmount: number = +(document.getElementById('maxAmount') as HTMLInputElement).value || Infinity;

    let yearForDisaply = year
    if (month) {
        yearForDisaply += '-' + month
    }
    if (day) {
        yearForDisaply += '-' + day
    }

    let filteredEx: Expense[] = []
    for (const expense of getEx() as Expense[]) {
        if (expense.date.startsWith(yearForDisaply) && expense.amount <= maxAmount) {
            filteredEx.push(expense)
        }
    }

    let htmlString = ``
    for (const expense of filteredEx) {
        htmlString += `
        <tr class="hover:bg-indigo-50 transition-colors border-b border-gray-100">
            <td class="p-4 text-gray-700 capitalize font-medium">${expense.category}</td>
            <td class="p-4 text-gray-600">${expense.description || '-'}</td>
            <td class="p-4 font-bold text-indigo-700">${Number(expense.amount).toLocaleString()} ₪</td>
            <td class="p-4 text-gray-500 font-mono text-sm">${expense.date}</td>
        </tr>
        `
    }
    (document.getElementById('newFilteredEx') as HTMLElement).innerHTML = htmlString
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

function renderPieChart(expenses: Expense[]) {
    const categories: Record<string, number> = {};
    expenses.forEach(ex => {
        categories[ex.category] = (categories[ex.category] || 0) + Number(ex.amount);
    });

    new Chart(document.getElementById('pieChart') as HTMLCanvasElement, {
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

function renderBarChart(expenses: Expense[]) {
    const monthlyData: Record<string, number> = {};
    expenses.forEach(ex => {
        const month = ex.date.substring(0, 7);
        monthlyData[month] = (monthlyData[month] || 0) + Number(ex.amount);
    });

    const sortedMonths = Object.keys(monthlyData).sort();

    new Chart(document.getElementById('barChart') as HTMLCanvasElement, {
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


displayNav()
if (document.getElementById('newRow')) {
    displayEx()
}
if (document.getElementById('selectYear')) {
    displaySelectYear()
    addFilteredEx()
}
if (document.getElementById('selectMonth')) {
    displaySelectMonth()
}
if (document.getElementById('selectDay')) {
    displaySelectDay()
}

(window as any).addEx = addEx;
(window as any).deleteEx = deleteEx;
(window as any).updateEx = updateEx;
(window as any).displaySelectMonth = displaySelectMonth;
(window as any).displaySelectDay = displaySelectDay;
(window as any).addFilteredEx = addFilteredEx;
(window as any).exportToPDF = exportToPDF;
(window as any).exportToCSV = exportToCSV;







