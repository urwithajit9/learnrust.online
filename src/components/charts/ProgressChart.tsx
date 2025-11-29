import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ProgressStats } from '@/utils/stats';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps {
  stats: ProgressStats;
}

export function ProgressChart({ stats }: ProgressChartProps) {
  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [stats.completed, stats.remaining],
        backgroundColor: [
          'hsl(24, 95%, 53%)',
          'hsl(30, 15%, 88%)',
        ],
        borderWidth: 0,
        cutout: '75%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(20, 14%, 12%)',
        titleFont: { family: 'Inter', weight: 'bold' as const },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="relative h-48 w-48 mx-auto">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{stats.percent}%</span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </div>
  );
}
