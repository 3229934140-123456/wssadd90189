import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import KnowledgeTag from '@/components/KnowledgeTag';
import StatCard from '@/components/StatCard';
import { KnowledgeCategory, CATEGORY_KNOWLEDGE, MistakeRecord } from '@/types';
import { formatTimestamp, getRiskLabel } from '@/utils';

const MistakesPage: React.FC = () => {
  const { mistakes, markMistakeReviewed, clearAllMistakes, getMistakeStats } = useLearning();
  const [activeFilter, setActiveFilter] = useState<KnowledgeCategory | 'all'>('all');
  const [selectedMistake, setSelectedMistake] = useState<MistakeRecord | null>(null);

  const stats = useMemo(() => getMistakeStats(), [getMistakeStats]);
  const unreviewedCount = mistakes.filter(m => !m.reviewed).length;

  const filteredMistakes = useMemo(() => {
    if (activeFilter === 'all') return mistakes;
    return mistakes.filter(m => m.question.knowledgeCategory === activeFilter);
  }, [mistakes, activeFilter]);

  const handleCloseDetail = () => {
    setSelectedMistake(null);
  };

  const handleMarkReviewed = (questionId: string) => {
    markMistakeReviewed(questionId);
    if (selectedMistake?.question.id === questionId) {
      setSelectedMistake({ ...selectedMistake, reviewed: true });
    }
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>错题本</Text>
        <Text className={styles.headerDesc}>温故知新，避免在真实场景中犯同样的错误</Text>
      </View>

      <View className={styles.statsBar}>
        <StatCard value={mistakes.length} label="总错题" unit="道" color="danger" />
        <StatCard value={unreviewedCount} label="待复习" unit="道" color="warning" />
        <StatCard value={Object.keys(stats).length} label="薄弱知识点" unit="个" color="primary" />
      </View>

      <View className={styles.filterSection}>
        <Text className={styles.filterLabel}>按知识点筛选</Text>
        <View className={styles.filterTags}>
          <View
            className={classnames(styles.filterTag, activeFilter === 'all' && styles.active)}
            onClick={() => setActiveFilter('all')}
          >
            <Text>全部 ({mistakes.length})</Text>
          </View>
          {CATEGORY_KNOWLEDGE.map(cat => {
            const count = stats[cat.key] || 0;
            if (count === 0) return null;
            return (
              <View
                key={cat.key}
                className={classnames(styles.filterTag, activeFilter === cat.key && styles.active)}
                onClick={() => setActiveFilter(cat.key)}
              >
                <Text>{cat.name} ({count})</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.mistakesList}>
        {filteredMistakes.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🎉</Text>
            <Text className={styles.emptyTitle}>暂无错题</Text>
            <Text className={styles.emptyDesc}>继续闯关，错题会自动记录在这里供你复习</Text>
          </View>
        ) : (
          filteredMistakes.map(mistake => (
            <View key={mistake.question.id} className={styles.mistakeCard}>
              <View className={styles.mistakeHeader}>
                <Text className={styles.mistakeTitle}>{mistake.question.title}</Text>
                {mistake.reviewed && <Text className={styles.reviewedBadge}>已复习</Text>}
              </View>
              <View style={{ marginBottom: '16rpx' }}>
                <KnowledgeTag category={mistake.question.knowledgeCategory} variant="danger" />
              </View>
              <Text className={styles.mistakeScenario}>{mistake.question.scenario}</Text>
              <View className={styles.mistakeFooter}>
                <Text className={styles.mistakeTime}>
                  答错时间：{formatTimestamp(mistake.timestamp)}
                </Text>
                <View className={styles.actionButtons}>
                  <Button
                    className={classnames(styles.actionBtn)}
                    onClick={() => setSelectedMistake(mistake)}
                  >
                    查看解析
                  </Button>
                  {!mistake.reviewed && (
                    <Button
                      className={classnames(styles.actionBtn, styles.success)}
                      onClick={() => handleMarkReviewed(mistake.question.id)}
                    >
                      标记已会
                    </Button>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {selectedMistake && (
        <View className={styles.detailModal} onClick={handleCloseDetail}>
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.detailTitle}>错题解析</Text>
              <Text className={styles.closeBtn} onClick={handleCloseDetail}>×</Text>
            </View>
            <ScrollView scrollY className={styles.detailBody}>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>题目</Text>
                <Text className={styles.detailSectionContent}>{selectedMistake.question.title}</Text>
              </View>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>情景描述</Text>
                <Text className={styles.detailSectionContent}>{selectedMistake.question.scenario}</Text>
              </View>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>你的选择</Text>
                <View className={classnames(styles.detailSectionContent, styles.wrong)}>
                  {(() => {
                    const opt = selectedMistake.question.options.find(o => o.id === selectedMistake.selectedOptionId);
                    return opt ? (
                      <>
                        <Text>{opt.text}</Text>
                        <Text style={{ display: 'block', marginTop: '8rpx', color: '#EF4444', fontWeight: '500' }}>
                          ⚠ {getRiskLabel(opt.riskLevel)}
                        </Text>
                      </>
                    ) : null;
                  })()}
                </View>
              </View>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>正确答案</Text>
                <View className={classnames(styles.detailSectionContent, styles.correct)}>
                  {(() => {
                    const opt = selectedMistake.question.options.find(o => o.id === selectedMistake.correctOptionId);
                    return opt ? (
                      <>
                        <Text>{opt.text}</Text>
                        <Text style={{ display: 'block', marginTop: '8rpx', color: '#10B981', fontWeight: '500' }}>
                          ✓ {getRiskLabel(opt.riskLevel)}
                        </Text>
                      </>
                    ) : null;
                  })()}
                </View>
              </View>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>风险解释</Text>
                <Text className={styles.detailSectionContent}>
                  {(() => {
                    const opt = selectedMistake.question.options.find(o => o.id === selectedMistake.selectedOptionId);
                    return opt?.riskExplanation || '';
                  })()}
                </Text>
              </View>
              <View className={styles.detailSection}>
                <Text className={styles.detailSectionTitle}>案例参考</Text>
                <View className={styles.caseBox}>
                  <Text className={styles.caseLabel}>📚 真实案例</Text>
                  <Text className={styles.caseText}>
                    {(() => {
                      const opt = selectedMistake.question.options.find(o => o.id === selectedMistake.selectedOptionId);
                      return opt?.caseReference || '';
                    })()}
                  </Text>
                </View>
              </View>
            </ScrollView>
            <View className={styles.detailFooter}>
              <Button className={styles.footerBtn} onClick={handleCloseDetail}>
                关闭
              </Button>
              {!selectedMistake.reviewed && (
                <Button
                  className={classnames(styles.footerBtn, styles.primary)}
                  onClick={() => handleMarkReviewed(selectedMistake.question.id)}
                >
                  标记已掌握
                </Button>
              )}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MistakesPage;
