import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import StatCard from '@/components/StatCard';
import ProgressBar from '@/components/ProgressBar';
import KnowledgeTag from '@/components/KnowledgeTag';
import { CATEGORY_KNOWLEDGE, KnowledgeCategory, DepartmentType, DEPARTMENT_NAMES, TrainingTask } from '@/types';
import { calculateGrade, getGradeColor, formatTimestamp } from '@/utils';

interface DeptStats {
  totalAnswered: number;
  totalCorrect: number;
  completedLevels: number;
  categoryErrors: Record<string, number>;
}

const gradeDescriptions: Record<string, string> = {
  S: '卓越级：应对能力出色，可作为部门合规标杆',
  A: '优秀级：具备良好的风险识别和应对能力',
  B: '良好级：掌握基础应对流程，部分场景需加强',
  C: '合格级：存在明显知识盲区，需重点复习',
  D: '待提升：应对能力薄弱，建议重新学习所有关卡'
};

const StatsPage: React.FC = () => {
  const { userProgress, getMistakeStats, getRealDepartmentStats, trainingTasks, levels } = useLearning();
  const [viewMode, setViewMode] = useState<'personal' | 'department' | 'task'>('personal');

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

  const realStats = useMemo(() => getRealDepartmentStats() as Record<string, DeptStats>, [getRealDepartmentStats]);

  const companyOverall = useMemo(() => {
    const deptValues = Object.values(realStats);
    const totalAnswered = deptValues.reduce((sum, d) => sum + (d.totalAnswered || 0), 0);
    const totalCorrect = deptValues.reduce((sum, d) => sum + (d.totalCorrect || 0), 0);
    const avgScore = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const completedLevels = deptValues.reduce((sum, d) => sum + (d.completedLevels || 0), 0);

    const categoryErrors: Record<string, number> = {};
    deptValues.forEach(d => {
      const errs = d.categoryErrors || {};
      Object.entries(errs).forEach(([cat, count]) => {
        categoryErrors[cat] = (categoryErrors[cat] || 0) + count;
      });
    });

    const topWeakCategories = Object.entries(categoryErrors)
      .map(([category, errorCount]) => {
        const info = CATEGORY_KNOWLEDGE.find(c => c.key === category);
        return {
          category,
          name: info?.name || category,
          errorCount,
          errorRate: totalAnswered > 0 ? Math.round((errorCount / totalAnswered) * 100) : 0
        };
      })
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 3);

    return {
      totalAnswered,
      totalCorrect,
      avgScore,
      completedLevels,
      departmentCount: Object.keys(realStats).length,
      topWeakCategories
    };
  }, [realStats]);

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
          <View
            className={classnames(styles.viewTab, viewMode === 'task' && styles.active)}
            onClick={() => setViewMode('task')}
          >
            <Text>任务看板</Text>
          </View>
        </View>
      </View>

      {viewMode === 'personal' && (
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
              <ProgressBar percent={overallPercent} variant="success" />
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
      )}
      {viewMode === 'department' && (
        <View style={{ marginTop: '32rpx' }}>
          <View className={styles.sectionCard}>
            <View className={styles.companyHeader}>
              <View>
                <Text className={styles.companyTitle}>全公司总览</Text>
                <Text className={styles.companySubtitle}>基于真实答题记录</Text>
              </View>
            </View>
            <View className={styles.statsGrid} style={{ padding: 0, marginBottom: '24rpx' }}>
              <StatCard value={companyOverall.departmentCount + 3} label="参训部门" unit="个" />
              <StatCard value={companyOverall.avgScore} label="整体正确率" unit="%" color="success" />
              <StatCard value={companyOverall.completedLevels} label="累计通关" unit="次" color="primary" />
              <StatCard value={companyOverall.totalAnswered} label="累计答题" unit="道" color="warning" />
            </View>
            <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '16rpx' }}>
              公司级易错点TOP3
            </Text>
            {companyOverall.topWeakCategories.length === 0 ? (
              <Text style={{ fontSize: '26rpx', color: '#94A3B8', textAlign: 'center', padding: '24rpx 0' }}>
                暂无数据，开始答题后自动统计
              </Text>
            ) : (
              companyOverall.topWeakCategories.map((cat, idx) => (
                <View key={cat.category} className={styles.weakCategoryItem}>
                  <View className={classnames(styles.weakCategoryRank, styles[`rank${idx + 1}`])}>
                    <Text>{idx + 1}</Text>
                  </View>
                  <Text className={styles.weakCategoryName}>{cat.name}</Text>
                  <Text className={styles.weakCategoryRate}>错误率 {cat.errorRate}%</Text>
                </View>
              ))
            )}
          </View>

          <View className={styles.sectionCard}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>
              各部门详情
            </Text>
            {Object.keys(realStats).length === 0 ? (
              <Text style={{ fontSize: '26rpx', color: '#94A3B8', textAlign: 'center', padding: '48rpx 0' }}>
                暂无部门数据，各岗位版本答题后自动统计
              </Text>
            ) : (
              Object.entries(realStats).map(([deptKey, deptStats]) => {
                const deptName = DEPARTMENT_NAMES[deptKey as DepartmentType] || deptKey;
                const deptAccuracy = deptStats.totalAnswered > 0
                  ? Math.round((deptStats.totalCorrect / deptStats.totalAnswered) * 100)
                  : 0;

                const weakCategories = Object.entries(deptStats.categoryErrors || {})
                  .map(([category, count]) => {
                    const info = CATEGORY_KNOWLEDGE.find(c => c.key === category);
                    return {
                      category,
                      name: info?.name || category,
                      errorCount: count,
                      errorRate: deptStats.totalAnswered > 0 ? Math.round((count / deptStats.totalAnswered) * 100) : 0
                    };
                  })
                  .sort((a, b) => b.errorCount - a.errorCount)
                  .slice(0, 3);

                return (
                  <View key={deptKey} className={styles.departmentCard}>
                    <View className={styles.departmentHeader}>
                      <Text className={styles.departmentName}>{deptName}</Text>
                      <Text className={styles.departmentMeta}>
                        正确率 {deptAccuracy}% · 通关 {deptStats.completedLevels || 0}次
                      </Text>
                    </View>
                    <View className={styles.departmentProgress}>
                      <Text className={styles.departmentProgressText}>正确率</Text>
                      <View style={{ flex: 1 }}>
                        <ProgressBar
                          percent={deptAccuracy}
                          variant={deptAccuracy >= 80 ? 'success' : deptAccuracy >= 60 ? 'warning' : 'danger'}
                        />
                      </View>
                    </View>
                    {weakCategories.length > 0 && (
                      <View style={{ marginTop: '16rpx' }}>
                        <Text style={{ fontSize: '24rpx', color: '#94A3B8', marginBottom: '8rpx' }}>薄弱环节：</Text>
                        <View className={styles.departmentWeakTags}>
                          {weakCategories.map(wc => (
                            <View key={wc.category} className={styles.weakTag}>
                              <Text>{wc.name} </Text>
                              <Text className={styles.weakTagRate}>{wc.errorRate}%</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                    <View style={{ marginTop: '16rpx', paddingTop: '16rpx', borderTop: '1rpx solid #E2E8F0' }}>
                      <Text style={{ fontSize: '22rpx', color: '#94A3B8' }}>
                        累计答题 {deptStats.totalAnswered || 0} 道，正确 {deptStats.totalCorrect || 0} 道
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      )}
      {viewMode === 'task' && (
        <View style={{ marginTop: '32rpx' }}>
          {trainingTasks.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📋</Text>
              <Text className={styles.emptyTitle}>暂无培训任务</Text>
              <Text className={styles.emptyDesc}>前往管理后台发布培训任务后，这里会展示各任务的完成看板</Text>
            </View>
          ) : (
            trainingTasks.map((task: TrainingTask) => {
              const isExpired = task.deadline < Date.now();
              const taskDeptStats = task.departments.reduce<Record<string, DeptStats>>((acc, dept) => {
                if (dept === 'all') {
                  const merged: DeptStats = { totalAnswered: 0, totalCorrect: 0, completedLevels: 0, categoryErrors: {} };
                  Object.values(realStats).forEach(ds => {
                    merged.totalAnswered += ds.totalAnswered || 0;
                    merged.totalCorrect += ds.totalCorrect || 0;
                    Object.entries(ds.categoryErrors || {}).forEach(([k, v]) => {
                      merged.categoryErrors[k] = (merged.categoryErrors[k] || 0) + v;
                    });
                  });
                  merged.completedLevels = Math.min(
                    Object.values(realStats).reduce((s, d) => s + (d.completedLevels || 0), 0),
                    task.levelIds.length
                  );
                  acc.all = merged;
                } else {
                  const ds = realStats[dept];
                  if (ds) {
                    acc[dept] = {
                      ...ds,
                      completedLevels: Math.min(ds.completedLevels || 0, task.levelIds.length)
                    };
                  }
                }
                return acc;
              }, {});

              const taskTotalCompletedLevels = Object.values(taskDeptStats).reduce((s, d) => s + (d.completedLevels || 0), 0);
              const taskTotalAnswered = Object.values(taskDeptStats).reduce((s, d) => s + (d.totalAnswered || 0), 0);
              const taskTotalCorrect = Object.values(taskDeptStats).reduce((s, d) => s + (d.totalCorrect || 0), 0);
              const taskAvgScore = taskTotalAnswered > 0 ? Math.round((taskTotalCorrect / taskTotalAnswered) * 100) : 0;

              const categoryMerged: Record<string, number> = {};
              Object.values(taskDeptStats).forEach(ds => {
                Object.entries(ds.categoryErrors || {}).forEach(([k, v]) => {
                  categoryMerged[k] = (categoryMerged[k] || 0) + v;
                });
              });
              const taskWeak = Object.entries(categoryMerged)
                .map(([cat, cnt]) => ({
                  category: cat,
                  name: CATEGORY_KNOWLEDGE.find(c => c.key === cat)?.name || cat,
                  errorCount: cnt,
                  errorRate: taskTotalAnswered > 0 ? Math.round((cnt / taskTotalAnswered) * 100) : 0
                }))
                .sort((a, b) => b.errorCount - a.errorCount)
                .slice(0, 3);

              return (
                <View key={task.id} className={styles.sectionCard}>
                  <View className={styles.taskHeader}>
                    <View>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      <Text className={styles.taskSubtitle}>
                        {isExpired ? '⏰ 已截止' : '📅 截止'}：{formatTimestamp(task.deadline)} · 及格线 {task.passingScore}分
                      </Text>
                      <Text className={styles.taskSubtitle} style={{ marginTop: '4rpx' }}>
                        适用：{task.departments.map(d => d === 'all' ? '全员' : DEPARTMENT_NAMES[d] || d).join('、')} · 关卡：{task.levelIds.length}关
                      </Text>
                    </View>
                  </View>
                  <View className={styles.statsGrid} style={{ padding: 0, marginBottom: '24rpx' }}>
                    <StatCard value={Object.keys(taskDeptStats).length} label="覆盖部门" unit="个" />
                    <StatCard value={taskAvgScore} label="平均得分" unit="%" color={taskAvgScore >= 80 ? 'success' : taskAvgScore >= 60 ? 'warning' : 'danger'} />
                    <StatCard value={taskTotalCompletedLevels} label="累计通关" unit="关次" color="primary" />
                    <StatCard value={taskTotalAnswered} label="累计答题" unit="道" color="warning" />
                  </View>

                  {taskWeak.length > 0 && (
                    <>
                      <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '16rpx' }}>
                        全任务拖后腿知识点
                      </Text>
                      {taskWeak.map((cat, idx) => (
                        <View key={cat.category} className={styles.weakCategoryItem}>
                          <View className={classnames(styles.weakCategoryRank, styles[`rank${idx + 1}`])}>
                            <Text>{idx + 1}</Text>
                          </View>
                          <Text className={styles.weakCategoryName}>{cat.name}</Text>
                          <Text className={styles.weakCategoryRate}>错误率 {cat.errorRate}%</Text>
                        </View>
                      ))}
                      <View style={{ height: '24rpx' }} />
                    </>
                  )}

                  <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '16rpx' }}>
                    各部门完成情况
                  </Text>
                  {Object.keys(taskDeptStats).length === 0 ? (
                    <Text style={{ fontSize: '26rpx', color: '#94A3B8', textAlign: 'center', padding: '24rpx 0' }}>
                      暂无数据，员工完成任务后自动更新
                    </Text>
                  ) : (
                    Object.entries(taskDeptStats).map(([deptKey, ds]) => {
                      const deptName = deptKey === 'all' ? '全员合计' : DEPARTMENT_NAMES[deptKey as DepartmentType] || deptKey;
                      const deptAccuracy = ds.totalAnswered > 0 ? Math.round((ds.totalCorrect / ds.totalAnswered) * 100) : 0;
                      const levelCompletionPct = task.levelIds.length > 0
                        ? Math.round(((ds.completedLevels || 0) / task.levelIds.length) * 100)
                        : 0;
                      const deptWeak = Object.entries(ds.categoryErrors || {})
                        .map(([cat, cnt]) => ({
                          category: cat,
                          name: CATEGORY_KNOWLEDGE.find(c => c.key === cat)?.name || cat,
                          errorCount: cnt,
                          errorRate: ds.totalAnswered > 0 ? Math.round((cnt / ds.totalAnswered) * 100) : 0
                        }))
                        .sort((a, b) => b.errorCount - a.errorCount)
                        .slice(0, 2);
                      return (
                        <View key={deptKey} className={styles.departmentCard}>
                          <View className={styles.departmentHeader}>
                            <Text className={styles.departmentName}>{deptName}</Text>
                            <Text className={styles.departmentMeta}>
                              平均分 {deptAccuracy}% · 通关 {ds.completedLevels || 0}/{task.levelIds.length}关
                            </Text>
                          </View>
                          <View className={styles.departmentProgress}>
                            <Text className={styles.departmentProgressText}>完成率</Text>
                            <View style={{ flex: 1 }}>
                              <ProgressBar
                                percent={levelCompletionPct}
                                variant={levelCompletionPct >= 80 ? 'success' : levelCompletionPct >= 60 ? 'warning' : 'danger'}
                              />
                            </View>
                          </View>
                          <View style={{ marginTop: '8rpx', paddingTop: '12rpx', borderTop: '1rpx dashed #E2E8F0' }}>
                            <Text style={{ fontSize: '22rpx', color: '#94A3B8', marginBottom: '8rpx' }}>关卡明细：</Text>
                            <View style={{ display: 'flex', flexWrap: 'wrap', gap: '12rpx' }}>
                              {task.levelIds.map(lid => {
                                const lv = levels.find(l => l.id === lid);
                                const lvTitle = lv ? lv.title : lid;
                                const userCompleted = userProgress.completedLevels.includes(lid);
                                return (
                                  <View
                                    key={lid}
                                    style={{
                                      padding: '6rpx 16rpx',
                                      borderRadius: '20rpx',
                                      fontSize: '22rpx',
                                      background: userCompleted ? '#D1FAE5' : '#F1F5F9',
                                      color: userCompleted ? '#065F46' : '#64748B'
                                    }}
                                  >
                                    <Text>{lvTitle} {userCompleted ? '✓' : ''}</Text>
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                          {deptWeak.length > 0 && (
                            <View style={{ marginTop: '12rpx', paddingTop: '12rpx', borderTop: '1rpx dashed #E2E8F0' }}>
                              <Text style={{ fontSize: '22rpx', color: '#94A3B8', marginBottom: '8rpx' }}>拖后腿：</Text>
                              <View className={styles.departmentWeakTags}>
                                {deptWeak.map(wc => (
                                  <View key={wc.category} className={styles.weakTag}>
                                    <Text>{wc.name} </Text>
                                    <Text className={styles.weakTagRate}>{wc.errorRate}%</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })
                  )}
                </View>
              );
            })
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default StatsPage;
