import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { Level } from '@/types';
import classnames from 'classnames';

interface LevelCardProps {
  level: Level;
  onClick?: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, onClick }) => {
  const handleClick = () => {
    if (!level.unlocked) {
      Taro.showToast({ title: '请先完成前置关卡', icon: 'none' });
      return;
    }
    onClick?.();
  };

  const statusClass = level.completed ? 'completed' : level.unlocked ? 'available' : 'locked';
  const statusText = level.completed ? '已通关' : level.unlocked ? '可挑战' : '未解锁';

  return (
    <View 
      className={classnames(styles.levelCard, !level.unlocked && styles.locked, level.completed && styles.completed)} 
      onClick={handleClick}
    >
      <View className={styles.cardHeader}>
        <View className={styles.levelIcon}>
          <Text>{level.icon}</Text>
        </View>
        <View className={styles.levelInfo}>
          <Text className={styles.levelOrder}>第 {level.order} 关</Text>
          <Text className={styles.levelTitle}>{level.title}</Text>
          <Text className={styles.levelDesc}>{level.description}</Text>
        </View>
      </View>
      <View className={styles.cardFooter}>
        <View className={styles.metaInfo}>
          <Text className={styles.metaItem}>{level.questionCount} 道题目</Text>
          <Text className={styles.metaItem}>通关线 {level.passingScore}分</Text>
          {level.bestScore !== undefined && (
            <Text className={styles.bestScore}>最高分 {level.bestScore}分</Text>
          )}
        </View>
        <View className={classnames(styles.statusBadge, styles[statusClass])}>
          <Text>{statusText}</Text>
        </View>
      </View>
    </View>
  );
};

export default LevelCard;
