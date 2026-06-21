import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  value: string | number;
  label: string;
  unit?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  trend?: string;
  trendDirection?: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  unit,
  color = 'default',
  trend,
  trendDirection
}) => {
  return (
    <View className={styles.statCard}>
      <View className={classnames(styles.statValue, color !== 'default' && styles[color])}>
        <Text>{value}</Text>
        {unit && <Text className={styles.statUnit}>{unit}</Text>}
      </View>
      <Text className={styles.statLabel}>{label}</Text>
      {trend && (
        <Text className={classnames(styles.statTrend, trendDirection && styles[trendDirection])}>
          {trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : ''} {trend}
        </Text>
      )}
    </View>
  );
};

export default StatCard;
