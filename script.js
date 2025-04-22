const csvData = `Year,Mobile Subscriptions (in millions),Internet Subscriptions (in millions)
2015,980,302
2016,1050,342
2017,1120,391
2018,1200,451
2019,1250,504
2020,1300,560
2021,1350,620
2022,1400,680`;

const data = parseCSV(csvData);
renderCharts(data);
renderAverages(data);

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => line.split(','));

  const data = headers.map((_, i) => rows.map(row => row[i]));
  const result = {};
  headers.forEach((header, i) => {
    result[header.trim()] = data[i].map(value => isNaN(value) ? value : +value);
  });
  return result;
}

function renderCharts(data) {
  const labels = data["Year"];
  const datasetKeys = Object.keys(data).filter(key => key !== "Year");

  const barColors = ['#f39c12', '#2ecc71', '#3498db', '#9b59b6'];

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: datasetKeys.map((key, i) => ({
        label: key,
        backgroundColor: barColors[i % barColors.length],
        data: data[key]
      }))
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
    }
  });

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels,
      datasets: datasetKeys.map((key, i) => ({
        label: key,
        borderColor: barColors[i % barColors.length],
        fill: false,
        data: data[key]
      }))
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
    }
  });

  const latestYear = labels.length - 1;
  new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: datasetKeys,
      datasets: [{
        backgroundColor: barColors,
        data: datasetKeys.map(key => data[key][latestYear])
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'right' } },
    }
  });
}

function renderAverages(data) {
  const mobile = data["Mobile Subscriptions (in millions)"];
  const internet = data["Internet Subscriptions (in millions)"];
  const avgMobile = (mobile.reduce((a, b) => a + b, 0) / mobile.length).toFixed(2);
  const avgInternet = (internet.reduce((a, b) => a + b, 0) / internet.length).toFixed(2);

  const avgDisplayTime = (3 + 0.2 * mobile.length).toFixed(2); // Mock average screen time
  const avgDataUsage = (2 + 0.5 * internet.length).toFixed(2); // Mock data usage GB

  document.getElementById("avgMobile").textContent = avgMobile;
  document.getElementById("avgInternet").textContent = avgInternet;
  document.getElementById("avgDisplayTime").textContent = avgDisplayTime;
  document.getElementById("avgDataUsage").textContent = avgDataUsage;
}
