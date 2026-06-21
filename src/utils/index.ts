import { RiskLevel } from '@/types';

export function getRiskLabel(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  };
  return map[level];
}

export function getRiskColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981'
  };
  return map[level];
}

export function getRiskBgColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: '#FEF2F2',
    medium: '#FFFBEB',
    low: '#ECFDF5'
  };
  return map[level];
}

export function calculateGrade(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 95) return 'S';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

export function getGradeColor(grade: string): string {
  const map: { [key: string]: string } = {
    S: '#8B5CF6',
    A: '#10B981',
    B: '#3B82F6',
    C: '#F59E0B',
    D: '#EF4444'
  };
  return map[grade] || '#475569';
}

export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
