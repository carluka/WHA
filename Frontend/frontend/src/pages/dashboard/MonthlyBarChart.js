import { useEffect, useState } from 'react';
import api from "../../services/api";

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Pon', 'Tor', 'Sre', 'Cet', 'Pet'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: true
  },
  grid: {
    show: true
  }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = () => {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  // Initialize series state here
  const [series, setSeries] = useState([{ data: [] }]);
  const [options, setOptions] = useState(barChartOptions);

  useEffect(() => {
   const fetchOrderTotals = () => {
     try {
       // Correct API endpoint should be used here
       api.get("/narocila/tedensko").then((result) => {
         const data = result.data;
         const chartData = Object.values(data).map(value => parseFloat(value.toFixed(2)));
         setSeries([{ data: chartData }]);
       });
       // Ensure that the data structure matches your expected format
     } catch (error) {
       console.error('Error fetching order totals:', error);
     }
   };

   fetchOrderTotals();
 }, []);

 useEffect(() => {
   setOptions((prevState) => ({
     ...prevState,
     colors: [info],
     xaxis: {
       labels: {
         style: {
           colors: new Array(7).fill(secondary)
         }
       }
     },
     tooltip: {
       theme: 'light'
     }
   }));
 }, [theme, info, secondary]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </div>
  );
};

export default MonthlyBarChart;
