import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ConceptDistribution } from '@/utils/stats';
import { getConceptHex } from '@/styles/conceptColors';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ConceptDistributionChartProps {
  distribution: ConceptDistribution[];
}

export function ConceptDistributionChart({ distribution }: ConceptDistributionChartProps) {
  const topConcepts = distribution.slice(0, 8);
  const otherCount = distribution.slice(8).reduce((acc, curr) => acc + curr.count, 0);
  
  const labels = [...topConcepts.map(d => d.concept), ...(otherCount > 0 ? ['Other'] : [])];
  const counts = [...topConcepts.map(d => d.count), ...(otherCount > 0 ? [otherCount] : [])];
  const colors = [
    ...topConcepts.map(d => getConceptHex(d.concept)),
    ...(otherCount > 0 ? ['#a8a29e'] : [])
  ];

  const data = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: { family: 'Inter', size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle' as const,
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
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}
