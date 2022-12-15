import { Component, onMount } from "solid-js";
import Chart, { ChartArea, ChartConfiguration, ChartData } from "chart.js/auto";
import { createRef } from "#lib/ref";
import clsx from "clsx";
import colors from "tailwindcss/colors";

interface GradientDetails {
  gradient: CanvasGradient;
  height: number;
  width: number;
}
interface LineChartProps {
  class?: string;
}

const LineChart: Component<LineChartProps> = (props) => {
  const [canvasRef, setCanvasRef] = createRef<HTMLCanvasElement | null>(null);
  const [gradientRef, setGradientRef] = createRef<GradientDetails | null>(null);
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];
  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: ChartArea) => {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    const gradientDetails = gradientRef();
    if (
      !gradientDetails ||
      gradientDetails.height !== chartHeight ||
      gradientDetails.width !== chartWidth
    ) {
      const width = chartWidth;
      const height = chartHeight;
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, "#56D2FB");
      gradient.addColorStop(1, "#8062FB");
      setGradientRef({ gradient, height, width });
    }

    return gradientRef()!.gradient;
  };
  const data: ChartData = {
    labels: labels,
    datasets: [
      {
        borderWidth: 8,
        borderCapStyle: "round",
        borderColor(context: { chart: Chart }) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea);
        },
        data: [300, 1000, 500, 2000, 1600, 3000, 2400],

        tension: 0.4,
      },
      {
        borderWidth: 4,
        borderCapStyle: "round",
        data: [100, 1400, 800, 2300, 1200, 4000, 1500],

        tension: 0.4,
      },
    ],
  };
  const formatter = Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    notation: "compact",
  });
  const config: ChartConfiguration = {
    type: "line",
    data,
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {} },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: colors.gray[400],
          },
        },
        y: {
          ticks: {
            color: colors.gray[400],
            count: 5,
            callback(value, index, ticks) {
              return formatter.format(Number(value));
            },
          },
        },
      },
    },
  };

  onMount(() => {
    const canvas = canvasRef();

    if (canvas) {
      const myChart = new Chart(canvas, config);
    }
  });

  return (
    <div class={clsx(tw`relative`, props.class)}>
      <canvas ref={setCanvasRef}></canvas>
    </div>
  );
};

export { LineChart };
