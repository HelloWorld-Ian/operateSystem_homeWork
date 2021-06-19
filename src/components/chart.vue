<template>
 <div id="chart">
        <apexchart type="donut" :options="chartOptions" :series="series" :lables="labels"></apexchart>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      chartOptions: {
        chart: {
          type: 'donut',
        },
        labels: this.$store.state.mem_name
      },
       responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }],
      series:this.$store.state.mem
    };
  },
};
</script>