import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const AdminPage: React.FC = () => {
  return (
    <View className={styles.container}>
      <View className={styles.placeholderCard}>
        <Text className={styles.placeholderIcon}>⚙️</Text>
        <Text className={styles.placeholderTitle}>管理后台</Text>
        <Text className={styles.placeholderDesc}>
          管理员功能正在开发中，敬请期待
        </Text>
        <View className={styles.featureList}>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text className={styles.featureText}>知识库案例管理：从制度文档中挑选案例生成题目</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text className={styles.featureText}>岗位版本设置：销售、人事、客服等不同岗位版本</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text className={styles.featureText}>题目编辑：新增、修改、删除情景题目和选项</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text className={styles.featureText}>培训任务管理：指派培训任务和截止日期</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text className={styles.featureText}>数据导出：学习记录和统计报表导出</Text>
          </View>
        </View>
        <Button
          className={styles.backBtn}
          onClick={() => Taro.switchTab({ url: '/pages/home/index' })}
        >
          返回首页
        </Button>
      </View>
    </View>
  );
};

export default AdminPage;
