import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useRecoilValue } from "recoil";
import { colorScheme as colorSchemeStore } from "@/stores/color-scheme";
import { darkMode as darkModeStore } from "@/stores/dark-mode";
import { useMemo } from "react";

function Main(props) {
  const darkMode = useRecoilValue(darkModeStore);
  const colorScheme = useRecoilValue(colorSchemeStore);

  const data = useMemo(() => {
    const configData = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Dataset 1",
          data: [4, 7, 5, 4, 9, 7, 5],

          backgroundColor: colorScheme ? colors.primary(0.11) : "",
        },
        {
          label: "Dataset 2",
          data: [6, 8, 3, 9, 1, 4, 3],
          backgroundColor: colorScheme ? colors.primary(1) : "",
        },
      ],
      // datasets: [
      //   {
      //     barPercentage: 0.35,
      //     data: [
      //       { count: 2, max: 36 },
      //       { count: 2, max: 16 },
      //       { count: 2, max: 10 },
      //       { count: 2, max: 9 }
      //     ],
      //     borderWidth: 1,
      //     borderColor: colorScheme ? colors.primary(0.7) : "",
      //     backgroundColor: colorScheme ? colors.primary(0.11) : "",
      //   },
      // ],
    };

    return darkMode ? configData : configData;
  });

  const options = useMemo(() => {
    return {
      type: "bar",
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: "Chart.js Bar Chart - Stacked",
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },

      // maintainAspectRatio: false,
      // plugins: {
      //   legend: {
      //     display: false,
      //   },
      // },
      // scales: {
      //   x: {
      //     ticks: {
      //       display: true,
      //     },
      //     grid: {
      //       display: true,
      //       drawBorder: false,
      //     },
      //   },
      //   y: {
      //     ticks: {
      //       display: true,
      //       beginAtZero: true,
      //     },
      //     grid: {
      //       display: true,
      //       drawBorder: true,
      //     },
      //   },
      // },
    };
  });

  return (
    <Chart
      type="bar"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
