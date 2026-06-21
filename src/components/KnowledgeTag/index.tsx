import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { KnowledgeCategory, CATEGORY_KNOWLEDGE } from '@/types';

interface KnowledgeTagProps {
  category: KnowledgeCategory;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const KnowledgeTag: React.FC<KnowledgeTagProps> = ({ category, variant = 'default' }) => {
  const categoryInfo = CATEGORY_KNOWLEDGE.find(c => c.key === category);
  const name = categoryInfo?.name || category;

  return (
    <View className={classnames(styles.knowledgeTag, styles[variant])}>
      <Text>{name}</Text>
    </View>
  );
};

export default KnowledgeTag;
