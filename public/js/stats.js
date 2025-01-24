let mainChart, glpiChart, callersChart, tagsChart;
let currentPeriod = 'day';
let stats;
let filteredStats;

function initializeStats(data) {
    stats = data;
    filteredStats = {...stats};
    initializeCharts();
    setInitialDates();
}

function filterDataByDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59);
        
        filteredStats = {
            ...stats,
            [currentPeriod]: {
                labels: [],
                data: [],
                glpiData: [],
                total: 0,
                glpi: 0
            }
        };

        stats[currentPeriod].labels.forEach((label, index) => {
            let date;
            let endRangeDate;

            if (currentPeriod === 'week' && label.includes(' - ')) {
                // Pour les semaines, vérifier la plage complète
                const [startStr, endStr] = label.split(' - ');
                date = new Date(startStr.split('/').reverse().join('-'));
                endRangeDate = new Date(endStr.split('/').reverse().join('-'));
                // Une semaine correspond si elle chevauche la plage sélectionnée
                if ((date >= startDate && date <= endDate) || 
                    (endRangeDate >= startDate && endRangeDate <= endDate) ||
                    (date <= startDate && endRangeDate >= endDate)) {
                    filteredStats[currentPeriod].labels.push(label);
                    filteredStats[currentPeriod].data.push(stats[currentPeriod].data[index]);
                    filteredStats[currentPeriod].glpiData.push(stats[currentPeriod].glpiData[index]);
                }
            } else {
                // Logique existante pour les jours et mois
                if (label.includes(' ')) {
                    const [month, year] = label.split(' ');
                    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
                    date = new Date(parseInt(year), monthIndex);
                } else {
                    date = new Date(label.split('/').reverse().join('-'));
                }
                if (date >= startDate && date <= endDate) {
                    filteredStats[currentPeriod].labels.push(label);
                    filteredStats[currentPeriod].data.push(stats[currentPeriod].data[index]);
                    filteredStats[currentPeriod].glpiData.push(stats[currentPeriod].glpiData[index]);
                }
            }
        });

        filteredStats[currentPeriod].total = filteredStats[currentPeriod].data.reduce((a, b) => a + b, 0);
        filteredStats[currentPeriod].glpi = filteredStats[currentPeriod].glpiData.reduce((a, b) => a + b, 0);
    } else {
        filteredStats = {...stats};
    }
    updateAllCharts();
}

function updatePeriod(period) {
    currentPeriod = period;
    const now = new Date();
    
    // Réinitialiser les styles de tous les boutons
    ['day', 'week', 'month'].forEach(p => {
        const btn = document.getElementById(`btn${p.charAt(0).toUpperCase() + p.slice(1)}`);
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    });

    // Mettre en surbrillance le bouton sélectionné
    const selectedBtn = document.getElementById(`btn${period.charAt(0).toUpperCase() + period.slice(1)}`);
    selectedBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
    selectedBtn.classList.add('bg-blue-500', 'text-white');
    
    switch(period) {
        case 'day':
            // Définir sur le jour actuel
            document.getElementById('startDate').valueAsDate = now;
            document.getElementById('endDate').valueAsDate = now;
            break;
        case 'week':
            // Définir sur la semaine actuelle (lundi-dimanche)
            const monday = new Date(now);
            monday.setDate(now.getDate() - now.getDay() + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            document.getElementById('startDate').valueAsDate = monday;
            document.getElementById('endDate').valueAsDate = sunday;
            break;
        case 'month':
            // Définir la plage sur les 12 derniers mois
            const twelveMonthsAgo = new Date(now);
            twelveMonthsAgo.setMonth(now.getMonth() - 11);
            document.getElementById('startDate').valueAsDate = twelveMonthsAgo;
            document.getElementById('endDate').valueAsDate = now;
            break;
    }
    
    filterDataByDate();
}

function applySelection() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Vérifier si les dates sont valides
    if (startDate && endDate) {
        filterDataByDate();
    } else {
        // Optionnel : afficher un message d'erreur
        alert('Veuillez sélectionner une plage de dates valide');
    }
}

function updateButtonStyles() {
    ['day', 'week', 'month'].forEach(p => {
        const btn = document.getElementById(`btn${p.charAt(0).toUpperCase() + p.slice(1)}`);
        if (currentPeriod === p) {
            btn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
            btn.classList.add('bg-blue-500', 'text-white');
        } else {
            btn.classList.remove('bg-blue-500', 'text-white');
            btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
        }
    });
}

function updateAllCharts() {
    const data = filteredStats[currentPeriod];
    updateMainChart(data);
    updateGLPIChart(data);
    updateCallersChart();
    updateTagsChart();
    updateStats(data);
}

function updateMainChart(data) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    
    if (mainChart) mainChart.destroy();
    
    // Filtrer uniquement les jours avec des données
    const nonZeroData = data.labels.reduce((acc, label, index) => {
        if (data.data[index] > 0 || data.glpiData[index] > 0) {
            acc.labels.push(label);
            acc.data.push(data.data[index]);
            acc.glpiData.push(data.glpiData[index]);
        }
        return acc;
    }, { labels: [], data: [], glpiData: [] });
    
    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: nonZeroData.labels,
            datasets: [{
                label: 'Total Tickets',
                data: nonZeroData.data,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3
            }, {
                label: 'Tickets GLPI',
                data: nonZeroData.glpiData,
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    // Ajuster l'échelle y pour qu'elle soit plus proche des données
                    suggestedMax: Math.max(...nonZeroData.data, ...nonZeroData.glpiData) + 1
                },
                x: {
                    grid: {
                        display: true
                    },
                    ticks: {
                        // Afficher toutes les étiquettes pour une meilleure lisibilité
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 30
                }
            }
        }
    });
}

function updateGLPIChart(data) {
    const ctx = document.getElementById('glpiChart');
    if (!ctx) return;

    if (glpiChart) glpiChart.destroy();
    
    glpiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['GLPI', 'Non-GLPI'],
            datasets: [{
                data: [data.glpi, data.total - data.glpi],
                backgroundColor: [
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateCallersChart() {
    const ctx = document.getElementById('callersChart');
    if (!ctx || !stats.topCallers) return;

    if (callersChart) callersChart.destroy();
    
    callersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.topCallers.map(c => c.name),
            datasets: [{
                data: stats.topCallers.map(c => c.count),
                backgroundColor: 'rgba(16, 185, 129, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateTagsChart() {
    const ctx = document.getElementById('tagsChart');
    if (!ctx || !stats.topTags) return;

    if (tagsChart) tagsChart.destroy();
    
    tagsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.topTags.map(t => t.name),
            datasets: [{
                data: stats.topTags.map(t => t.count),
                backgroundColor: 'rgba(124, 58, 237, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function updateStats(data) {
    document.getElementById('totalTickets').textContent = data.total;
    document.getElementById('totalGLPI').textContent = data.glpi;
    const avgTickets = data.data.filter(count => count > 0).length 
        ? (data.total / data.data.filter(count => count > 0).length).toFixed(1)
        : '0.0';
    document.getElementById('avgTicketsPerDay').textContent = avgTickets;
}

function setInitialDates() {
    updatePeriod(currentPeriod);
}

function openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.add('hidden');
}

function handleExport(event) {
    event.preventDefault();
    const queryParams = new URLSearchParams({
        period: document.getElementById('exportPeriod').value,
        includeGLPI: document.getElementById('includeGLPI').checked,
        includeTags: document.getElementById('includeTags').checked,
        includeCallers: document.getElementById('includeCallers').checked
    });
    window.location.href = `/api/stats/export?${queryParams}`;
    closeExportModal();
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.initialStats) {
        initializeStats(window.initialStats);
        updatePeriod('day');
        
        // Ajouter les écouteurs d'événements pour les dates
        document.getElementById('startDate').addEventListener('change', filterDataByDate);
        document.getElementById('endDate').addEventListener('change', filterDataByDate);
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeExportModal();
    }
});