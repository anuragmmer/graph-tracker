let importedFileName = '';
const ctx = document.getElementById('myChart').getContext('2d');
let points = [0];

let myChart;

function drawGraph() {
    const data = {
        labels: Array.from({ length: points.length }, (_, i) => i.toString()),
        datasets: [{
            label: 'Graph Data',
            borderColor: 'grey',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            data: points,
            fill: false,
            pointRadius: 2,
            pointBackgroundColor: '#000',
            tension: 0.2,
        }]
    };

    const options = {
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#ddd',
                },
            },
            y: {
                grid: {
                    display: true,
                    color: '#ddd',
                },
            }
        },
    };

    if (myChart) {
        myChart.data = data;
        myChart.options = options;
        myChart.update();
    } else {
        myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });
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
    const fileName = prompt('Enter a filename for the PNG:', 'graph.png');

    if (!fileName) {
        return;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const chartCanvas = document.getElementById('myChart');
    const margin = 30;
    const resolutionMultiplier = 10;
    tempCanvas.width = (chartCanvas.width + 2 * margin) * resolutionMultiplier;
    tempCanvas.height = (chartCanvas.height + 2 * margin) * resolutionMultiplier;
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(
        chartCanvas,
        margin * resolutionMultiplier,
        margin * resolutionMultiplier,
        chartCanvas.width * resolutionMultiplier,
        chartCanvas.height * resolutionMultiplier
    );
    tempCanvas.toBlob(function (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }, 'image/png', 1.0);
}


function exportData() {
    const fileName = prompt('Enter a filename for the JSON:', 'graph_data.json');

    if (!fileName) {
        return;
    }

    const dataJSON = JSON.stringify(points);
    const blob = new Blob([dataJSON], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
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
                    const importedFileNameDiv = document.getElementById('importedFileName');
                    importedFileName = file.name;
                    importedFileNameDiv.textContent = `Imported File: ${importedFileName}`;
                } else {
                    alert('Invalid data format.');
                }
            };
            reader.readAsText(file);
        }
    });
    input.click();
}


drawGraph();
