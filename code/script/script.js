// Initialize the chart
let periodChart = null;

function initChart() {
    const ctx = document.getElementById('periodChart').getContext('2d');
    periodChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Days Remaining', 'Period Days', 'Other Days'], // Labels for the sections
            datasets: [{
                label: 'Cycle Progress',
                data: [0, 0, 0], // Data for the sections
                backgroundColor: ['#ffcc00', '#ff6347', '#4caf50'], // Colors for each section
                borderColor: ['#ffcc00', '#ff6347', '#4caf50'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = tooltipItem.label;
                            const value = tooltipItem.raw;
                            return `${label}: ${value} days`;
                        }
                    }
                }
            }
        }
    });
}

// Function to update the pie chart
function updateChart(daysRemaining, periodDays) {
    const totalDays = daysRemaining + periodDays; // Total cycle length
    const otherDays = totalDays - periodDays; // Remaining days
    const updatedData = [daysRemaining, periodDays, otherDays];
    
    // Update chart data and re-render
    periodChart.data.datasets[0].data = updatedData;
    periodChart.update();
}

function calculateNextPeriod() {
    let lastPeriod = document.getElementById("lastPeriod").value;
    let cycleLength = parseInt(document.getElementById("cycleLength").value);
    let periodDays = parseInt(document.getElementById("periodDays").value); // Get period days from the input field

    if (lastPeriod && cycleLength && periodDays) {
        let lastDate = new Date(lastPeriod);
        let nextPeriod = new Date(lastDate.setDate(lastDate.getDate() + cycleLength));
        document.getElementById("prediction").innerText = 
            "Your next period is expected around: " + nextPeriod.toDateString();

        // Save to LocalStorage
        localStorage.setItem("lastPeriod", lastPeriod);
        localStorage.setItem("cycleLength", cycleLength);
        localStorage.setItem("periodDays", periodDays); // Save periodDays to localStorage

        // Update the chart
        const currentDate = new Date();
        const daysRemaining = Math.floor((nextPeriod - currentDate) / (1000 * 60 * 60 * 24));

        updateChart(daysRemaining, periodDays); // Pass the dynamic periodDays value

        // Update the period tracker graph
        updateTrackerGraph(cycleLength, periodDays);
    } else {
        alert("Please enter all values!");
    }
}

function logSymptom() {
    let symptom = document.getElementById("symptom").value;
    if (symptom) {
        let symptomList = document.getElementById("symptomList");
        let listItem = document.createElement("li");
        listItem.textContent = symptom;

        // Create a remove button
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function () {
            removeSymptom(symptom);
            symptomList.removeChild(listItem); // Remove the symptom from the list visually
        };

        listItem.appendChild(removeButton);
        symptomList.appendChild(listItem);

        // Save symptoms to LocalStorage
        let symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
        symptoms.push(symptom);
        localStorage.setItem("symptoms", JSON.stringify(symptoms));

        document.getElementById("symptom").value = "";
    }
}

function removeSymptom(symptom) {
    let symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
    const index = symptoms.indexOf(symptom);
    if (index !== -1) {
        symptoms.splice(index, 1); // Remove the symptom from the array
        localStorage.setItem("symptoms", JSON.stringify(symptoms)); // Save the updated list
    }
}

// Load stored data
window.onload = function () {
    if (localStorage.getItem("lastPeriod")) {
        document.getElementById("lastPeriod").value = localStorage.getItem("lastPeriod");
    }
    if (localStorage.getItem("cycleLength")) {
        document.getElementById("cycleLength").value = localStorage.getItem("cycleLength");
    }
    if (localStorage.getItem("periodDays")) {
        document.getElementById("periodDays").value = localStorage.getItem("periodDays"); // Load periodDays from localStorage
    }

    let storedSymptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
    let symptomList = document.getElementById("symptomList");
    storedSymptoms.forEach(symptom => {
        let listItem = document.createElement("li");
        listItem.textContent = symptom;

        // Create a remove button
        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = function () {
            removeSymptom(symptom);
            symptomList.removeChild(listItem); // Remove the symptom from the list visually
        };

        listItem.appendChild(removeButton);
        symptomList.appendChild(listItem);
    });

    // Initialize the chart
    initChart();
};
