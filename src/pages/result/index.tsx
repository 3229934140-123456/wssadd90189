import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import { getLevelById, getNextLevel } from '@/data/levels';
import { calculateGrade, getGradeColor } from '@/utils';
import { CATEGORY_KNOWLEDGE, KnowledgeCategory } from '@/types';
import KnowledgeTag from '@/components/KnowledgeTag';

const gradeDescriptions: Record<string, string> = {
  S: '表现卓越，应对能力非常出色',
  A: '表现优秀，具备良好的风险意识',
  B: '表现良好，继续保持和加强',
  C: '刚刚及格，需要加强学习',
  D: '需要努力，建议重新闯关学习'
};

const ResultPage: React.FC = () => {
  const router = useRouter();
  const levelId = router.params.levelId as string;
  const score = parseInt(router.params.score as string) || 0;
  const correct = parseInt(router.params.correct as string) || 0;
  const total = parseInt(router.params.total as string) || 0;

  const { getWeakKnowledge, currentLevelAnswers, levels } = useLearning();
  const [level, setLevel] = useState(getLevelById(levelId));
  const [nextLevel, setNextLevel] = useState(getNextLevel(levelId));

  const wrong = total - correct;
  const isPassed = level ? score >= level.passingScore : false;
  const grade = calculateGrade(score);
  const scoreVariant = isPassed ? (score >= 90 ? 'success' : 'warning') : 'danger';

  const weakKnowledge = useMemo(() => {
    return getWeakKnowledge();
  }, [getWeakKnowledge, currentLevelAnswers]);

  useEffect(() => {
    const lv = levels.find(l => l.id === levelId) || getLevelById(levelId);
    const next = levels.find((_, idx) => {
      const currentIdx = levels.findIndex(l => l.id === levelId);
      return idx === currentIdx + 1;
    }) || getNextLevel(levelId);
    setLevel(lv);
    setNextLevel(next);
    console.log('[Result] Weak knowledge:', weakKnowledge);
  }, [levelId, levels, weakKnowledge]);

  const handleRetry = () => {
    Taro.redirectTo({ url: `/pages/level-detail/index?levelId=${levelId}` });
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      Taro.redirectTo({ url: `/pages/level-detail/index?levelId=${nextLevel.id}` });
    }
  };

  const handleBackToHome = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  const handleViewMistakes = () => {
    Taro.switchTab({ url: '/pages/mistakes/index' });
  };

  const handleViewCategoryMistakes = (category: KnowledgeCategory) => {
    Taro.switchTab({
      url: `/pages/mistakes/index?category=${category}`
    });
  };

  if (!level) {
    return <View className={styles.container}><Text>加载中...</Text></View>;
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.resultHeader}>
        <Text className={styles.resultIcon}>{isPassed ? '🎉' : '💪'}</Text>
        <Text className={styles.resultTitle}>
          {isPassed ? '闯关成功！' : '继续加油！'}
        </Text>
        <Text className={styles.resultSubtitle}>{level.title} - 挑战完成</Text>
      </View>

      <View className={styles.scoreCard}>
        <Text className={classnames(styles.scoreValue, styles[scoreVariant])}>{score}</Text>
        <Text className={styles.scoreLabel}>本次得分（满分100）</Text>
        <View className={styles.scoreBreakdown}>
          <View className={styles.breakdownItem}>
            <Text className={classnames(styles.breakdownValue, styles.correct)}>{correct}</Text>
            <Text className={styles.breakdownLabel}>答对</Text>
          </View>
          <View className={styles.breakdownItem}>
            <Text className={classnames(styles.breakdownValue, styles.wrong)}>{wrong}</Text>
            <Text className={styles.breakdownLabel}>答错</Text>
          </View>
          <View className={styles.breakdownItem}>
            <Text className={styles.breakdownValue}>{total}</Text>
            <Text className={styles.breakdownLabel}>总题数</Text>
          </View>
        </View>
      </View>

      <View className={styles.resultDetail}>
        <Text className={styles.detailTitle}>结果详情</Text>

        <View className={classnames(styles.passCondition, isPassed ? 'pass' : 'fail')}>
          <Text className={styles.passIcon}>{isPassed ? '✅' : '⚠️'}</Text>
          <Text className={styles.passText}>
            {isPassed
              ? `恭喜通过！通关线 ${level.passingScore} 分`
              : `未达到通关线 ${level.passingScore} 分，建议复习后重新挑战`}
          </Text>
        </View>

        <View className={styles.gradeSection}>
          <Text className={styles.gradeLabel}>能力评级</Text>
          <View className={styles.gradeDisplay}>
            <View className={styles.gradeBadge} style={{ background: getGradeColor(grade) }}>
              <Text>{grade}</Text>
            </View>
            <View className={styles.gradeInfo}>
              <Text className={styles.gradeName} style={{ color: getGradeColor(grade) }}>
                {grade}级
              </Text>
              <Text className={styles.gradeDesc}>{gradeDescriptions[grade]}</Text>
            </View>
          </View>
        </View>

        {weakKnowledge.length > 0 && (
          <View className={styles.weakSection}>
            <Text className={styles.detailTitle} style={{ marginTop: '16rpx' }}>
              薄弱知识点
            </Text>
            <Text className={styles.weakDesc}>
              以下知识点错误率较高，建议重点复习：
            </Text>
            <View className={styles.weakList}>
              {weakKnowledge.slice(0, 5).map(wk => {
                const catInfo = CATEGORY_KNOWLEDGE.find(c => c.key === wk.category);
                return (
                  <View
                    key={wk.category}
                    className={styles.weakItem}
                    onClick={() => handleViewCategoryMistakes(wk.category)}
                  >
                    <View className={styles.weakItemLeft}>
                      <KnowledgeTag category={wk.category} variant="warning" />
                      <Text className={styles.weakItemName}>{catInfo?.name}</Text>
                    </View>
                    <View className={styles.weakItemRight}>
                      <Text className={styles.weakErrorRate}>错误率 {wk.errorRate}%</Text>
                      <Text className={styles.weakGoReview}>去复习 →</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {isPassed && nextLevel && (
          <View className={styles.unlockHint}>
            <Text className={styles.unlockText}>
              🎊 已解锁下一关卡：「{nextLevel.title}」，继续挑战吧！
            </Text>
          </View>
        )}

        {wrong > 0 && (
          <View style={{ marginTop: '24rpx', padding: '24rpx', background: '#FEF2F2', borderRadius: '12rpx', borderLeft: '4rpx solid #EF4444' }}>
            <Text style={{ fontSize: '26rpx', color: '#EF4444' }}>
              💡 本次答错的 {wrong} 道题已加入错题本，建议复习巩固
            </Text>
          </View>
        )}
      </View>

      <View className={styles.actionButtons}>
        {isPassed && nextLevel && (
          <Button
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={handleNextLevel}
          >
            挑战下一关
          </Button>
        )}
        {!isPassed && (
          <Button
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={handleRetry}
          >
            重新挑战本关
          </Button>
        )}
        {wrong > 0 && (
          <Button
            className={classnames(styles.actionBtn, styles.secondary)}
            onClick={handleViewMistakes}
          >
            查看错题解析
          </Button>
        )}
        <Button
          className={classnames(styles.actionBtn, styles.ghost)}
          onClick={handleBackToHome}
        >
          返回首页
        </Button>
      </View>
    </ScrollView>
  );
};

export default ResultPage;
