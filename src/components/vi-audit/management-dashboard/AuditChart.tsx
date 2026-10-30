import { useEffect, useRef } from "react";
import { Chart, registerables, type ChartDataset } from "chart.js";
import { C, type ChartKind, type ChartSpec } from "./data";

Chart.register(...registerables);
Chart.defaults.font.family = "Poppins";
Chart.defaults.font.size = 10.5;
Chart.defaults.color = C.sage;
Chart.defaults.plugins.legend.display = false;

interface AuditChartProps {
  spec: ChartSpec;
  type: ChartKind;
  compactDonut?: boolean;
}

export function AuditChart({ spec, type, compactDonut = false }: AuditChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === "table" || !canvasRef.current) return;
    const isPie = type === "donut";
    const datasets: ChartDataset[] = spec.datasets.map((series) => {
      if (isPie) {
        return {
          label: series.label,
          data: [...series.data],
          backgroundColor: series.pieColors ?? [C.terra, C.sage, C.blue, C.teal, C.warn, C.lav, C.err, C.ok],
          borderWidth: 0,
        };
      }
      if (type === "bar") {
        return {
          label: series.label,
          data: [...series.data],
          backgroundColor: series.barColor ?? C.terra,
          borderRadius: 5,
          borderSkipped: false,
        };
      }
      return {
        label: series.label,
        data: [...series.data],
        borderColor: series.lineColor ?? C.terra,
        backgroundColor: series.lineFill ?? "rgba(255,143,107,.18)",
        tension: 0.35,
        fill: true,
        borderWidth: 2.5,
        pointRadius: 0,
        pointHoverRadius: 4,
      };
    });

    const chart = new Chart(canvasRef.current, {
      type: isPie ? "doughnut" : type,
      data: { labels: spec.labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: !isPie && spec.horizontal ? "y" : "x",
        cutout: isPie ? "65%" : undefined,
        plugins: {
          legend: {
            display: !compactDonut && (isPie || datasets.length > 1),
            position: isPie ? "right" : "bottom",
            labels: { font: { size: 10.5 }, boxWidth: 10, padding: 8 },
          },
          tooltip: {
            backgroundColor: C.dark,
            titleFont: { size: 11, weight: 600 },
            bodyFont: { size: 11 },
            padding: 10,
            cornerRadius: 6,
          },
        },
        scales: isPie
          ? undefined
          : {
              x: {
                stacked: Boolean(spec.stacked),
                ticks: { color: C.sage, font: { size: 10 } },
                grid: { color: "#EADCC4" },
              },
              y: {
                stacked: Boolean(spec.stacked),
                beginAtZero: true,
                ticks: { color: C.sage, font: { size: 10 } },
                grid: { color: "#EADCC4" },
              },
            },
      },
    });

    return () => chart.destroy();
  }, [compactDonut, spec, type]);

  if (type === "table") {
    return (
      <div className="chart-as-table">
        <table>
          <thead>
            <tr>
              <th>Label</th>
              {spec.datasets.map((series) => (
                <th key={series.label} style={{ textAlign: "right" }}>
                  {series.label || "Value"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.labels.map((label, index) => (
              <tr key={label}>
                <td>{label}</td>
                {spec.datasets.map((series) => (
                  <td key={series.label}>{series.data[index].toLocaleString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <canvas ref={canvasRef} />;
}

const TYPE_LABEL: Record<Exclude<ChartKind, "table">, string> = {
  donut: "Donut",
  bar: "Bar",
  line: "Line",
};

interface ChartSwitchProps {
  options: ChartKind[];
  value: ChartKind;
  onChange: (type: ChartKind) => void;
}

export function ChartSwitch({ options, value, onChange }: ChartSwitchProps) {
  return (
    <div className="chart-switch">
      {options.map((option) => (
        <button key={option} type="button" className={value === option ? "active" : ""} onClick={() => onChange(option)}>
          {option === "table" ? "Table" : TYPE_LABEL[option]}
        </button>
      ))}
    </div>
  );
}

export function myDashSwitches(spec: ChartSpec): ChartKind[] {
  if (spec.datasets.length > 1) return [spec.defaultType, "table"];
  const alt: ChartKind = spec.defaultType === "bar" ? "donut" : "bar";
  return [spec.defaultType, alt, "table"];
}
