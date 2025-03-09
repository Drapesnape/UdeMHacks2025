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
            default:
                featureContent.innerHTML = `<p>Feature content for ${feature} will be implemented here.</p>`;
        }
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

    // ... other setup functions ...
});