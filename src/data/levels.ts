import { Level } from '@/types';

export const LEVELS: Level[] = [
  {
    id: 'level1',
    order: 1,
    title: '突击检查到店',
    description: '监管执法人员突然到访门店，考验你在第一时间的应急处置能力',
    icon: '⚠️',
    questionCount: 3,
    passingScore: 80,
    unlocked: true,
    completed: true,
    bestScore: 67
  },
  {
    id: 'level2',
    order: 2,
    title: '收到行政处罚告知书',
    description: '面对正式的处罚文书，如何运用法律程序维护企业权益',
    icon: '📋',
    questionCount: 3,
    passingScore: 80,
    unlocked: true,
    completed: false
  },
  {
    id: 'level3',
    order: 3,
    title: '媒体同步曝光',
    description: '舆情发酵时的媒体应对和内部管理，防止二次伤害',
    icon: '📰',
    questionCount: 3,
    passingScore: 80,
    unlocked: false,
    completed: false
  },
  {
    id: 'level4',
    order: 4,
    title: '整改复查未通过',
    description: '整改方案制定、执行和复查应对，确保彻底闭环',
    icon: '🔄',
    questionCount: 3,
    passingScore: 80,
    unlocked: false,
    completed: false
  }
];

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

export function getNextLevel(currentLevelId: string): Level | undefined {
  const idx = LEVELS.findIndex(l => l.id === currentLevelId);
  if (idx >= 0 && idx < LEVELS.length - 1) {
    return LEVELS[idx + 1];
  }
  return undefined;
}
