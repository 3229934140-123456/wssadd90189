import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useLearning } from '@/store/LearningContext';
import StatCard from '@/components/StatCard';
import LevelCard from '@/components/LevelCard';
import ProgressBar from '@/components/ProgressBar';
import { calculateGrade, getGradeColor } from '@/utils';
import { formatTimestamp } from '@/utils';

const HomePage: React.FC = () => {
  const { userProgress, mistakes, levels, getRealDepartmentStats, userDepartment, getActiveTasksForUser, getTaskCompletedCount, getLevelBestScore } = useLearning();

  const accuracy = userProgress.totalAnswered > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalAnswered) * 100)
    : 0;

  const overallPercent = userProgress.totalAnswered > 0
    ? Math.round((userProgress.totalScore / (userProgress.totalAnswered * 20)) * 100)
    : 0;

  const currentGrade = calculateGrade(overallPercent);

  const progressPercent = levels.length > 0
    ? Math.round((userProgress.completedLevels.length / levels.length) * 100)
    : 0;

  const allAvgCompletion = useMemo(() => {
    const realStats = getRealDepartmentStats() as { [key: string]: { totalAnswered: number; totalCorrect: number } };
    const totalAnswered = Object.values(realStats).reduce((sum, dept) => sum + (dept.totalAnswered || 0), 0);
    const totalCorrect = Object.values(realStats).reduce((sum, dept) => sum + (dept.totalCorrect || 0), 0);
    if (totalAnswered === 0) return 0;
    return Math.round((totalCorrect / totalAnswered) * 100);
  }, [getRealDepartmentStats]);

  const activeTasks = useMemo(() => getActiveTasksForUser(), [getActiveTasksForUser]);

  const handleLevelClick = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level || !level.unlocked) {
      Taro.showToast({ title: '请先完成上一关卡', icon: 'none' });
      return;
    }
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

  const nextUnlockedLevel = useMemo(() => {
    return levels.find(l => !l.completed && l.unlocked);
  }, [levels]);

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.headerSection}>
        <Text className={styles.greeting}>欢迎回来</Text>
        <Text className={styles.userName}>{userProgress.userName}</Text>
        <Text className={styles.userDept}>
          {userProgress.department} · 应对等级 <Text style={{ color: getGradeColor(currentGrade), fontWeight: '600' }}>{currentGrade}</Text>
        </Text>
        {userProgress.completedLevels.length > 0 && (
          <View style={{ marginTop: '16rpx', padding: '12rpx 20rpx', background: 'rgba(255,255,255,0.15)', borderRadius: '24rpx' }}>
            <Text style={{ fontSize: '24rpx', color: '#fff' }}>
              ✓ 已通关 {userProgress.completedLevels.length}/{levels.length} 关
            </Text>
          </View>
        )}
      </View>

      <View className={styles.statsRow}>
        <StatCard value={userProgress.totalScore} label="累计积分" color="primary" />
        <StatCard value={accuracy} label="正确率" unit="%" color="success" />
        <StatCard value={mistakes.length} label="错题数" unit="道" color="warning" />
      </View>

      {activeTasks.length > 0 && (
        <View className={styles.taskSection}>
          <Text className={styles.taskTitle}>📌 待完成培训任务</Text>
          {activeTasks.map(task => {
            const completedCount = getTaskCompletedCount(task.id, userDepartment);
            const pct = task.levelIds.length > 0 ? Math.round((completedCount / task.levelIds.length) * 100) : 0;
            return (
              <View key={task.id} className={styles.taskCard}>
                <View className={styles.taskCardHeader}>
                  <Text className={styles.taskCardTitle}>{task.title}</Text>
                  <Text className={styles.taskCardDeadline}>截止 {formatTimestamp(task.deadline).split(' ')[0]}</Text>
                </View>
                {task.description && <Text className={styles.taskCardDesc}>{task.description}</Text>}
                <View style={{ marginTop: '12rpx' }}>
                  <Text style={{ fontSize: '22rpx', color: '#64748B' }}>
                    分数线 {task.passingScore} 分 · 完成 {completedCount}/{task.levelIds.length} 关
                  </Text>
                </View>
                <View style={{ marginTop: '12rpx' }}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8rpx' }}>
                    <Text style={{ fontSize: '24rpx', color: '#64748B' }}>
                      进度 {completedCount}/{task.levelIds.length}
                    </Text>
                    <Text style={{ fontSize: '24rpx', color: '#1E40AF', fontWeight: '500' }}>{pct}%</Text>
                  </View>
                  <ProgressBar percent={pct} variant="success" />
                </View>
                <View style={{ marginTop: '16rpx', display: 'flex', gap: '12rpx', flexWrap: 'wrap' }}>
                  {task.levelIds.map(lid => {
                    const lv = levels.find(l => l.id === lid);
                    const score = getLevelBestScore(lid, userDepartment);
                    const passed = score >= task.passingScore;
                    return (
                      <View
                        key={lid}
                        className={styles.taskLevelTag}
                        style={{ opacity: passed ? 1 : 0.8 }}
                        onClick={() => lv && lv.unlocked && Taro.navigateTo({ url: `/pages/level-detail/index?levelId=${lid}` })}
                      >
                        <Text style={{ color: passed ? '#10B981' : lv?.unlocked ? '#1E40AF' : '#94A3B8', fontSize: '22rpx', display: 'block' }}>
                          {passed ? '✓ ' : lv?.unlocked ? '' : '🔒 '}{lv?.title || lid}
                        </Text>
                        {score > 0 && (
                          <Text style={{ fontSize: '20rpx', color: passed ? '#10B981' : '#F59E0B', marginTop: '2rpx', display: 'block' }}>
                            {score}分{passed ? ' 达标' : ''}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      )}

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
            {progressPercent}%
          </Text>
        </View>
        <View className={styles.progressItem}>
          <View className={styles.progressItemLabel}>
            <Text className={styles.progressItemText}>整体通关进度</Text>
            <Text className={styles.progressItemPercent}>
              {userProgress.completedLevels.length}/{levels.length} 关
            </Text>
          </View>
          <ProgressBar percent={progressPercent} variant="success" />
        </View>
        <View style={{ height: '24rpx' }} />
        <View className={styles.progressItem}>
          <View className={styles.progressItemLabel}>
            <Text className={styles.progressItemText}>全员平均进度</Text>
            <Text className={styles.progressItemPercent}>{allAvgCompletion}%</Text>
          </View>
          <ProgressBar percent={allAvgCompletion} variant="default" />
        </View>
      </View>

      {nextUnlockedLevel && (
        <View className={styles.nextLevelHint} onClick={() => handleLevelClick(nextUnlockedLevel.id)}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: '26rpx', color: '#F59E0B', fontWeight: '600', marginBottom: '4rpx' }}>
              🎯 继续挑战
            </Text>
            <Text style={{ fontSize: '28rpx', color: '#0F172A', fontWeight: '600' }}>
              下一关：{nextUnlockedLevel.title}
            </Text>
          </View>
          <Text style={{ fontSize: '26rpx', color: '#1E40AF', fontWeight: '500' }}>开始 →</Text>
        </View>
      )}

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
        {levels.slice(0, 3).map(level => (
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
