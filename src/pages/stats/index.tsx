import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import KnowledgeTag from '@/components/KnowledgeTag';
import { CATEGORY_KNOWLEDGE, KnowledgeCategory } from '@/types';
import { DEPARTMENT_STATS, COMPANY_OVERALL_STATS } from '@/data/userStats';
import { LEVELS } from '@/data/levels';
import { calculateGrade, getGradeColor } from '@/utils';

const gradeDescriptions: Record<string, string> = {
  S: '卓越级：应对能力出色，可作为部门合规标杆',
  A: '优秀级：具备良好的风险识别和应对能力',
  B: '良好级：掌握基础应对流程，部分场景需加强',
  C: '合格级：存在明显知识盲区，需重点复习',
  D: '待提升：应对能力薄弱，建议重新学习所有关卡'
};

const StatsPage: React.FC = () => {
  const { userProgress, getMistakeStats } = useLearning();
  const [viewMode, setViewMode] = useState<'personal' | 'department'>('personal');

  const accuracy = userProgress.totalAnswered > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalAnswered) * 100)
    : 0;

  const overallPercent = userProgress.totalAnswered > 0
    ? Math.round((userProgress.totalScore / (userProgress.totalAnswered * 20)) * 100)
    : 0;

  const grade = calculateGrade(overallPercent);

  const knowledgeStats = useMemo(() => {
    const mistakesByCategory = getMistakeStats();
    return CATEGORY_KNOWLEDGE.map(cat => {
      const mistakes = mistakesByCategory[cat.key] || 0;
      const mastery = Math.max(0, 100 - mistakes * 20);
      return {
        ...cat,
        mistakes,
        mastery
      };
    }).sort((a, b) => a.mastery - b.mastery);
  }, [getMistakeStats]);

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>学习数据</Text>
        <Text className={styles.headerDesc}>个人能力评估 & 部门整体分析</Text>
        <View className={styles.viewTabs}>
          <View
            className={classnames(styles.viewTab, viewMode === 'personal' && styles.active)}
            onClick={() => setViewMode('personal')}
          >
            <Text>个人报告</Text>
          </View>
          <View
            className={classnames(styles.viewTab, viewMode === 'department' && styles.active)}
            onClick={() => setViewMode('department')}
          >
            <Text>部门分析</Text>
          </View>
        </View>
      </View>

      {viewMode === 'personal' ? (
        <View className={styles.personalSection}>
          <View className={styles.statsGrid}>
            <StatCard value={userProgress.totalScore} label="累计积分" color="primary" />
            <StatCard value={accuracy} label="正确率" unit="%" color="success" />
            <StatCard value={userProgress.totalAnswered} label="已答题" unit="道" color="warning" />
            <StatCard value={userProgress.completedLevels.length} label="通关数" unit="关" color="primary" />
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🏆</Text>
              应对能力等级
            </Text>
            <View className={styles.gradeDisplay}>
              <View className={styles.gradeCircle} style={{ background: getGradeColor(grade) }}>
                <Text>{grade}</Text>
              </View>
              <View className={styles.gradeInfo}>
                <Text className={styles.gradeLabel}>综合评级</Text>
                <Text className={styles.gradeName} style={{ color: getGradeColor(grade) }}>
                  {grade}级
                </Text>
                <Text className={styles.gradeDesc}>{gradeDescriptions[grade]}</Text>
              </View>
            </View>

            <View style={{ marginBottom: '16rpx' }}>
              <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8rpx' }}>
                <Text style={{ fontSize: '28rpx', color: '#475569' }}>综合得分</Text>
                <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#1E40AF' }}>{overallPercent}分</Text>
              </View>
              <ProgressBar percent={overallPercent} variant="primary" />
            </View>
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📊</Text>
              知识点掌握度
            </Text>
            {knowledgeStats.map((ks, idx) => (
              <View key={ks.key} className={styles.knowledgeBar}>
                <View className={styles.knowledgeBarHeader}>
                  <Text className={styles.knowledgeBarName}>
                    {idx + 1}. {ks.name}
                    {ks.mistakes > 0 && (
                      <Text style={{ color: '#EF4444', marginLeft: '8rpx', fontSize: '22rpx' }}>
                        ({ks.mistakes}道错题)
                      </Text>
                    )}
                  </Text>
                  <Text
                    className={styles.knowledgeBarPercent}
                    style={{ color: ks.mastery >= 70 ? '#10B981' : ks.mastery >= 50 ? '#F59E0B' : '#EF4444' }}
                  >
                    {ks.mastery}%
                  </Text>
                </View>
                <ProgressBar
                  percent={ks.mastery}
                  variant={ks.mastery >= 70 ? 'success' : ks.mastery >= 50 ? 'warning' : 'danger'}
                />
              </View>
            ))}
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>💡</Text>
              待补知识点
            </Text>
            {knowledgeStats.filter(k => k.mastery < 70).length === 0 ? (
              <Text style={{ fontSize: '28rpx', color: '#94A3B8', textAlign: 'center', padding: '32rpx 0' }}>
                🎉 所有知识点掌握良好，继续保持！
              </Text>
            ) : (
              <View style={{ display: 'flex', flexWrap: 'wrap', gap: '16rpx' }}>
                {knowledgeStats
                  .filter(k => k.mastery < 70)
                  .map(k => (
                    <KnowledgeTag key={k.key} category={k.key as KnowledgeCategory} variant="warning" />
                  ))}
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={{ marginTop: '32rpx' }}>
          <View className={styles.sectionCard}>
            <View className={styles.companyHeader}>
              <View>
                <Text className={styles.companyTitle}>全公司总览</Text>
                <Text className={styles.companySubtitle}>数据更新于今日</Text>
              </View>
            </View>
            <View className={styles.statsGrid} style={{ padding: 0, marginBottom: '24rpx' }}>
              <StatCard value={COMPANY_OVERALL_STATS.totalEmployees} label="参训人数" unit="人" />
              <StatCard value={COMPANY_OVERALL_STATS.overallCompletionRate} label="整体完成率" unit="%" color="success" />
              <StatCard value={COMPANY_OVERALL_STATS.completedCount} label="已完成" unit="人" color="primary" />
              <StatCard value={COMPANY_OVERALL_STATS.overallAverageScore} label="平均分" unit="分" color="warning" />
            </View>
            <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '16rpx' }}>
              公司级易错点TOP3
            </Text>
            {COMPANY_OVERALL_STATS.topWeakCategories.map((cat, idx) => (
              <View key={cat.category} className={styles.weakCategoryItem}>
                <View className={classnames(styles.weakCategoryRank, styles[`rank${idx + 1}`])}>
                  <Text>{idx + 1}</Text>
                </View>
                <Text className={styles.weakCategoryName}>{cat.name}</Text>
                <Text className={styles.weakCategoryRate}>错误率 {cat.errorRate}%</Text>
              </View>
            ))}
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>
              各部门详情
            </Text>
            {DEPARTMENT_STATS.map(dept => (
              <View key={dept.name} className={styles.departmentCard}>
                <View className={styles.departmentHeader}>
                  <Text className={styles.departmentName}>{dept.name}</Text>
                  <Text className={styles.departmentMeta}>
                    {Math.round(dept.completionRate)}% 完成 · 均分 {dept.averageScore}
                  </Text>
                </View>
                <View className={styles.departmentProgress}>
                  <Text className={styles.departmentProgressText}>完成率</Text>
                  <View style={{ flex: 1 }}>
                    <ProgressBar
                      percent={dept.completionRate}
                      variant={dept.completionRate >= 80 ? 'success' : dept.completionRate >= 60 ? 'warning' : 'danger'}
                    />
                  </View>
                </View>
                {dept.weakCategories.length > 0 && (
                  <View style={{ marginTop: '16rpx' }}>
                    <Text style={{ fontSize: '24rpx', color: '#94A3B8', marginBottom: '8rpx' }}>薄弱环节：</Text>
                    <View className={styles.departmentWeakTags}>
                      {dept.weakCategories.map(wc => {
                        const catInfo = CATEGORY_KNOWLEDGE.find(c => c.key === wc.category);
                        return (
                          <View key={wc.category} className={styles.weakTag}>
                            <Text>{catInfo?.name || wc.category} </Text>
                            <Text className={styles.weakTagRate}>{wc.errorRate}%</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default StatsPage;
