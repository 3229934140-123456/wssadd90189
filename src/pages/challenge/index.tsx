import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import LevelCard from '@/components/LevelCard';
import ProgressBar from '@/components/ProgressBar';
import { DepartmentType, DEPARTMENT_NAMES } from '@/types';

const versions: { key: DepartmentType; name: string }[] = [
  { key: 'all', name: DEPARTMENT_NAMES.all },
  { key: 'sales', name: DEPARTMENT_NAMES.sales },
  { key: 'hr', name: DEPARTMENT_NAMES.hr },
  { key: 'customerService', name: DEPARTMENT_NAMES.customerService },
];

const ChallengePage: React.FC = () => {
  const { levels, currentVersion, setCurrentVersion, getFilteredQuestions, getActiveTasksForVersion, isLevelInAnyTask } = useLearning();

  const activeTasks = useMemo(() => getActiveTasksForVersion(currentVersion), [getActiveTasksForVersion, currentVersion]);

  const handleLevelClick = (levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level || !level.unlocked) {
      Taro.showToast({ title: '请先完成上一关卡', icon: 'none' });
      return;
    }
    Taro.navigateTo({ url: `/pages/level-detail/index?levelId=${levelId}` });
  };

  const handleVersionChange = (version: DepartmentType) => {
    setCurrentVersion(version);
    Taro.showToast({
      title: `已切换到${DEPARTMENT_NAMES[version]}`,
      icon: 'none',
      duration: 1500
    });
  };

  const completedCount = levels.filter(l => l.completed).length;
  const progressPercent = levels.length > 0 ? (completedCount / levels.length) * 100 : 0;

  const levelQuestionCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    levels.forEach(level => {
      counts[level.id] = getFilteredQuestions(level.id).length;
    });
    return counts;
  }, [levels, getFilteredQuestions]);

  const levelsWithQuestionCount = useMemo(() => {
    return levels.map(level => ({
      ...level,
      questionCount: levelQuestionCounts[level.id] || level.questionCount,
      inTask: isLevelInAnyTask(level.id, currentVersion)
    }));
  }, [levels, levelQuestionCounts, isLevelInAnyTask, currentVersion]);

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>情景闯关</Text>
        <Text className={styles.headerDesc}>
          当前为 <Text style={{ fontWeight: '600' }}>{DEPARTMENT_NAMES[currentVersion]}</Text>，题目已按岗位适配
        </Text>
        <View className={styles.versionSelector}>
          {versions.map(v => (
            <View
              key={v.key}
              className={classnames(styles.versionTab, currentVersion === v.key && styles.active)}
              onClick={() => handleVersionChange(v.key)}
            >
              <Text>{v.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.progressOverview}>
        <View className={styles.progressTitle}>
          <Text>闯关进度</Text>
          <Text className={styles.progressCount}>{completedCount} / {levels.length} 关已通关</Text>
        </View>
        <ProgressBar percent={progressPercent} variant="success" />
      </View>

      {activeTasks.length > 0 && (
        <View className={styles.taskTip}>
          <Text className={styles.taskTipTitle}>📌 当前培训任务中的关卡</Text>
          {activeTasks.map(task => (
            <View key={task.id} className={styles.taskTipItem}>
              <Text className={styles.taskTipName}>{task.title}</Text>
              <Text className={styles.taskTipLevels}>
                包含关卡：{task.levelIds.map(lid => {
                  const lv = levels.find(l => l.id === lid);
                  return lv ? lv.title : lid;
                }).join('、')}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.levelsList}>
        {levelsWithQuestionCount.map(level => (
          <View key={level.id} className={styles.levelWrap}>
            {level.inTask && <View className={styles.taskBadge}><Text>📋 任务关卡</Text></View>}
            <LevelCard
              level={level}
              onClick={() => handleLevelClick(level.id)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ChallengePage;
