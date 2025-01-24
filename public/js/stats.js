let mainChart, glpiChart, callersChart, tagsChart;
let currentPeriod = 'day';
let stats;
let filteredStats;

// Initialisation des statistiques
function initializeStats(data) {
    if (!data) {
        console.error("Aucune donnée statistique fournie.");
        return;
    }
    stats = data;
    filteredStats = { ...stats };
    initializeCharts();
    setInitialDates();
}

// Filtrage des données par date
function filterDataByDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        endDate.setHours(23, 59, 59); // Inclure toute la journée de fin

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
        filteredStats = { ...stats }; // Réinitialiser les données filtrées
    }
    updateAllCharts();
}

// Mise à jour de la période sélectionnée
function updatePeriod(period) {
    currentPeriod = period;
    const now = new Date();

    // Réinitialiser les styles des boutons
    ['day', 'week', 'month'].forEach(p => {
        const btn = document.getElementById(`btn${p.charAt(0).toUpperCase() + p.slice(1)}`);
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'hover:bg-gray-300');
    });

    // Mettre en surbrillance le bouton sélectionné
    const selectedBtn = document.getElementById(`btn${period.charAt(0).toUpperCase() + period.slice(1)}`);
    selectedBtn.classList.remove('bg-gray-200', 'hover:bg-gray-300');
    selectedBtn.classList.add('bg-blue-500', 'text-white');

    // Définir les dates en fonction de la période sélectionnée
    switch (period) {
        case 'day':
            document.getElementById('startDate').valueAsDate = now;
            document.getElementById('endDate').valueAsDate = now;
            break;
        case 'week':
            const monday = new Date(now);
            monday.setDate(now.getDate() - now.getDay() + 1);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            document.getElementById('startDate').valueAsDate = monday;
            document.getElementById('endDate').valueAsDate = sunday;
            break;
        case 'month':
            const twelveMonthsAgo = new Date(now);
            twelveMonthsAgo.setMonth(now.getMonth() - 11);
            document.getElementById('startDate').valueAsDate = twelveMonthsAgo;
            document.getElementById('endDate').valueAsDate = now;
            break;
    }

    filterDataByDate();
}

// Mise à jour de tous les graphiques
function updateAllCharts() {
    const data = filteredStats[currentPeriod];
    updateMainChart(data);
    updateGLPIChart(data);
    updateCallersChart();
    updateTagsChart();
    updateStats(data);
}

// Mise à jour du graphique principal
function updateMainChart(data) {
    const ctx = document.getElementById('mainChart');
    if (!ctx || !data || !data.labels || !data.data || !data.glpiData) {
        console.error("Élément ou données manquants pour le graphique principal.");
        return;
    }

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

    if (nonZeroData.labels.length === 0) {
        console.error("Aucune donnée valide pour le graphique principal.");
        return;
    }

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: nonZeroData.labels,
            datasets: [
                {
                    label: 'Total Tickets',
                    data: nonZeroData.data,
                    borderColor: 'rgb(59, 130, 246)', // Bleu
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.3, // Courbe lissée
                    fill: true, // Remplissage sous la courbe
                    pointRadius: 5, // Taille des points
                    pointHoverRadius: 7, // Taille des points au survol
                    borderWidth: 2 // Épaisseur de la ligne
                },
                {
                    label: 'Tickets GLPI',
                    data: nonZeroData.glpiData,
                    borderColor: 'rgb(139, 92, 246)', // Violet
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    onClick: (e, legendItem, legend) => {
                        // Permet de masquer/afficher les datasets en cliquant sur la légende
                        const index = legendItem.datasetIndex;
                        const meta = legend.chart.getDatasetMeta(index);
                        meta.hidden = meta.hidden === null ? !legend.chart.data.datasets[index].hidden : null;
                        legend.chart.update();
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)' // Couleur de la grille
                    },
                    title: {
                        display: true,
                        text: 'Nombre de tickets'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    },
                    ticks: {
                        maxRotation: 45, // Rotation des étiquettes pour une meilleure lisibilité
                        minRotation: 45
                    },
                    title: {
                        display: true,
                        text: 'Période'
                    }
                }
            },
            animation: {
                duration: 1000, // Durée de l'animation
                easing: 'easeInOutQuad' // Type d'animation
            },
            interaction: {
                mode: 'nearest', // Affiche le tooltip le plus proche du curseur
                intersect: false
            }
        }
    });
}

// Mise à jour du graphique GLPI
function updateGLPIChart(data) {
    const ctx = document.getElementById('glpiChart');
    if (!ctx || !data) {
        console.error("Élément ou données manquants pour le graphique GLPI.");
        return;
    }

    if (glpiChart) glpiChart.destroy();

    glpiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['GLPI', 'Non-GLPI'],
            datasets: [
                {
                    data: [data.glpi, data.total - data.glpi],
                    backgroundColor: [
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(59, 130, 246, 0.8)'
                    ]
                }
            ]
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

// Mise à jour du graphique des appelants
function updateCallersChart() {
    const ctx = document.getElementById('callersChart');
    if (!ctx || !stats.topCallers) {
        console.error("Élément ou données manquants pour le graphique des appelants.");
        return;
    }

    if (callersChart) callersChart.destroy();

    callersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.topCallers.map(c => c.name),
            datasets: [
                {
                    data: stats.topCallers.map(c => c.count),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)'
                }
            ]
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

// Mise à jour du graphique des tags
function updateTagsChart() {
    const ctx = document.getElementById('tagsChart');
    if (!ctx || !stats.topTags) {
        console.error("Élément ou données manquants pour le graphique des tags.");
        return;
    }

    if (tagsChart) tagsChart.destroy();

    tagsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.topTags.map(t => t.name),
            datasets: [
                {
                    data: stats.topTags.map(t => t.count),
                    backgroundColor: 'rgba(124, 58, 237, 0.8)'
                }
            ]
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

// Mise à jour des statistiques affichées
function updateStats(data) {
    if (!data) {
        console.error("Données manquantes pour la mise à jour des statistiques.");
        return;
    }
    document.getElementById('totalTickets').textContent = data.total;
    document.getElementById('totalGLPI').textContent = data.glpi;
    const avgTickets = data.data.filter(count => count > 0).length
        ? (data.total / data.data.filter(count => count > 0).length).toFixed(1)
        : '0.0';
    document.getElementById('avgTicketsPerDay').textContent = avgTickets;
}

// Définir les dates initiales
function setInitialDates() {
    updatePeriod(currentPeriod);
}

// Ouvrir le modal d'export
function openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
}

// Fermer le modal d'export
function closeExportModal() {
    document.getElementById('exportModal').classList.add('hidden');
}

// Gérer l'export des données
function handleExport(event) {
    event.preventDefault();
    const period = document.getElementById('exportPeriod').value;
    const includeGLPI = document.getElementById('includeGLPI').checked;
    const includeTags = document.getElementById('includeTags').checked;
    const includeCallers = document.getElementById('includeCallers').checked;

    if (!period || (!includeGLPI && !includeTags && !includeCallers)) {
        alert("Veuillez sélectionner au moins une option d'export.");
        return;
    }

    const queryParams = new URLSearchParams({
        period,
        includeGLPI,
        includeTags,
        includeCallers
    });
    window.location.href = `/api/stats/export?${queryParams}`;
    closeExportModal();
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    if (window.initialStats) {
        initializeStats(window.initialStats);
        updatePeriod('day');

        // Ajouter les écouteurs d'événements pour les dates
        document.getElementById('startDate').addEventListener('change', filterDataByDate);
        document.getElementById('endDate').addEventListener('change', filterDataByDate);
    }
});

// Fermer le modal avec la touche Échap
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeExportModal();
    }
});