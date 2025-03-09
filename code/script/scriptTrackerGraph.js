const canvas = document.getElementById('periodTracker');
const ctx = canvas.getContext('2d');
const radius = 150;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const today = new Date();
let cycleLength = 28; // Default cycle length
let periodLength = 5; // Default period length
const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDate() % cycleLength));
const dayInCycle = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
let ovulationDay = 14;
let circleisHovered = false;
let dotIsHovered = false;
let gradientValue = 0.2;
let animationFrameId;
let newDotDay = null;
let dayHovered = null;
const dotOffset = 30;
const dots = [];

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
        dots.push({ x, y, radius: i === dayInCycle ? 16 : 8, day: i });
        ctx.beginPath();
        ctx.shadowColor = i === dayInCycle ? 'rgb(175, 44, 55)' : 'rgb(173, 138, 138)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = i === dayInCycle ? '#E63946' : '#F4C2C2';
        if (dayHovered && dayHovered.day === i) {
            ctx.arc(x, y, dayHovered.radius === 16 ? 20 : 14, 0, 2 * Math.PI);
        } else {
            ctx.arc(x, y, i === dayInCycle ? 16 : 8, 0, 2 * Math.PI);
        }
        if (i <= periodLength) {
            ctx.fillStyle = '#B22222';
            ctx.shadowColor = 'rgb(139, 24, 24)';
        }
        if (i >= 12 && i <= 17) {
            ctx.fillStyle = '#E85D04';
            ctx.shadowColor = 'rgb(175, 67, 0)';
        }
        if (i === ovulationDay) {
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
    ctx.fillText(`Day ${dayInCycle + 1} of ${cycleLength}`, centerX, centerY - 10);
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
    } else {
        dayHovered = null;
    }
    draw();
});

canvas.addEventListener('mouseout', () => {
    circleisHovered = false;
    dotIsHovered = false;
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

function updateTrackerGraph(cycleDays, periodDays) {
    cycleLength = cycleDays;
    periodLength = periodDays;
    draw();
}

draw();