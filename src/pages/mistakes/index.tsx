import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import KnowledgeTag from '@/components/KnowledgeTag';
import StatCard from '@/components/StatCard';
import { KnowledgeCategory, CATEGORY_KNOWLEDGE, MistakeRecord } from '@/types';
import { formatTimestamp, getRiskLabel } from '@/utils';
import { storage } from '@/utils/storage';

const MistakesPage: React.FC = () => {
  const { mistakes, markMistakeReviewed, getMistakeStats, recordReview, getReviewRecord } = useLearning();
  const [activeFilter, setActiveFilter] = useState<KnowledgeCategory | 'all'>('all');
  const [selectedMistake, setSelectedMistake] = useState<MistakeRecord | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<MistakeRecord[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  useDidShow(() => {
    const savedFilter = storage.getMistakesFilter();
    if (savedFilter && savedFilter !== 'all') {
      setActiveFilter(savedFilter as KnowledgeCategory);
    }
    const tabAction = storage.getMistakesTabAction();
    if (tabAction === 'startReview') {
      storage.setMistakesTabAction('');
      setTimeout(() => startReviewPlan(), 300);
    }
  });

  const stats = useMemo(() => getMistakeStats(), [getMistakeStats]);
  const unreviewedCount = mistakes.filter(m => !m.reviewed).length;

  const filteredMistakes = useMemo(() => {
    if (activeFilter === 'all') return mistakes;
    return mistakes.filter(m => m.question.knowledgeCategory === activeFilter);
  }, [mistakes, activeFilter]);

  const handleFilterChange = (filter: KnowledgeCategory | 'all') => {
    setActiveFilter(filter);
    storage.setMistakesFilter(filter);
  };

  const startReviewPlan = () => {
    const source = activeFilter === 'all' ? mistakes : mistakes.filter(m => m.question.knowledgeCategory === activeFilter);
    if (source.length === 0) return;
    const sorted = [...source].sort((a, b) => {
      const ra = getReviewRecord(a.question.id);
      const rb = getReviewRecord(b.question.id);
      const scoreA = (ra?.lastMastered ? 1 : 0) * 100 - (ra?.reviewCount || 0);
      const scoreB = (rb?.lastMastered ? 1 : 0) * 100 - (rb?.reviewCount || 0);
      return scoreA - scoreB;
    });
    setReviewQueue(sorted.slice(0, Math.min(5, sorted.length)));
    setReviewIndex(0);
    setReviewMode(true);
  };

  const handleReviewSubmit = (mastered: boolean) => {
    const current = reviewQueue[reviewIndex];
    if (current) {
      recordReview(current.question.id, current.question.knowledgeCategory, mastered);
    }
    if (reviewIndex < reviewQueue.length - 1) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setReviewMode(false);
      setReviewQueue([]);
      setReviewIndex(0);
    }
  };

  const handleCloseDetail = () => {
    setSelectedMistake(null);
  };

  const handleMarkReviewed = (questionId: string) => {
    markMistakeReviewed(questionId);
    if (selectedMistake?.question.id === questionId) {
      setSelectedMistake({ ...selectedMistake, reviewed: true });
    }
  };

  if (reviewMode && reviewQueue.length > 0) {
    const currentMistake = reviewQueue[reviewIndex];
    const progress = Math.round(((reviewIndex + 1) / reviewQueue.length) * 100);
    const reviewRec = getReviewRecord(currentMistake.question.id);
    return (
      <ScrollView scrollY className={styles.container}>
        <View className={styles.reviewHeader}>
          <View>
            <Text className={styles.reviewTitle}>复习模式</Text>
            <Text className={styles.reviewSubtitle}>第 {reviewIndex + 1} / {reviewQueue.length} 题</Text>
          </View>
          <View className={styles.reviewClose} onClick={() => { setReviewMode(false); setReviewQueue([]); }}>
            <Text>退出</Text>
          </View>
        </View>
        <View style={{ padding: '0 32rpx', marginBottom: '32rpx' }}>
          <View style={{ height: '12rpx', background: '#E2E8F0', borderRadius: '6rpx', overflow: 'hidden' }}>
            <View style={{ width: `${progress}%`, height: '100%', background: '#10B981', borderRadius: '6rpx', transition: 'width 0.3s' }} />
          </View>
        </View>
        <View style={{ padding: '0 32rpx' }}>
          {reviewRec && (
            <View style={{ marginBottom: '16rpx', display: 'flex', gap: '12rpx' }}>
              <Text style={{ fontSize: '24rpx', color: '#64748B', padding: '6rpx 12rpx', background: '#F1F5F9', borderRadius: '8rpx' }}>
                已复习 {reviewRec.reviewCount} 次
              </Text>
              <Text style={{ fontSize: '24rpx', color: reviewRec.lastMastered ? '#10B981' : '#EF4444', padding: '6rpx 12rpx', background: reviewRec.lastMastered ? '#D1FAE5' : '#FEE2E2', borderRadius: '8rpx' }}>
                上次：{reviewRec.lastMastered ? '已掌握' : '未掌握'}
              </Text>
            </View>
          )}
          <View className={styles.questionItem} style={{ marginBottom: '32rpx' }}>
            <Text className={styles.questionTitle}>{currentMistake.question.title}</Text>
            <View style={{ marginBottom: '16rpx' }}>
              <KnowledgeTag category={currentMistake.question.knowledgeCategory} variant="warning" />
            </View>
            <Text className={styles.mistakeScenario}>{currentMistake.question.scenario}</Text>
          </View>

          <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '16rpx' }}>选项：</Text>
          {currentMistake.question.options.map(opt => (
            <View
              key={opt.id}
              className={styles.reviewOption}
              style={{
                background: opt.id === currentMistake.selectedOptionId
                  ? '#FEF2F2'
                  : opt.id === currentMistake.correctOptionId
                    ? '#D1FAE5'
                    : '#fff',
                borderColor: opt.id === currentMistake.selectedOptionId
                  ? '#EF4444'
                  : opt.id === currentMistake.correctOptionId
                    ? '#10B981'
                    : '#E2E8F0'
              }}
            >
              <Text style={{ fontWeight: '500', color: opt.id === currentMistake.correctOptionId ? '#065F46' : '#1E293B' }}>
                {opt.id === currentMistake.correctOptionId ? '✓ ' : opt.id === currentMistake.selectedOptionId ? '✗ ' : ''}{opt.text}
              </Text>
            </View>
          ))}

          <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', margin: '32rpx 0 16rpx' }}>风险解释：</Text>
          <Text style={{ fontSize: '26rpx', color: '#475569', lineHeight: 1.6, padding: '16rpx', background: '#FEF2F2', borderRadius: '12rpx', marginBottom: '32rpx' }}>
            {currentMistake.question.options.find(o => o.id === currentMistake.selectedOptionId)?.riskExplanation || ''}
          </Text>

          <Text style={{ fontSize: '28rpx', fontWeight: '600', color: '#0F172A', marginBottom: '24rpx' }}>你掌握这道题了吗？</Text>
          <View style={{ display: 'flex', gap: '16rpx' }}>
            <Button
              className={classnames(styles.actionBtn, styles.danger)}
              style={{ flex: 1 }}
              onClick={() => handleReviewSubmit(false)}
            >
              还没掌握
            </Button>
            <Button
              className={classnames(styles.actionBtn, styles.success)}
              style={{ flex: 1 }}
              onClick={() => handleReviewSubmit(true)}
            >
              已掌握
            </Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>错题本</Text>
        <Text className={styles.headerDesc}>温故知新，避免在真实场景中犯同样的错误</Text>
        {activeFilter !== 'all' && (
          <Text className={styles.filterActiveHint}>
            当前筛选：{CATEGORY_KNOWLEDGE.find(c => c.key === activeFilter)?.name}
          </Text>
        )}
      </View>

      <View className={styles.statsBar}>
        <StatCard value={mistakes.length} label="总错题" unit="道" color="danger" />
        <StatCard value={unreviewedCount} label="待复习" unit="道" color="warning" />
        <StatCard value={Object.keys(stats).length} label="薄弱知识点" unit="个" color="primary" />
      </View>

      {mistakes.length > 0 && (
        <View style={{ padding: '0 32rpx', marginBottom: '24rpx' }}>
          <Button
            className={classnames(styles.actionBtn, styles.primary)}
            onClick={startReviewPlan}
            style={{ width: '100%', margin: 0 }}
          >
            🎯 生成复习计划（{activeFilter === 'all' ? '全部' : CATEGORY_KNOWLEDGE.find(c => c.key === activeFilter)?.name}）
          </Button>
        </View>
      )}

      <View className={styles.filterSection}>
        <Text className={styles.filterLabel}>按知识点筛选</Text>
        <View className={styles.filterTags}>
          <View
            className={classnames(styles.filterTag, activeFilter === 'all' && styles.active)}
            onClick={() => handleFilterChange('all')}
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
                onClick={() => handleFilterChange(cat.key)}
              >
                <Text>{cat.name} ({count})</Text>
              </View>
            );
          })}
        </View>
        {activeFilter !== 'all' && (
          <View
            className={styles.clearFilter}
            onClick={() => handleFilterChange('all')}
          >
            <Text className={styles.clearFilterText}>清除筛选</Text>
          </View>
        )}
      </View>

      <View className={styles.mistakesList}>
        {filteredMistakes.length === 0 ? (
          <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🎉</Text>
          <Text className={styles.emptyTitle}>
            {activeFilter !== 'all' ? '该知识点暂无错题' : '暂无错题'}
          </Text>
          <Text className={styles.emptyDesc}>
            {activeFilter !== 'all' ? '切换其他知识点查看，或继续闯关积累错题' : '继续闯关，错题会自动记录在这里供你复习'}
          </Text>
        </View>
      ) : (
          filteredMistakes.map(mistake => {
            const rec = getReviewRecord(mistake.question.id);
            return (
              <View key={mistake.question.id} className={styles.mistakeCard}>
              <View className={styles.mistakeHeader}>
                <Text className={styles.mistakeTitle}>{mistake.question.title}</Text>
                {mistake.reviewed && <Text className={styles.reviewedBadge}>已复习</Text>}
              </View>
              <View style={{ marginBottom: '16rpx' }}>
                <KnowledgeTag category={mistake.question.knowledgeCategory} variant="danger" />
                {rec && (
                  <Text style={{ marginLeft: '12rpx', fontSize: '22rpx', color: '#64748B' }}>
                    复习{rec.reviewCount}次 {rec.lastMastered ? '✓' : ''}
                  </Text>
                )}
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
            );
          })
        )}
      </View>

      {selectedMistake && (
        <View className={styles.detailModal} onClick={handleCloseDetail}>
          <View className={styles.detailContent} onClick={e => e.stopPropagation()}>
            <View className={styles.detailHeader}>
              <Text className={styles.detailTitle}>错题解析</Text>
              <Text className={styles.modalClose} onClick={handleCloseDetail}>×</Text>
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
