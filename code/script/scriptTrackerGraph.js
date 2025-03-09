const canvas = document.getElementById('periodTracker');
const ctx = canvas.getContext('2d');
const radius = 150;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const today = new Date();
let cycleLength = parseInt(localStorage.getItem("cycleLength")) || 28; // Default cycle length
let periodLength = parseInt(localStorage.getItem("periodLength")) || 5; // Default period length
let startDate = new Date(localStorage.getItem("startDate")) || new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDate() % cycleLength));
let dayInCycle = parseInt(localStorage.getItem("dayInCycle")) || Math.floor(Math.abs(today - startDate) / (1000 * 60 * 60 * 24)) % cycleLength;
let ovulationDay = 14;
let circleisHovered = false;
let dotIsHovered = false;
let gradientValue = 0.2;
let animationFrameId;
let newDotDay = null;
let dayHovered = null;
const dotOffset = 30;
const dots = [];

if (isNaN(startDate.getTime())) {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDate() % cycleLength));
}

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF6B6B';
    ctx.fill();
    ctx.strokeStyle = '#FF6B6B';
    ctx.stroke();

    // Draw gradient on top
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(centerX, centerY, radius / 1.5, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(255, 107, 107, ${gradientValue})`);
    gradient.addColorStop(1, `rgba(255, 0, 0, ${gradientValue})`);
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawDots() {
    dots.length = 0; // Clear the dots array
    for (let i = 0; i < cycleLength; i++) {
        const angle = (i / cycleLength) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius + dotOffset) * Math.cos(angle);
        const y = centerY + (radius + dotOffset) * Math.sin(angle);
        dots.push({ x, y, radius: i === cycleLength - dayInCycle - 2? 16 : 8, day: i });
        ctx.beginPath();
        ctx.shadowColor = i === cycleLength - dayInCycle - 2? 'rgb(175, 44, 55)' : 'rgb(173, 138, 138)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = i === cycleLength - dayInCycle - 2? '#E63946' : '#F4C2C2';
        if (dayHovered && dayHovered.day === i) {
            ctx.arc(x, y, dayHovered.radius === 16 ? 20 : 14, 0, 2 * Math.PI);
        } else {
            ctx.arc(x, y, i === cycleLength - dayInCycle - 2? 16 : 8, 0, 2 * Math.PI);
        }
        if (i < periodLength) {
            ctx.fillStyle = '#B22222';
            ctx.shadowColor = 'rgb(139, 24, 24)';
        }
        if (i >= 11 && i <= 16) {
            ctx.fillStyle = '#E85D04';
            ctx.shadowColor = 'rgb(175, 67, 0)';
        }
        if (i === ovulationDay - 1) {
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = 'rgb(184, 156, 0)';
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadowBlur after drawing each dot  
    }
}

function drawText() {
    ctx.font = '24px Andale mono, monospace';
    ctx.fontWeight = 'bold';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`Day ${cycleLength - dayInCycle -1} of ${cycleLength}`, centerX, centerY - 10);
    ctx.fillText(today.toDateString(), centerX, centerY + 20);
}

function draw() {
    drawCircle();
    drawDots();
    drawText();
}

function isMouseOverCircle(mouseX, mouseY) {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    return Math.sqrt(dx * dx + dy * dy) < radius;
}

function isMouseOverDot(mouseX, mouseY) {
    return dots.some(dot => {
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        return Math.sqrt(dx * dx + dy * dy) < dot.radius;
    });
}

function getDotByDay(day) {
    return dots.find(dot => dot.day === day);
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    circleisHovered = isMouseOverCircle(mouseX, mouseY);
    if (circleisHovered && !animationFrameId) {
        animateGradient();
    }
    dotIsHovered = isMouseOverDot(mouseX, mouseY);
    if (dotIsHovered) {
        dayHovered = dots.find(dot => {
            const dx = mouseX - dot.x;
            const dy = mouseY - dot.y;
            return Math.sqrt(dx * dx + dy * dy) < dot.radius;
        });
        
        // Create floating window
        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.backgroundColor = 'rgba(255, 150, 173, 0.9)';
        tooltip.style.padding = '10px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        tooltip.style.zIndex = '1000';
        tooltip.id = 'day-tooltip';

        // Add content to tooltip
        const dayNumber = dayHovered.day + 1;
        let dayType = 'Regular day';
        if (dayHovered.day < periodLength) dayType = 'Period day';
        if (dayHovered.day >= 11 && dayHovered.day <= 16) dayType = 'Fertile window';
        if (dayHovered.day === ovulationDay - 1) dayType = 'Ovulation day';
        const dotDate = new Date(startDate);
        dotDate.setDate(dotDate.getDate() -cycleLength);
        dotDate.setDate(startDate.getDate() + dayHovered.day + 4);
        dayType += `<br>${dotDate.toDateString()}`;
        
        tooltip.innerHTML = `Day ${dayNumber}<br>${dayType}`;
        
        // Remove existing tooltip if any
        const existingTooltip = document.getElementById('day-tooltip');
        if (existingTooltip) existingTooltip.remove();
        
        document.body.appendChild(tooltip);
    } else {
        dayHovered = null;
        const existingTooltip = document.getElementById('day-tooltip');
        if (existingTooltip) existingTooltip.remove();
    }
    draw();
});

canvas.addEventListener('mouseout', () => {
    circleisHovered = false;
    dotIsHovered = false;
    const existingTooltip = document.getElementById('day-tooltip');
    if (existingTooltip) existingTooltip.remove();
    dayHovered = null;
    gradientValue = 0.2;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    draw();
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    clickedDot = dots.find(dot => {
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        return Math.sqrt(dx * dx + dy * dy) < dot.radius;
    });
    if (clickedDot) {
        alert(`Dot clicked: Day ${clickedDot.day + 1}`);
    }
});

function animateGradient() {
    if (circleisHovered) {
        gradientValue = Math.min(0.5, gradientValue + 0.1);
    } else {
        gradientValue = Math.max(0.2, gradientValue - 0.1);
    }
    draw();
    animationFrameId = requestAnimationFrame(animateGradient);
}

function updateTrackerGraph(cycleDays, periodDays, lastDate) {
    cycleLength = cycleDays;
    periodLength = periodDays;
    startDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    dayInCycle = (Math.floor(Math.abs(today - startDate) / (1000 * 60 * 60 * 24)) % cycleLength);
    draw();
}

draw();

document.getElementById('centerButton').addEventListener('click', () => {
    localStorage.setItem("cycleLength", cycleLength);
    localStorage.setItem("periodLength", periodLength);
    localStorage.setItem("startDate", startDate.toISOString());
    localStorage.setItem("dayInCycle", dayInCycle);
    alert('Cycle logged successfully!');
    draw(); // Add this line to ensure the graph is rendered
});