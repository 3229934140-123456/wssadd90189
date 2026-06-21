import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import LevelCard from '@/components/LevelCard';
import ProgressBar from '@/components/ProgressBar';
import { LEVELS } from '@/data/levels';
import { DepartmentType, DEPARTMENT_NAMES } from '@/types';

const versions: { key: DepartmentType; name: string }[] = [
  { key: 'all', name: DEPARTMENT_NAMES.all },
  { key: 'sales', name: DEPARTMENT_NAMES.sales },
  { key: 'hr', name: DEPARTMENT_NAMES.hr },
  { key: 'customerService', name: DEPARTMENT_NAMES.customerService },
];

const ChallengePage: React.FC = () => {
  const { userProgress } = useLearning();
  const [activeVersion, setActiveVersion] = useState<DepartmentType>('all');

  const handleLevelClick = (levelId: string) => {
    Taro.navigateTo({ url: `/pages/level-detail/index?levelId=${levelId}` });
  };

  const completedCount = LEVELS.filter(l => l.completed).length;
  const progressPercent = (completedCount / LEVELS.length) * 100;

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>情景闯关</Text>
        <Text className={styles.headerDesc}>在真实场景中锻炼监管处罚应对能力</Text>
        <View className={styles.versionSelector}>
          {versions.map(v => (
            <View
              key={v.key}
              className={classnames(styles.versionTab, activeVersion === v.key && styles.active)}
              onClick={() => setActiveVersion(v.key)}
            >
              <Text>{v.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.progressOverview}>
        <View className={styles.progressTitle}>
          <Text>闯关进度</Text>
          <Text className={styles.progressCount}>{completedCount} / {LEVELS.length} 关已通关</Text>
        </View>
        <ProgressBar percent={progressPercent} variant="primary" />
      </View>

      <View className={styles.levelsList}>
        {LEVELS.map(level => (
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

export default ChallengePage;
