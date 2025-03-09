document.addEventListener('DOMContentLoaded', () => {
    const featureSelection = document.getElementById('feature-selection');
    const featureContent = document.getElementById('feature-content');
    const featureButtons = document.querySelectorAll('.feature-btn');

    featureButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feature = button.getAttribute('data-feature');
            loadFeatureContent(feature);
        });
    });

    function loadFeatureContent(feature) {
        featureSelection.style.display = 'none';
        featureContent.style.display = 'block';

        switch (feature) {
            case 'period-track':
                featureContent.innerHTML = `
                    <h2>CycleSense - Calculateur de Cycle Menstruel et Ovulation</h2>
                    <div class="container">
                        <label for="debutR">Premier jour des dernières règles:</label>
                        <input type="date" id="debutR">
                        <br>
                        <label for="cycle">Durée moyenne du cycle (en jours):</label>
                        <input type="number" id="cycle" placeholder="Ex: 28">
                        <br>
                        <label for="menstruation">Durée des menstruations (en jours) :</label>
                        <input type="number" id="menstruation" placeholder="Ex: 5">
                        <br>
                        <button onclick="calculerCycle()">Calculer le cycle (en jours)</button>
                        <p id="resultat"></p>
                    </div>
                `;
                setupPeriodTracking();
                break;
            // ... other cases ...

            case 'get-pregnant':
            featureContent.innerHTML = `
                <h2>CycleSense - Get Pregnant</h2>
                <div id="fertility-tracker">
                    <label for="cycle-length">Cycle Length (days):</label>
                    <input type="number" id="cycle-length" placeholder="Ex: 28">
                    <br>
                    <label for="last-period-start">Last Period Start Date:</label>
                    <input type="date" id="last-period-start">
                    <br>
                    <label for="bbt">Basal Body Temperature (°F):</label>
                    <input type="number" id="bbt" step="0.1">
                    <br>
                    <button onclick="calculateFertileWindow()">Calculate Fertile Window</button>
                    <div id="fertility-results"></div>
                    <div id="bbt-chart"></div> </div>
            `;
            setupGetPregnant();
            break;
    // ... (other cases) ...
        default:
            featureContent.innerHTML = `<p>Feature content for ${feature} will be implemented here.</p>`;
    }
}

function setupGetPregnant() {
    window.calculateFertileWindow = function() {
        const cycleLength = parseInt(document.getElementById('cycle-length').value);
        const lastPeriodStart = new Date(document.getElementById('last-period-start').value);
        const bbt = parseFloat(document.getElementById('bbt').value);
        const resultsDiv = document.getElementById('fertility-results');

        if (isNaN(cycleLength) || !lastPeriodStart || isNaN(bbt)) {
            resultsDiv.textContent = "Please fill in all fields correctly.";
            return;
        }

        // 1. **Estimate Ovulation:**
        const estimatedOvulation = new Date(lastPeriodStart);
        estimatedOvulation.setDate(lastPeriodStart.getDate() + cycleLength - 14);

        // 2. **Calculate Fertile Window:**
        const fertileWindowStart = new Date(estimatedOvulation);
        fertileWindowStart.setDate(estimatedOvulation.getDate() - 5);
        const fertileWindowEnd = new Date(estimatedOvulation);
        fertileWindowEnd.setDate(estimatedOvulation.getDate() + 1); // Include day after ovulation

        // 3. **Display Results:**
        resultsDiv.innerHTML = `
            <strong>Estimated Fertile Window:</strong><br>
            ${fertileWindowStart.toLocaleDateString()} to ${fertileWindowEnd.toLocaleDateString()}
        `;
        
        window.calculateFertileWindow = function() {
            // ... (your existing code) ...
    
            // 4. Basal Body Temperature Chart:
            const bbtChartCanvas = document.getElementById('bbt-chart');
    
            // Get BBT data from local storage (or initialize if it doesn't exist)
            let bbtData = JSON.parse(localStorage.getItem('bbtData')) ||;
    
            // Add the new BBT data point with the current date
            bbtData.push({ date: lastPeriodStart.toLocaleDateString(), bbt });
    
            // Store the updated BBT data in local storage
            localStorage.setItem('bbtData', JSON.stringify(bbtData));
    
            // Create the chart
            new Chart(bbtChartCanvas, {
                type: 'line',
                data: {
                    labels: bbtData.map(data => data.date),
                    datasets: [{
                        label: 'BBT (°F)',
                        data: bbtData.map(data => data.bbt),
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'BBT (°F)'
                            }
                        }
                    }
                }
            });
        };
    }
        // 4. **Basal Body Temperature Chart (Implementation needed):**
        // Use a charting library (e.g., Chart.js) to create a chart
        // that displays the user's BBT data over time.
        // You'll need to store and retrieve BBT data (consider using local storage).
        // Example (using Chart.js):
        // const bbtChart = new Chart(document.getElementById('bbt-chart'), {
        //     type: 'line',
        //     data: {
        //         labels: /* Dates */,
        //         datasets: [{
        //             label: 'BBT (°F)',
        //             data: /* BBT values */
        //         }]
        //     }
        // });


    function setupPeriodTracking() {
        window.calculerCycle = function() {
            const debutRegles = new Date(document.getElementById('debutR').value);
            const dureeCycle = parseInt(document.getElementById('cycle').value);
            const dureeMenstruation = parseInt(document.getElementById('menstruation').value);
            const resultat = document.getElementById('resultat');

            if (!debutRegles || isNaN(dureeCycle) || isNaN(dureeMenstruation)) {
                resultat.textContent = "Merci de remplir tous les champs correctement.";
                return;
            }

            const finMenstruation = new Date(debutRegles);
            finMenstruation.setDate(debutRegles.getDate() + dureeMenstruation);

            const ovulation = new Date(debutRegles);
            ovulation.setDate(debutRegles.getDate() + dureeCycle - 14);

            const prochainCycle = new Date(debutRegles);
            prochainCycle.setDate(debutRegles.getDate() + dureeCycle);

            resultat.innerHTML = `
                <strong>Résultats :</strong><br>
                - Fin des menstruations : ${finMenstruation.toLocaleDateString()}<br>
                - Période d'ovulation : ${ovulation.toLocaleDateString()}<br>
                - Début du prochain cycle : ${prochainCycle.toLocaleDateString()}<br>
                <span class="info">(La période fertile est généralement de 4-5 jours autour de l'ovulation)</span>
            `;
        };
    }

    // ... other setup functions ...
});