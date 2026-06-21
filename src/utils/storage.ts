import Taro from '@tarojs/taro';
import { Question, UserProgress, MistakeRecord, Level, DepartmentType, TrainingTask, ReviewRecord } from '@/types';

const STORAGE_KEYS = {
  QUESTIONS: 'compliance_questions',
  USER_PROGRESS: 'compliance_user_progress',
  LEVELS: 'compliance_levels',
  MISTAKES: 'compliance_mistakes',
  CURRENT_VERSION: 'compliance_current_version',
  MISTAKES_FILTER: 'compliance_mistakes_filter',
  DEPARTMENT_STATS: 'compliance_department_stats',
  ANSWER_HISTORY: 'compliance_answer_history',
  TRAINING_TASKS: 'compliance_training_tasks',
  REVIEW_RECORDS: 'compliance_review_records',
  MISTAKES_TAB_ACTION: 'compliance_mistakes_tab_action'
};

export const storage = {
  getQuestions: (): Question[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getQuestions error:', e);
      return [];
    }
  },

  setQuestions: (questions: Question[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      console.log('[Storage] Saved questions:', questions.length);
    } catch (e) {
      console.error('[Storage] setQuestions error:', e);
    }
  },

  addQuestion: (question: Question): void => {
    const questions = storage.getQuestions();
    const exists = questions.find(q => q.id === question.id);
    if (exists) {
      const updated = questions.map(q => q.id === question.id ? question : q);
      storage.setQuestions(updated);
    } else {
      storage.setQuestions([...questions, question]);
    }
  },

  deleteQuestion: (questionId: string): void => {
    const questions = storage.getQuestions();
    storage.setQuestions(questions.filter(q => q.id !== questionId));
  },

  getUserProgress: (): UserProgress | null => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('[Storage] getUserProgress error:', e);
      return null;
    }
  },

  setUserProgress: (progress: UserProgress): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
      console.log('[Storage] Saved user progress:', progress.userName);
    } catch (e) {
      console.error('[Storage] setUserProgress error:', e);
    }
  },

  updateUserProgress: (updates: Partial<UserProgress>): void => {
    const current = storage.getUserProgress();
    if (current) {
      storage.setUserProgress({ ...current, ...updates });
    }
  },

  getLevels: (): Level[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.LEVELS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getLevels error:', e);
      return [];
    }
  },

  setLevels: (levels: Level[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.LEVELS, JSON.stringify(levels));
      console.log('[Storage] Saved levels:', levels.length);
    } catch (e) {
      console.error('[Storage] setLevels error:', e);
    }
  },

  updateLevel: (levelId: string, updates: Partial<Level>): void => {
    const levels = storage.getLevels();
    const updated = levels.map(l => l.id === levelId ? { ...l, ...updates } : l);
    storage.setLevels(updated);
  },

  completeLevel: (levelId: string, score: number): void => {
    const levels = storage.getLevels();
    const currentIdx = levels.findIndex(l => l.id === levelId);
    if (currentIdx >= 0) {
      levels[currentIdx] = {
        ...levels[currentIdx],
        completed: true,
        bestScore: Math.max(levels[currentIdx].bestScore || 0, score)
      };
      if (currentIdx + 1 < levels.length) {
        levels[currentIdx + 1] = {
          ...levels[currentIdx + 1],
          unlocked: true
        };
      }
      storage.setLevels(levels);

      const progress = storage.getUserProgress();
      if (progress) {
        const completedLevels = progress.completedLevels.includes(levelId)
          ? progress.completedLevels
          : [...progress.completedLevels, levelId];
        storage.setUserProgress({
          ...progress,
          completedLevels,
          currentLevel: levels[currentIdx + 1]?.id || null
        });
      }
    }
  },

  getMistakes: (): MistakeRecord[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.MISTAKES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getMistakes error:', e);
      return [];
    }
  },

  setMistakes: (mistakes: MistakeRecord[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.MISTAKES, JSON.stringify(mistakes));
      console.log('[Storage] Saved mistakes:', mistakes.length);
    } catch (e) {
      console.error('[Storage] setMistakes error:', e);
    }
  },

  addMistake: (mistake: MistakeRecord): void => {
    const mistakes = storage.getMistakes();
    const exists = mistakes.find(m => m.question.id === mistake.question.id);
    if (exists) {
      const updated = mistakes.map(m =>
        m.question.id === mistake.question.id ? mistake : m
      );
      storage.setMistakes(updated);
    } else {
      storage.setMistakes([mistake, ...mistakes]);
    }
  },

  markMistakeReviewed: (questionId: string): void => {
    const mistakes = storage.getMistakes();
    const updated = mistakes.map(m =>
      m.question.id === questionId ? { ...m, reviewed: true } : m
    );
    storage.setMistakes(updated);
  },

  removeMistake: (questionId: string): void => {
    const mistakes = storage.getMistakes();
    storage.setMistakes(mistakes.filter(m => m.question.id !== questionId));
  },

  getCurrentVersion: (): DepartmentType => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.CURRENT_VERSION);
      return data || 'all';
    } catch (e) {
      console.error('[Storage] getCurrentVersion error:', e);
      return 'all';
    }
  },

  setCurrentVersion: (version: DepartmentType): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.CURRENT_VERSION, version);
      console.log('[Storage] Saved current version:', version);
    } catch (e) {
      console.error('[Storage] setCurrentVersion error:', e);
    }
  },

  recordAnswer: (questionId: string, isCorrect: boolean, category: string, department: string): void => {
    try {
      const history = storage.getAnswerHistory();
      history.push({
        questionId,
        isCorrect,
        category,
        department,
        timestamp: Date.now()
      });
      Taro.setStorageSync(STORAGE_KEYS.ANSWER_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('[Storage] recordAnswer error:', e);
    }
  },

  getAnswerHistory: (): Array<{
    questionId: string;
    isCorrect: boolean;
    category: string;
    department: string;
    timestamp: number;
  }> => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.ANSWER_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  calculateDepartmentStats: () => {
    const history = storage.getAnswerHistory();

    const deptMap: { [key: string]: {
      total: number;
      correct: number;
      completed: Set<string>;
      categoryErrors: { [key: string]: { total: number; wrong: number } };
    } } = {};

    history.forEach(record => {
      const dept = record.department || 'unknown';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          total: 0,
          correct: 0,
          completed: new Set(),
          categoryErrors: {}
        };
      }
      deptMap[dept].total += 1;
      if (record.isCorrect) {
        deptMap[dept].correct += 1;
      }
      deptMap[dept].completed.add(record.questionId);

      const cat = record.category;
      if (!deptMap[dept].categoryErrors[cat]) {
        deptMap[dept].categoryErrors[cat] = { total: 0, wrong: 0 };
      }
      deptMap[dept].categoryErrors[cat].total += 1;
      if (!record.isCorrect) {
        deptMap[dept].categoryErrors[cat].wrong += 1;
      }
    });

    const result: { [key: string]: any } = {};
    Object.entries(deptMap).forEach(([name, data]) => {
      const categoryErrors: { [key: string]: number } = {};
      Object.entries(data.categoryErrors).forEach(([cat, stats]) => {
        if (stats.wrong > 0) {
          categoryErrors[cat] = stats.wrong;
        }
      });

      result[name] = {
        totalAnswered: data.total,
        totalCorrect: data.correct,
        completedLevels: data.completed.size,
        categoryErrors
      };
    });
    return result;
  },

  getMistakesFilter: (): string => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.MISTAKES_FILTER) || 'all';
    } catch (e) {
      return 'all';
    }
  },

  setMistakesFilter: (filter: string): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.MISTAKES_FILTER, filter);
    } catch (e) {
      console.error('[Storage] setMistakesFilter error:', e);
    }
  },

  recordLevelCompletion: (levelId: string, department: string, score: number): void => {
    try {
      const completionsKey = 'compliance_level_completions';
      let completions: Array<{ levelId: string; department: string; score: number; timestamp: number }> = [];
      try {
        const data = Taro.getStorageSync(completionsKey);
        completions = data ? JSON.parse(data) : [];
      } catch (e) { /* empty */ }
      completions.push({ levelId, department, score, timestamp: Date.now() });
      Taro.setStorageSync(completionsKey, JSON.stringify(completions));
    } catch (e) {
      console.error('[Storage] recordLevelCompletion error:', e);
    }
  },

  getLevelCompletions: (): Array<{ levelId: string; department: string; score: number; timestamp: number }> => {
    try {
      const data = Taro.getStorageSync('compliance_level_completions');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getTrainingTasks: (): TrainingTask[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.TRAINING_TASKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getTrainingTasks error:', e);
      return [];
    }
  },

  setTrainingTasks: (tasks: TrainingTask[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.TRAINING_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('[Storage] setTrainingTasks error:', e);
    }
  },

  addTrainingTask: (task: TrainingTask): void => {
    const tasks = storage.getTrainingTasks();
    storage.setTrainingTasks([task, ...tasks]);
  },

  deleteTrainingTask: (taskId: string): void => {
    const tasks = storage.getTrainingTasks();
    storage.setTrainingTasks(tasks.filter(t => t.id !== taskId));
  },

  getReviewRecords: (): ReviewRecord[] => {
    try {
      const data = Taro.getStorageSync(STORAGE_KEYS.REVIEW_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[Storage] getReviewRecords error:', e);
      return [];
    }
  },

  setReviewRecords: (records: ReviewRecord[]): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.REVIEW_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('[Storage] setReviewRecords error:', e);
    }
  },

  recordReview: (questionId: string, category: string, mastered: boolean): void => {
    const records = storage.getReviewRecords();
    const existing = records.find(r => r.questionId === questionId);
    if (existing) {
      const updated = records.map(r =>
        r.questionId === questionId
          ? { ...r, reviewCount: r.reviewCount + 1, lastMastered: mastered, lastReviewTime: Date.now() }
          : r
      );
      storage.setReviewRecords(updated);
    } else {
      storage.setReviewRecords([{
        questionId,
        category: category as any,
        reviewCount: 1,
        lastMastered: mastered,
        lastReviewTime: Date.now()
      }, ...records]);
    }
  },

  getMistakesTabAction: (): string => {
    try {
      return Taro.getStorageSync(STORAGE_KEYS.MISTAKES_TAB_ACTION) || '';
    } catch (e) {
      return '';
    }
  },

  setMistakesTabAction: (action: string): void => {
    try {
      Taro.setStorageSync(STORAGE_KEYS.MISTAKES_TAB_ACTION, action);
    } catch (e) {
      console.error('[Storage] setMistakesTabAction error:', e);
    }
  },

  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        Taro.removeStorageSync(key);
      });
      console.log('[Storage] All data cleared');
    } catch (e) {
      console.error('[Storage] clearAll error:', e);
    }
  }
};
