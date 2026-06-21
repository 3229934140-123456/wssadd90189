import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useLearning } from '@/store/LearningContext';
import StatCard from '@/components/StatCard';
import LevelCard from '@/components/LevelCard';
import ProgressBar from '@/components/ProgressBar';
import { LEVELS } from '@/data/levels';
import { COMPANY_OVERALL_STATS } from '@/data/userStats';
import { calculateGrade, getGradeColor } from '@/utils';

const HomePage: React.FC = () => {
  const { userProgress, mistakes } = useLearning();

  const accuracy = userProgress.totalAnswered > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalAnswered) * 100)
    : 0;

  const currentGrade = calculateGrade(userProgress.totalScore > 0 ? (userProgress.totalScore / (userProgress.totalAnswered * 20)) * 100 : 0);

  const handleLevelClick = (levelId: string) => {
    Taro.navigateTo({ url: `/pages/level-detail/index?levelId=${levelId}` });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'challenge':
        Taro.switchTab({ url: '/pages/challenge/index' });
        break;
      case 'mistakes':
        Taro.switchTab({ url: '/pages/mistakes/index' });
        break;
      case 'stats':
        Taro.switchTab({ url: '/pages/stats/index' });
        break;
      case 'admin':
        Taro.navigateTo({ url: '/pages/admin/index' });
        break;
    }
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.headerSection}>
        <Text className={styles.greeting}>欢迎回来</Text>
        <Text className={styles.userName}>{userProgress.userName}</Text>
        <Text className={styles.userDept}>
          {userProgress.department} · 应对等级 <Text style={{ color: getGradeColor(currentGrade), fontWeight: '600' }}>{currentGrade}</Text>
        </Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard value={userProgress.totalScore} label="累计积分" color="primary" />
        <StatCard value={accuracy} label="正确率" unit="%" color="success" />
        <StatCard value={mistakes.length} label="错题数" unit="道" color="warning" />
      </View>

      <View className={styles.noticeCard}>
        <Text className={styles.noticeIcon}>📢</Text>
        <Text className={styles.noticeText}>
          本月合规培训截止日期：6月30日，请尽快完成剩余关卡
        </Text>
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>我的学习进度</Text>
          <Text className={styles.progressValue}>
            {Math.round((userProgress.completedLevels.length / LEVELS.length) * 100)}%
          </Text>
        </View>
        <View className={styles.progressItem}>
          <View className={styles.progressItemLabel}>
            <Text className={styles.progressItemText}>整体通关进度</Text>
            <Text className={styles.progressItemPercent}>
              {userProgress.completedLevels.length}/{LEVELS.length} 关
            </Text>
          </View>
          <ProgressBar percent={(userProgress.completedLevels.length / LEVELS.length) * 100} variant="primary" />
        </View>
        <View style={{ height: '24rpx' }} />
        <View className={styles.progressItem}>
          <View className={styles.progressItemLabel}>
            <Text className={styles.progressItemText}>全员平均进度</Text>
            <Text className={styles.progressItemPercent}>{COMPANY_OVERALL_STATS.overallCompletionRate}%</Text>
          </View>
          <ProgressBar percent={COMPANY_OVERALL_STATS.overallCompletionRate} variant="info" />
        </View>
      </View>

      <View className={styles.quickActions}>
        <View className={styles.quickActionCard} onClick={() => handleQuickAction('challenge')}>
          <Text className={styles.quickActionIcon}>🎯</Text>
          <Text className={styles.quickActionTitle}>继续闯关</Text>
          <Text className={styles.quickActionDesc}>完成下一个情景关卡</Text>
        </View>
        <View className={styles.quickActionCard} onClick={() => handleQuickAction('mistakes')}>
          <Text className={styles.quickActionIcon}>📝</Text>
          <Text className={styles.quickActionTitle}>错题复盘</Text>
          <Text className={styles.quickActionDesc}>{mistakes.length} 道题目待复习</Text>
        </View>
        <View className={styles.quickActionCard} onClick={() => handleQuickAction('stats')}>
          <Text className={styles.quickActionIcon}>📊</Text>
          <Text className={styles.quickActionTitle}>数据分析</Text>
          <Text className={styles.quickActionDesc}>个人 & 部门统计</Text>
        </View>
        <View className={styles.quickActionCard} onClick={() => handleQuickAction('admin')}>
          <Text className={styles.quickActionIcon}>⚙️</Text>
          <Text className={styles.quickActionTitle}>管理后台</Text>
          <Text className={styles.quickActionDesc}>题库 & 版本管理</Text>
        </View>
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>最近关卡</Text>
        <Text className={styles.sectionTitleMore} onClick={() => Taro.switchTab({ url: '/pages/challenge/index' })}>
          查看全部 →
        </Text>
      </View>

      <View className={styles.recentLevels}>
        {LEVELS.slice(0, 3).map(level => (
          <LevelCard
            key={level.id}
            level={level}
            onClick={() => handleLevelClick(level.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomePage;
