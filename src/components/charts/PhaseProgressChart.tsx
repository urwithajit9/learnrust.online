import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PhaseProgress {
  phase: number;
  total: number;
  completed: number;
  percent: number;
}

interface PhaseProgressChartProps {
  progress: PhaseProgress[];
}

export function PhaseProgressChart({ progress }: PhaseProgressChartProps) {
  const data = {
    labels: progress.map(p => `Phase ${p.phase}`),
    datasets: [
      {
        label: 'Completed',
        data: progress.map(p => p.completed),
        backgroundColor: 'hsl(24, 95%, 53%)',
        borderRadius: 6,
        barPercentage: 0.7,
      },
      {
        label: 'Remaining',
        data: progress.map(p => p.total - p.completed),
        backgroundColor: 'hsl(30, 15%, 88%)',
        borderRadius: 6,
        barPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle' as const,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'hsl(20, 14%, 12%)',
        titleFont: { family: 'Inter', weight: 'bold' as const },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 11 },
        },
      },
      y: {
        stacked: true,
        grid: { 
          color: 'hsl(30, 15%, 92%)',
        },
        ticks: {
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
