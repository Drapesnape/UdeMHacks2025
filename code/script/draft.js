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
                        <canvas id="bbt-chart" width="400" height="200"></canvas>
                    </div>
                `;
                setupGetPregnant();
                break;

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

            const estimatedOvulation = new Date(lastPeriodStart);
            estimatedOvulation.setDate(lastPeriodStart.getDate() + cycleLength - 14);

            const fertileWindowStart = new Date(estimatedOvulation);
            fertileWindowStart.setDate(estimatedOvulation.getDate() - 5);
            const fertileWindowEnd = new Date(estimatedOvulation);
            fertileWindowEnd.setDate(estimatedOvulation.getDate() + 1);

            resultsDiv.innerHTML = `
                <strong>Estimated Fertile Window:</strong><br>
                ${fertileWindowStart.toLocaleDateString()} to ${fertileWindowEnd.toLocaleDateString()}
            `;

            // 4. Basal Body Temperature Chart:
            const bbtChartCanvas = document.getElementById('bbt-chart');

            let bbtData = JSON.parse(localStorage.getItem('bbtData')) || [];

            bbtData.push({ date: lastPeriodStart.toLocaleDateString(), bbt });

            localStorage.setItem('bbtData', JSON.stringify(bbtData));

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
});