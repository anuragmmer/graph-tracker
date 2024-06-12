let importedFileName = '';
const ctx = document.getElementById('myChart').getContext('2d');
let points = [0];

let myChart;

function drawGraph() {
    const data = {
        labels: Array.from({ length: points.length }, (_, i) => i.toString()),
        datasets: [{
            label: 'Graph Data',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            data: points,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4,
        }]
    };

    const options = {
        responsive: true,
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
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#333',
                }
            },
            zoom: {
                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                    onZoom: function({chart}) {
                        document.getElementById('resetZoomBtn').style.display = 'block';
                    },
                    onZoomComplete: function({chart}) {
                        if (chart.getZoomLevel() === 1) {
                            document.getElementById('resetZoomBtn').style.display = 'none';
                        }
                    }
                },
                pan: {
                    enabled: true,
                    mode: 'xy'
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad'
        }
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

    const link = document.createElement('a');
    link.href = myChart.toBase64Image();
    link.download = fileName;
    link.click();
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

function resetZoom() {
    myChart.resetZoom();
    document.getElementById('resetZoomBtn').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', (event) => {
    drawGraph();
});
