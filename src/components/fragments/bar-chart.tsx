import { Component, onMount } from "solid-js";
import Chart, { ChartArea, ChartConfiguration, ChartData } from "chart.js/auto";
import { createRef } from "#lib/ref";
import colors from "tailwindcss/colors";
import clsx from "clsx";

interface GradientDetails {
  gradient: CanvasGradient;
  height: number;
  width: number;
}
interface BarChartProps {
  class?: string;
}

const BarChart: Component<BarChartProps> = (props) => {
  const [canvasRef, setCanvasRef] = createRef<HTMLCanvasElement | null>(null);
  const [gradientRef, setGradientRef] = createRef<GradientDetails | null>(null);
  const labels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
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
        borderRadius: 25,
        barPercentage: 0.6,
        backgroundColor(context: { chart: Chart }) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This case happens on initial chart load
            return;
          }
          return getGradient(ctx, chartArea);
        },
        data: [300, 1000, 500, 1800, 1600, 700, 1200],

        tension: 0.4,
      },
    ],
  };
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
  });
  const config: ChartConfiguration = {
    type: "bar",
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
            stepSize: 1000,
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

export { BarChart };
