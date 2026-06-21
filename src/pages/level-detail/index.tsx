import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import QuestionCard from '@/components/QuestionCard';
import { getLevelById } from '@/data/levels';
import { QuestionOption, Level } from '@/types';

const LevelDetailPage: React.FC = () => {
  const router = useRouter();
  const levelId = router.params.levelId as string;
  const {
    currentQuestionIndex,
    answers,
    currentVersion,
    setCurrentLevel,
    submitAnswer,
    nextQuestion,
    resetCurrentLevel,
    getFilteredQuestions,
    completeCurrentLevel,
    levels
  } = useLearning();

  const [questions, setQuestions] = useState<ReturnType<typeof getFilteredQuestions>>([]);
  const [level, setLevel] = useState<Level | undefined>();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const currentCorrectRef = useRef(0);

  useEffect(() => {
    const qs = getFilteredQuestions(levelId);
    const lv = levels.find(l => l.id === levelId) || getLevelById(levelId);
    setQuestions(qs);
    setLevel(lv);
    setCurrentLevel(levelId);
    resetCurrentLevel();
    currentCorrectRef.current = 0;
    console.log('[LevelDetail] Loaded level:', levelId, 'version:', currentVersion, 'questions:', qs.length);
  }, [levelId, currentVersion, getFilteredQuestions, levels, setCurrentLevel, resetCurrentLevel]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (option: QuestionOption) => {
    setSelectedOptionId(option.id);
    setShowFeedback(true);
    submitAnswer(currentQuestion, option);
    if (option.isCorrect) {
      currentCorrectRef.current += 1;
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const correctCount = currentCorrectRef.current;
      const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

      if (level && score >= level.passingScore) {
        completeCurrentLevel(score);
      }

      Taro.redirectTo({
        url: `/pages/result/index?levelId=${levelId}&score=${score}&correct=${correctCount}&total=${questions.length}`
      });
    } else {
      nextQuestion();
      setSelectedOptionId(null);
      setShowFeedback(false);
    }
  };

  if (!currentQuestion || !level) {
    return (
      <View className={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.levelHeader}>
        <Text className={styles.levelOrder}>第 {level.order} 关 · {currentVersion !== 'all' ? `岗位版` : '通用版'}</Text>
        <Text className={styles.levelTitle}>{level.title}</Text>
        <Text className={styles.levelDesc}>{level.description}</Text>
      </View>

      <View className={styles.progressTracker}>
        <View className={styles.progressDots}>
          {questions.map((_, idx) => {
            let dotClass = '';
            if (idx < currentQuestionIndex) {
              const ans = answers[idx];
              dotClass = ans?.isCorrect ? 'correct' : 'wrong';
            } else if (idx === currentQuestionIndex) {
              dotClass = 'active';
            }
            return (
              <View
                key={idx}
                className={classnames(styles.progressDot, dotClass)}
              />
            );
          })}
        </View>
        <Text className={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <View className={styles.questionContainer}>
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          selectedOptionId={selectedOptionId}
          showFeedback={showFeedback}
          onSelectOption={handleSelectOption}
          onNext={handleNext}
          isLastQuestion={isLastQuestion}
        />
      </View>
    </ScrollView>
  );
};

export default LevelDetailPage;
