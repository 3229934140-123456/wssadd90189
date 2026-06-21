export type RiskLevel = 'high' | 'medium' | 'low';

export type DepartmentType = 'sales' | 'hr' | 'customerService' | 'all';

export type KnowledgeCategory = 
  | 'evidencePreservation'
  | 'regulatoryCommunication'
  | 'rectificationTimeline'
  | 'mediaResponse'
  | 'legalCompliance'
  | 'employeeManagement';

export interface QuestionOption {
  id: string;
  text: string;
  riskLevel: RiskLevel;
  isCorrect: boolean;
  riskExplanation: string;
  caseReference: string;
}

export interface Question {
  id: string;
  levelId: string;
  title: string;
  scenario: string;
  options: QuestionOption[];
  knowledgeCategory: KnowledgeCategory;
  department: DepartmentType;
  correctAnswerId: string;
}

export interface Level {
  id: string;
  order: number;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
  passingScore: number;
  unlocked: boolean;
  completed: boolean;
  bestScore?: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface MistakeRecord {
  question: Question;
  selectedOptionId: string;
  correctOptionId: string;
  timestamp: number;
  reviewed: boolean;
}

export interface UserProgress {
  userId: string;
  userName: string;
  department: string;
  completedLevels: string[];
  currentLevel: string | null;
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  answers: UserAnswer[];
  mistakes: MistakeRecord[];
  overallGrade: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface DepartmentStats {
  name: string;
  totalMembers: number;
  completionRate: number;
  averageScore: number;
  weakCategories: {
    category: KnowledgeCategory;
    errorRate: number;
  }[];
}

export interface CategoryKnowledge {
  key: KnowledgeCategory;
  name: string;
  description: string;
}

export const CATEGORY_KNOWLEDGE: CategoryKnowledge[] = [
  { key: 'evidencePreservation', name: '证据保存', description: '涉及聊天记录、合同、票据等证据的固定与保全' },
  { key: 'regulatoryCommunication', name: '监管沟通', description: '与监管机构的沟通方式、话术和流程规范' },
  { key: 'rectificationTimeline', name: '整改时限', description: '整改方案的制定、提交和执行时限管理' },
  { key: 'mediaResponse', name: '媒体应对', description: '媒体曝光时的应急响应和舆情处理' },
  { key: 'legalCompliance', name: '法务合规', description: '法律程序和合规要求的遵循' },
  { key: 'employeeManagement', name: '员工管理', description: '涉事员工的指导和管理' },
];

export const DEPARTMENT_NAMES: Record<DepartmentType, string> = {
  sales: '销售部',
  hr: '人事部',
  customerService: '客服部',
  all: '通用版',
};
