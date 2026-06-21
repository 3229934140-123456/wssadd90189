import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProgress, MistakeRecord, UserAnswer, Question, QuestionOption } from '@/types';
import { USER_PROGRESS } from '@/data/userStats';

interface LearningContextType {
  userProgress: UserProgress;
  currentLevelId: string | null;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  mistakes: MistakeRecord[];
  setCurrentLevel: (levelId: string) => void;
  submitAnswer: (question: Question, selectedOption: QuestionOption) => boolean;
  nextQuestion: () => void;
  resetCurrentLevel: () => void;
  markMistakeReviewed: (questionId: string) => void;
  clearAllMistakes: () => void;
  getMistakeStats: () => { [key: string]: number };
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>(USER_PROGRESS);
  const [currentLevelId, setCurrentLevelIdState] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>(USER_PROGRESS.mistakes);

  const setCurrentLevel = useCallback((levelId: string) => {
    setCurrentLevelIdState(levelId);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    console.log('[Learning] Set current level:', levelId);
  }, []);

  const submitAnswer = useCallback((question: Question, selectedOption: QuestionOption): boolean => {
    const isCorrect = selectedOption.isCorrect;
    const answer: UserAnswer = {
      questionId: question.id,
      selectedOptionId: selectedOption.id,
      isCorrect,
      timestamp: Date.now()
    };
    setAnswers(prev => [...prev, answer]);

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
        if (exists) {
          return prev.map(m => m.question.id === question.id ? mistake : m);
        }
        return [mistake, ...prev];
      });
      console.log('[Learning] Wrong answer recorded:', question.id);
    }

    setUserProgress(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      totalScore: prev.totalScore + (isCorrect ? 20 : 0)
    }));

    return isCorrect;
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const resetCurrentLevel = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    console.log('[Learning] Reset current level');
  }, []);

  const markMistakeReviewed = useCallback((questionId: string) => {
    setMistakes(prev => prev.map(m => 
      m.question.id === questionId ? { ...m, reviewed: true } : m
    ));
  }, []);

  const clearAllMistakes = useCallback(() => {
    setMistakes([]);
  }, []);

  const getMistakeStats = useCallback(() => {
    const stats: { [key: string]: number } = {};
    mistakes.forEach(m => {
      const cat = m.question.knowledgeCategory;
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [mistakes]);

  return (
    <LearningContext.Provider value={{
      userProgress,
      currentLevelId,
      currentQuestionIndex,
      answers,
      mistakes,
      setCurrentLevel,
      submitAnswer,
      nextQuestion,
      resetCurrentLevel,
      markMistakeReviewed,
      clearAllMistakes,
      getMistakeStats
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
