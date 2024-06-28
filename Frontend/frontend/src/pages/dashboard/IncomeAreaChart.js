import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import api from "../../services/api";

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = () => {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState({
    ...areaChartOptions,
    colors: [theme.palette.primary.main, theme.palette.primary[700]],
    xaxis: {
      categories: ['Pon', 'Tor', 'Sre', 'Čet', 'Pet'],
      labels: {
        style: {
          colors: Array(5).fill(secondary)
        }
      },
      axisBorder: {
        show: true,
        color: line
      },
      tickAmount: 4
    },
    yaxis: {
      labels: {
        style: {
          colors: [secondary]
        }
      }
    },
    grid: {
      borderColor: line
    },
    tooltip: {
      theme: 'light'
    }
  });

  const [series, setSeries] = useState([]);

  useEffect(() => {
    // Function to fetch orders data
    const fetchOrdersData = async () => {
      try {
        const currentWeekResponse = await api.get("/narocila/st_teden1");
        const previousWeekResponse = await api.get("/narocila/st_teden2");

        // Convert the response data into the format expected by ApexCharts
        // Assumes that response data is a map where keys are 'Mon', 'Tue', etc.
        const currentWeekData = Object.values(currentWeekResponse.data);
        const previousWeekData = Object.values(previousWeekResponse.data);

        setSeries([
          {
            name: 'Naročila - Ta Teden',
            data: currentWeekData
          },
          {
            name: 'Naročila - Prejšnji Teden',
            data: previousWeekData
          }
        ]);
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    fetchOrdersData();
  }, []);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
