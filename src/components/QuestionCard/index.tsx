import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { Question, QuestionOption } from '@/types';
import { getRiskLabel } from '@/utils';
import KnowledgeTag from '@/components/KnowledgeTag';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  showFeedback: boolean;
  onSelectOption: (option: QuestionOption) => void;
  onNext?: () => void;
  isLastQuestion?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOptionId,
  showFeedback,
  onSelectOption,
  onNext,
  isLastQuestion
}) => {
  const getOptionClass = (option: QuestionOption) => {
    if (!showFeedback) {
      return selectedOptionId === option.id ? 'selected' : '';
    }
    if (option.isCorrect) return 'correct';
    if (selectedOptionId === option.id && !option.isCorrect) return 'wrong';
    return '';
  };

  const selectedOption = question.options.find(o => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect;

  return (
    <View className={styles.questionCard}>
      <View className={styles.questionHeader}>
        <View className={styles.questionMeta}>
          <Text className={styles.questionNumber}>第 {questionIndex + 1}/{totalQuestions} 题</Text>
          <KnowledgeTag category={question.knowledgeCategory} variant="info" />
        </View>
        <Text className={styles.questionTitle}>{question.title}</Text>
      </View>

      <View className={styles.questionScenario}>
        <Text>{question.scenario}</Text>
      </View>

      <View className={styles.optionsList}>
        {question.options.map((option, idx) => (
          <View
            key={option.id}
            className={classnames(
              styles.optionItem,
              getOptionClass(option),
              showFeedback && styles.disabled
            )}
            onClick={() => !showFeedback && onSelectOption(option)}
          >
            <View className={styles.optionHeader}>
              <Text className={styles.optionLabel}>{String.fromCharCode(65 + idx)}</Text>
              <Text className={styles.optionText}>{option.text}</Text>
              {showFeedback && (
                <Text className={classnames(styles.optionRisk, styles[option.riskLevel])}>
                  {getRiskLabel(option.riskLevel)}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {showFeedback && selectedOption && (
        <View className={styles.feedbackSection}>
          <View className={classnames(styles.feedbackCard, isCorrect ? 'correct' : 'wrong')}>
            <Text className={classnames(styles.feedbackTitle, isCorrect ? 'correct' : 'wrong')}>
              <Text className={styles.feedbackTitleIcon}>{isCorrect ? '✓' : '✗'}</Text>
              {isCorrect ? '回答正确！风险控制得当' : '回答错误！存在风险隐患'}
            </Text>
            <Text className={styles.feedbackContent}>{selectedOption.riskExplanation}</Text>
            <View className={styles.caseReference}>
              <Text className={styles.caseLabel}>📚 案例参考</Text>
              <Text className={styles.caseContent}>{selectedOption.caseReference}</Text>
            </View>
          </View>

          {onNext && (
            <Button
              className={styles.nextButton}
              onClick={onNext}
            >
              {isLastQuestion ? '查看闯关结果' : '下一题'}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

export default QuestionCard;
