    <template>
      <Doughnut :data="chartData" :options="chartOptions" :chart-title="chartTitle" />
    </template>

    <script>
    import { Doughnut } from 'vue-chartjs';
    import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

    ChartJS.register(Title, Tooltip, Legend, ArcElement);

    export default {
      name: 'DoughnutChart',
      components: { Doughnut },
      props: {
        labels: {
          type: Array,
          required: true,
        },
        data: {
          type: Array,
          required: true,
        },
        colors: {
          type: Array,
          default: () => ['#FF6384', '#36A2EB', '#FFCE56'], // Default colors
        },
        chartTitle: {
            type: String,
            default: "KUMO Doughnut Chart"
        }
      },
      data() {
        return {
          chartData: {
            labels: this.labels,
            datasets: [
              {
                backgroundColor: this.colors,
                data: this.data,
              },
            ],
          },
          chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '55%', // Adjust the cutout percentage for the donut hole
            // Add other Chart.js options as needed
            plugins: {
              legend: {
                display: true,
              },
              tooltip: {
                enabled: true,
              },
              title: {
                display: true,
                text: this.chartTitle,
              },
            },
          },
        };
      },
      watch: {
        // Watch for changes in props and update chartData accordingly
        labels(newLabels) {
          this.chartData.labels = newLabels;
        },
        data(newData) {
          this.chartData.datasets[0].data = newData;
        },
        colors(newColors) {
          this.chartData.datasets[0].backgroundColor = newColors;
        },
      },
    };
    </script>