const canvas = document.getElementById('periodTracker');
const ctx = canvas.getContext('2d');
const totalDays = 28;
const radius = 150;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const today = new Date();
const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDate() % totalDays));
const dayInCycle = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
let isHovered = false;
let gradientValue = 0;
let animationFrameId;
const dotOffset = 30;
const dots = [];

function drawCircle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF6B6B'; // Solid color
    ctx.fill();
    ctx.strokeStyle = '#FF6B6B';
    ctx.stroke();

    // Draw gradient on top
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    const gradient = ctx.createRadialGradient(centerX, centerY, radius / 2, centerX, centerY, radius);
    gradient.addColorStop(0, `rgba(255, 107, 107, ${gradientValue})`);
    gradient.addColorStop(1, `rgba(255, 0, 0, ${gradientValue})`);
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawDots() {
    dots.length = 0; // Clear the dots array
    for (let i = 0; i < totalDays; i++) {
        const angle = (i / totalDays) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + (radius + dotOffset) * Math.cos(angle);
        const y = centerY + (radius + dotOffset) * Math.sin(angle);
        dots.push({ x, y, radius: i === dayInCycle ? 16 : 8 });
        ctx.beginPath();
        ctx.arc(x, y, i === dayInCycle ? 16 : 8, 0, 2 * Math.PI);
        ctx.shadowColor = i === dayInCycle ?'rgb(175, 44, 55)':'rgb(173, 138, 138)';
        ctx.shadowBlur = 5;
        ctx.fillStyle = i === dayInCycle ? '#E63946' : '#F4C2C2';
        if (i <= 5) {
            ctx.fillStyle = '#B22222';
            ctx.shadowColor = 'rgb(139, 24, 24)';
        }
        if (i >= 12 && i <= 17) {
            ctx.fillStyle = '#E85D04';
            ctx.shadowColor = 'rgb(175, 67, 0)';
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadowBlur after drawing each dot
        ctx.fill();
    }
}

function drawText() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`Day ${dayInCycle + 1} of ${totalDays}`, centerX, centerY - 10);
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


canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    isHovered = isMouseOverCircle(mouseX, mouseY);
    if (isHovered && !animationFrameId) {
        animateGradient();
    }
    if (isMouseOverDot(mouseX, mouseY) &&
        !animationFrameId) {
        animateDots();
    }
    
});

canvas.addEventListener('mouseout', () => {
    isHovered = false;
});


function animateGradient() {
    if (isHovered) {
        gradientValue = Math.min(1, gradientValue + 0.1);
    } else {
        gradientValue = Math.max(0, gradientValue - 0.1);
    }
    draw();
    animationFrameId = requestAnimationFrame(animateGradient);
}

function animateDots() {
    dots.forEach(dot => {
        dot.radius = dot.radius === 3 ? 6 : 3;
    });
    draw();
    requestAnimationFrame(animateDots);
}

draw();