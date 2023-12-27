const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let points = [0];

const paddingX = 40;
const paddingY = 40;

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = (canvas.width - 2 * paddingX) / (points.length - 1);
    const scaleY = (canvas.height - 2 * paddingY) / (Math.max(...points) - Math.min(...points) || 1);

    ctx.beginPath();
    for (let i = 1; i < 5; i++) {
        const y = canvas.height - paddingY - (i * (canvas.height - 2 * paddingY) / 5);
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
    }
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 1; i < points.length - 1; i++) {
        const x = paddingX + i * scaleX;
        ctx.moveTo(x, paddingY);
        ctx.lineTo(x, canvas.height - paddingY);
    }
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        const x = paddingX + i * scaleX;
        const y = canvas.height - paddingY - (points[i] - Math.min(...points)) * scaleY;

        if (i > 0) {
            ctx.beginPath();
            ctx.lineWidth = 2;

            if (points[i] < points[i - 1]) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            } else {
                ctx.strokeStyle = 'grey';
            }

            ctx.moveTo(paddingX + (i - 1) * scaleX, canvas.height - paddingY - (points[i - 1] - Math.min(...points)) * scaleY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    for (let i = 0; i < points.length; i++) {
        const x = paddingX + i * scaleX;
        const y = canvas.height - paddingY - (points[i] - Math.min(...points)) * scaleY;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    }
}

function increasePoint() {
    points.push(points[points.length - 1] + 1);
    drawGraph();
}

function decreasePoint() {
    points.push(points[points.length - 1] - 1);
    drawGraph();
}

function addPointInLine() {
    points.push(points[points.length - 1]);
    drawGraph();
}

function undo() {
    if (points.length > 1) {
        points.pop();
        drawGraph();
    }
}

function exportPng() {
    const exportCanvas = document.createElement('canvas');
    const exportScale = 2; // Increase this value for higher resolution
    exportCanvas.width = canvas.width * exportScale;
    exportCanvas.height = canvas.height * exportScale;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.fillStyle = 'white';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    drawGraphOnCanvas(exportCtx, exportScale);
    const dataURL = exportCanvas.toDataURL('image/png', 1.0); 
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'graph.png';
    link.click();
}
function drawGraphOnCanvas(ctx, scale) {
    const scaleX = (canvas.width - 2 * paddingX) / (points.length - 1);
    const scaleY = (canvas.height - 2 * paddingY) / (Math.max(...points) - Math.min(...points) || 1);
    ctx.beginPath();
    for (let i = 1; i < 5; i++) {
        const y = canvas.height - paddingY - (i * (canvas.height - 2 * paddingY) / 5);
        ctx.moveTo(paddingX * scale, y * scale);
        ctx.lineTo((canvas.width - paddingX) * scale, y * scale);
    }
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 1; i < points.length - 1; i++) {
        const x = (paddingX + i * scaleX) * scale;
        ctx.moveTo(x, paddingY * scale);
        ctx.lineTo(x, (canvas.height - paddingY) * scale);
    }
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
        const x = (paddingX + i * scaleX) * scale;
        const y = (canvas.height - paddingY - (points[i] - Math.min(...points)) * scaleY) * scale;
        if (i > 0) {
            ctx.beginPath();
            ctx.lineWidth = 2 * scale;
            if (points[i] < points[i - 1]) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            } else {
                ctx.strokeStyle = 'grey';
            }
            ctx.moveTo((paddingX + (i - 1) * scaleX) * scale, (canvas.height - paddingY - (points[i - 1] - Math.min(...points)) * scaleY) * scale);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    for (let i = 0; i < points.length; i++) {
        const x = (paddingX + i * scaleX) * scale;
        const y = (canvas.height - paddingY - (points[i] - Math.min(...points)) * scaleY) * scale;

        ctx.beginPath();
        ctx.arc(x, y, 4 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = '#000';
        ctx.fill();
    }
}
function exportData() {
    const dataJSON = JSON.stringify(points);
    const blob = new Blob([dataJSON], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'graph_data.json';
    link.click();
}

function importData() {
    const input = document.getElementById('importDataInput');
    input.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const data = JSON.parse(event.target.result);
                if (Array.isArray(data)) {
                    points = data;
                    drawGraph();
                } else {
                    alert('Invalid data format.');
                }
            };
            reader.readAsText(file);
        }
    });
    input.click();
}

document.getElementById('increaseBtn').addEventListener('click', increasePoint);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('decreaseBtn').addEventListener('click', decreasePoint);
document.getElementById('addPointBtn').addEventListener('click', addPointInLine);
document.getElementById('exportPngBtn').addEventListener('click', exportPng);
document.getElementById('exportDataBtn').addEventListener('click', exportData);
document.getElementById('importDataBtn').addEventListener('click', importData);

drawGraph();
