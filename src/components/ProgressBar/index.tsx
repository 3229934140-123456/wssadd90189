import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent, showLabel = false, variant = 'default' }) => {
  const validPercent = Math.max(0, Math.min(100, percent));

  return (
    <View className={showLabel ? styles.progressWithLabel : ''}>
      <View className={styles.progressBar}>
        <View 
          className={classnames(styles.progressFill, styles[variant])} 
          style={{ width: `${validPercent}%` }} 
        />
      </View>
      {showLabel && <Text className={styles.progressLabel}>{validPercent}%</Text>}
    </View>
  );
};

export default ProgressBar;
