import { DepartmentStats, UserProgress } from '@/types';

export const USER_PROGRESS: UserProgress = {
  userId: 'u001',
  userName: '张明',
  department: '销售部',
  completedLevels: [],
  currentLevel: 'level1',
  totalScore: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  answers: [],
  mistakes: [],
  overallGrade: 'C'
};

export const DEPARTMENT_STATS: DepartmentStats[] = [];

export const COMPANY_OVERALL_STATS = {
  totalEmployees: 0,
  completedCount: 0,
  overallCompletionRate: 0,
  overallAverageScore: 0,
  topWeakCategories: []
};
