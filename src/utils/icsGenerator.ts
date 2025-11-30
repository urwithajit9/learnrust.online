import { CurriculumItem } from '@/data/curriculum';

const yearMap: Record<string, number> = { 
  "Dec": 2025, 
  "Jan": 2026, 
  "Feb": 2026, 
  "Mar": 2026 
};

const monthMap: Record<string, number> = { 
  "Dec": 11, 
  "Jan": 0, 
  "Feb": 1, 
  "Mar": 2 
};

const formatDate = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const generateICS = (data: CurriculumItem[]): void => {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LearnRust//Learning Schedule//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Rust Learning Schedule
X-WR-TIMEZONE:UTC
`;

  data.forEach((item, index) => {
    const [month, day] = item.date.split(" ");
    const year = yearMap[month];
    
    const startDate = new Date(year, monthMap[month], parseInt(day), 8, 0);
    const endDate = new Date(year, monthMap[month], parseInt(day), 8, 15);

    const escapedTopic = item.topic
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n');

    icsContent += `BEGIN:VEVENT
UID:learnrust-${index}-${Date.now()}@learnhost.online
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:🦀 Rust: ${item.concept}
DESCRIPTION:${escapedTopic}\\n\\nPhase ${item.phase} - 10 min micro-task
CATEGORIES:Learning,Rust,Programming
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });
  
  icsContent += "END:VCALENDAR";
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'rust_learning_schedule.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateSingleDayICS = (item: CurriculumItem): void => {
  generateICS([item]);
};
