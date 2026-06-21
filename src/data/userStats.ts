import { DepartmentStats, UserProgress } from '@/types';

export const USER_PROGRESS: UserProgress = {
  userId: 'u001',
  userName: '张明',
  department: '销售部',
  completedLevels: ['level1'],
  currentLevel: 'level2',
  totalScore: 140,
  totalCorrect: 7,
  totalAnswered: 10,
  answers: [],
  mistakes: [],
  overallGrade: 'B'
};

export const DEPARTMENT_STATS: DepartmentStats[] = [
  {
    name: '销售部',
    totalMembers: 48,
    completionRate: 62.5,
    averageScore: 72,
    weakCategories: [
      { category: 'evidencePreservation', errorRate: 45 },
      { category: 'mediaResponse', errorRate: 38 },
      { category: 'employeeManagement', errorRate: 32 }
    ]
  },
  {
    name: '客服部',
    totalMembers: 36,
    completionRate: 77.8,
    averageScore: 78,
    weakCategories: [
      { category: 'mediaResponse', errorRate: 42 },
      { category: 'regulatoryCommunication', errorRate: 35 }
    ]
  },
  {
    name: '人事部',
    totalMembers: 12,
    completionRate: 100,
    averageScore: 85,
    weakCategories: [
      { category: 'rectificationTimeline', errorRate: 28 }
    ]
  },
  {
    name: '财务部',
    totalMembers: 18,
    completionRate: 83.3,
    averageScore: 81,
    weakCategories: [
      { category: 'legalCompliance', errorRate: 30 },
      { category: 'regulatoryCommunication', errorRate: 25 }
    ]
  },
  {
    name: '运营部',
    totalMembers: 24,
    completionRate: 54.2,
    averageScore: 68,
    weakCategories: [
      { category: 'rectificationTimeline', errorRate: 48 },
      { category: 'evidencePreservation', errorRate: 40 },
      { category: 'legalCompliance', errorRate: 35 }
    ]
  }
];

export const COMPANY_OVERALL_STATS = {
  totalEmployees: 138,
  completedCount: 102,
  overallCompletionRate: 73.9,
  overallAverageScore: 75,
  topWeakCategories: [
    { name: '证据保存', errorRate: 42, category: 'evidencePreservation' },
    { name: '媒体应对', errorRate: 38, category: 'mediaResponse' },
    { name: '整改时限', errorRate: 35, category: 'rectificationTimeline' }
  ]
};
