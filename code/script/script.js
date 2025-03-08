
// async function getAIResponse() {
//     const prompt = "say hello";  // Example prompt
//     const response = await fetch("http://localhost:3000/generate", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//     });

//     const data = await response.json();
//     console.log(data.content);  // This will log the AI-generated content
//     document.getElementById("prediction").innerText = data.content;
// }

// getAIResponse();

function calculateNextPeriod() {
    let lastPeriod = document.getElementById("lastPeriod").value;
    let cycleLength = parseInt(document.getElementById("cycleLength").value);

    if (lastPeriod && cycleLength) {
        let lastDate = new Date(lastPeriod);
        let nextPeriod = new Date(lastDate.setDate(lastDate.getDate() + cycleLength));
        document.getElementById("prediction").innerText = 
            "Your next period is expected around: " + nextPeriod.toDateString();

        // Save to LocalStorage
        localStorage.setItem("lastPeriod", lastPeriod);
        localStorage.setItem("cycleLength", cycleLength);
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
        symptomList.appendChild(listItem);

        // Save symptoms to LocalStorage
        let symptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
        symptoms.push(symptom);
        localStorage.setItem("symptoms", JSON.stringify(symptoms));

        document.getElementById("symptom").value = "";
    }
}

// Load stored data
window.onload = function() {
    if (localStorage.getItem("lastPeriod")) {
        document.getElementById("lastPeriod").value = localStorage.getItem("lastPeriod");
    }
    if (localStorage.getItem("cycleLength")) {
        document.getElementById("cycleLength").value = localStorage.getItem("cycleLength");
    }

    let storedSymptoms = JSON.parse(localStorage.getItem("symptoms")) || [];
    let symptomList = document.getElementById("symptomList");
    storedSymptoms.forEach(symptom => {
        let listItem = document.createElement("li");
        listItem.textContent = symptom;
        symptomList.appendChild(listItem);
    });
};
