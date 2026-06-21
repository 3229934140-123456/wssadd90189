import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import Taro from '@tarojs/taro';
import {
  UserProgress,
  MistakeRecord,
  UserAnswer,
  Question,
  QuestionOption,
  Level,
  DepartmentType,
  KnowledgeCategory
} from '@/types';
import { QUESTIONS as DEFAULT_QUESTIONS } from '@/data/questions';
import { LEVELS as DEFAULT_LEVELS } from '@/data/levels';
import { USER_PROGRESS as DEFAULT_USER_PROGRESS } from '@/data/userStats';
import { storage } from '@/utils/storage';

interface LearningContextType {
  userProgress: UserProgress;
  currentLevelId: string | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  mistakes: MistakeRecord[];
  questions: Question[];
  levels: Level[];
  currentVersion: DepartmentType;
  currentLevelAnswers: { questionId: string; isCorrect: boolean; category: KnowledgeCategory }[];

  setCurrentLevel: (levelId: string) => void;
  submitAnswer: (question: Question, selectedOption: QuestionOption) => boolean;
  nextQuestion: () => void;
  resetCurrentLevel: () => void;
  markMistakeReviewed: (questionId: string) => void;
  clearAllMistakes: () => void;
  getMistakeStats: () => { [key: string]: number };
  completeCurrentLevel: (score: number) => void;

  setCurrentVersion: (version: DepartmentType) => void;
  getFilteredQuestions: (levelId: string) => Question[];

  addQuestion: (question: Question) => void;
  updateQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;

  getWeakKnowledge: () => { category: KnowledgeCategory; errorCount: number; errorRate: number }[];
  getRealDepartmentStats: () => any[];
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = storage.getUserProgress();
    return saved || DEFAULT_USER_PROGRESS;
  });

  const [levels, setLevels] = useState<Level[]>(() => {
    const saved = storage.getLevels();
    if (saved && saved.length > 0) return saved;
    return DEFAULT_LEVELS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = storage.getQuestions();
    if (saved && saved.length > 0) return saved;
    return DEFAULT_QUESTIONS;
  });

  const [mistakes, setMistakes] = useState<MistakeRecord[]>(() => {
    return storage.getMistakes();
  });

  const [currentVersion, setCurrentVersionState] = useState<DepartmentType>(() => {
    return storage.getCurrentVersion();
  });

  const [currentLevelId, setCurrentLevelIdState] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentLevelAnswers, setCurrentLevelAnswers] = useState<{
    questionId: string;
    isCorrect: boolean;
    category: KnowledgeCategory;
  }[]>([]);

  useEffect(() => {
    if (questions.length > 0) {
      storage.setQuestions(questions);
    }
  }, [questions]);

  useEffect(() => {
    if (levels.length > 0) {
      storage.setLevels(levels);
    }
  }, [levels]);

  useEffect(() => {
    storage.setMistakes(mistakes);
  }, [mistakes]);

  useEffect(() => {
    storage.setUserProgress(userProgress);
  }, [userProgress]);

  useEffect(() => {
    storage.setCurrentVersion(currentVersion);
  }, [currentVersion]);

  const setCurrentLevel = useCallback((levelId: string) => {
    setCurrentLevelIdState(levelId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentLevelAnswers([]);
    console.log('[Learning] Set current level:', levelId, 'version:', currentVersion);
  }, [currentVersion]);

  const getFilteredQuestions = useCallback((levelId: string): Question[] => {
    const levelQuestions = questions.filter(q => q.levelId === levelId);
    if (currentVersion === 'all') {
      return levelQuestions;
    }
    const deptQuestions = levelQuestions.filter(q =>
      q.department === currentVersion || q.department === 'all'
    );
    const deptSpecific = levelQuestions.filter(q => q.department === currentVersion);
    const generic = levelQuestions.filter(q => q.department === 'all');
    const result = [...deptSpecific, ...generic].slice(0, Math.max(3, deptQuestions.length));
    console.log('[Learning] Filtered questions for', currentVersion, ':', result.length, 'of', levelQuestions.length);
    return result.length > 0 ? result : levelQuestions;
  }, [questions, currentVersion]);

  const submitAnswer = useCallback((question: Question, selectedOption: QuestionOption): boolean => {
    const isCorrect = selectedOption.isCorrect;
    const answer: UserAnswer = {
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      isCorrect,
      timestamp: Date.now()
    };
    setAnswers(prev => [...prev, answer]);
    setCurrentLevelAnswers(prev => [...prev, {
      questionId: question.id,
      isCorrect,
      category: question.knowledgeCategory
    }]);

    storage.recordAnswer(question.id, isCorrect, question.knowledgeCategory, currentVersion);

    if (!isCorrect) {
      const mistake: MistakeRecord = {
        question,
        selectedOptionId: selectedOption.id,
        correctOptionId: question.correctAnswerId,
        timestamp: Date.now(),
        reviewed: false
      };
      setMistakes(prev => {
        const exists = prev.find(m => m.question.id === question.id);
        let updated;
        if (exists) {
          updated = prev.map(m => m.question.id === question.id ? mistake : m);
        } else {
          updated = [mistake, ...prev];
        }
        return updated;
      });
      console.log('[Learning] Wrong answer recorded:', question.id);
    } else {
      setMistakes(prev => prev.filter(m => m.question.id !== question.id));
    }

    setUserProgress(prev => {
      const newProgress = {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        totalScore: prev.totalScore + (isCorrect ? 20 : 0)
      };
      return newProgress;
    });

    return isCorrect;
  }, [currentVersion]);

  const completeCurrentLevel = useCallback((score: number) => {
    if (!currentLevelId) return;

    const newLevels = [...levels];
    const currentIdx = newLevels.findIndex(l => l.id === currentLevelId);
    if (currentIdx >= 0) {
      newLevels[currentIdx] = {
        ...newLevels[currentIdx],
        completed: true,
        bestScore: Math.max(newLevels[currentIdx].bestScore || 0, score)
      };
      if (currentIdx + 1 < newLevels.length) {
        newLevels[currentIdx + 1] = {
          ...newLevels[currentIdx + 1],
          unlocked: true
        };
      }
      setLevels(newLevels);

      setUserProgress(prev => {
        const completedLevels = prev.completedLevels.includes(currentLevelId)
          ? prev.completedLevels
          : [...prev.completedLevels, currentLevelId];
        return {
          ...prev,
          completedLevels,
          currentLevel: newLevels[currentIdx + 1]?.id || null
        };
      });
    }
    console.log('[Learning] Level completed:', currentLevelId, 'score:', score);
    Taro.showToast({ title: '进度已保存', icon: 'success' });
  }, [currentLevelId, levels]);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const resetCurrentLevel = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentLevelAnswers([]);
    console.log('[Learning] Reset current level');
  }, []);

  const markMistakeReviewed = useCallback((questionId: string) => {
    setMistakes(prev => prev.map(m =>
      m.question.id === questionId ? { ...m, reviewed: true } : m
    ));
    storage.markMistakeReviewed(questionId);
  }, []);

  const clearAllMistakes = useCallback(() => {
    setMistakes([]);
  }, []);

  const setCurrentVersion = useCallback((version: DepartmentType) => {
    setCurrentVersionState(version);
    console.log('[Learning] Version changed:', version);
  }, []);

  const getMistakeStats = useCallback(() => {
    const stats: { [key: string]: number } = {};
    mistakes.forEach(m => {
      const cat = m.question.knowledgeCategory;
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [mistakes]);

  const getWeakKnowledge = useCallback(() => {
    const categoryStats: { [key in KnowledgeCategory]?: { correct: number; wrong: number } } = {};

    currentLevelAnswers.forEach(ans => {
      if (!categoryStats[ans.category]) {
        categoryStats[ans.category] = { correct: 0, wrong: 0 };
      }
      if (ans.isCorrect) {
        categoryStats[ans.category]!.correct += 1;
      } else {
        categoryStats[ans.category]!.wrong += 1;
      }
    });

    const allHistory = storage.getAnswerHistory();
    allHistory.forEach(h => {
      const cat = h.category as KnowledgeCategory;
      if (!categoryStats[cat]) {
        categoryStats[cat] = { correct: 0, wrong: 0 };
      }
      if (h.isCorrect) {
        categoryStats[cat]!.correct += 1;
      } else {
        categoryStats[cat]!.wrong += 1;
      }
    });

    return Object.entries(categoryStats)
      .filter(([_, stats]) => stats && stats.wrong > 0)
      .map(([category, stats]) => ({
        category: category as KnowledgeCategory,
        errorCount: stats!.wrong,
        errorRate: Math.round((stats!.wrong / (stats!.correct + stats!.wrong)) * 100)
      }))
      .sort((a, b) => b.errorCount - a.errorCount);
  }, [currentLevelAnswers]);

  const addQuestion = useCallback((question: Question) => {
    setQuestions(prev => {
      const exists = prev.find(q => q.id === question.id);
      if (exists) {
        return prev.map(q => q.id === question.id ? question : q);
      }
      return [...prev, question];
    });
    console.log('[Learning] Question added:', question.id);
  }, []);

  const updateQuestion = useCallback((question: Question) => {
    setQuestions(prev => prev.map(q => q.id === question.id ? question : q));
    console.log('[Learning] Question updated:', question.id);
  }, []);

  const deleteQuestion = useCallback((questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setMistakes(prev => prev.filter(m => m.question.id !== questionId));
    console.log('[Learning] Question deleted:', questionId);
  }, []);

  const getRealDepartmentStats = useCallback(() => {
    return storage.calculateDepartmentStats();
  }, []);

  return (
    <LearningContext.Provider value={{
      userProgress,
      currentLevelId,
      currentQuestionIndex,
      answers,
      mistakes,
      questions,
      levels,
      currentVersion,
      currentLevelAnswers,
      setCurrentLevel,
      submitAnswer,
      nextQuestion,
      resetCurrentLevel,
      markMistakeReviewed,
      clearAllMistakes,
      getMistakeStats,
      completeCurrentLevel,
      setCurrentVersion,
      getFilteredQuestions,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      getWeakKnowledge,
      getRealDepartmentStats
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within LearningProvider');
  }
  return context;
};
