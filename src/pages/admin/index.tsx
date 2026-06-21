import React, { useState, useMemo } from 'react';
import { View, Text, Button, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useLearning } from '@/store/LearningContext';
import {
  Question,
  QuestionOption,
  RiskLevel,
  DepartmentType,
  KnowledgeCategory,
  CATEGORY_KNOWLEDGE,
  DEPARTMENT_NAMES
} from '@/types';
import { LEVELS } from '@/data/levels';
import { CASE_LIBRARY, CaseItem } from '@/data/cases';

const optionLetters = ['A', 'B', 'C', 'D'];
const riskLevels: { key: RiskLevel; label: string }[] = [
  { key: 'high', label: '高风险' },
  { key: 'medium', label: '中风险' },
  { key: 'low', label: '低风险' }
];

const emptyOption = (id: string): QuestionOption => ({
  id,
  text: '',
  riskLevel: 'medium',
  isCorrect: false,
  riskExplanation: '',
  caseReference: ''
});

const AdminPage: React.FC = () => {
  const { questions, levels, addQuestion, updateQuestion, deleteQuestion } = useLearning();
  const [activeTab, setActiveTab] = useState<'list' | 'versions'>('list');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showCasePicker, setShowCasePicker] = useState(false);

  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    scenario: string;
    levelId: string;
    department: DepartmentType;
    knowledgeCategory: KnowledgeCategory;
    options: QuestionOption[];
  }>({
    id: '',
    title: '',
    scenario: '',
    levelId: 'level1',
    department: 'all',
    knowledgeCategory: 'evidencePreservation',
    options: ['opt1', 'opt2', 'opt3', 'opt4'].map(id => emptyOption(id))
  });

  const filteredQuestions = useMemo(() => {
    if (filterLevel === 'all') return questions;
    return questions.filter(q => q.levelId === filterLevel);
  }, [questions, filterLevel]);

  const handleAdd = () => {
    const newId = `q${Date.now()}`;
    setEditingQuestion(null);
    setFormData({
      id: newId,
      title: '',
      scenario: '',
      levelId: filterLevel !== 'all' ? filterLevel : 'level1',
      department: 'all',
      knowledgeCategory: 'evidencePreservation',
      options: ['opt1', 'opt2', 'opt3', 'opt4'].map(id => emptyOption(`${newId}-${id}`))
    });
    setShowModal(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      id: question.id,
      title: question.title,
      scenario: question.scenario,
      levelId: question.levelId,
      department: question.department,
      knowledgeCategory: question.knowledgeCategory,
      options: question.options.map(opt => ({ ...opt }))
    });
    setShowModal(true);
  };

  const handleDelete = (questionId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '删除后该题目将从所有关卡中移除，确定删除吗？',
      confirmText: '删除',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          deleteQuestion(questionId);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

  const handleSelectCase = (caseItem: CaseItem) => {
    const baseOptions = caseItem.sampleOptions.slice(0, 4);
    const paddedOptions: QuestionOption[] = [];
    for (let i = 0; i < 4; i++) {
      if (baseOptions[i]) {
        paddedOptions.push({
          id: `${formData.id}-opt${i + 1}`,
          text: baseOptions[i].text,
          riskLevel: baseOptions[i].riskLevel,
          isCorrect: baseOptions[i].riskLevel === 'low',
          riskExplanation: baseOptions[i].riskExplanation,
          caseReference: baseOptions[i].caseReference
        });
      } else {
        paddedOptions.push(emptyOption(`${formData.id}-opt${i + 1}`));
      }
    }

    setFormData({
      ...formData,
      title: caseItem.title,
      scenario: caseItem.background + '\n\n风险后果：' + caseItem.riskConsequence,
      department: caseItem.departments[0] || 'all',
      knowledgeCategory: caseItem.knowledgeCategory,
      options: paddedOptions
    });
    setShowCasePicker(false);
    Taro.showToast({ title: '已填充案例，请补充选项', icon: 'none', duration: 2000 });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Taro.showToast({ title: '请输入题目标题', icon: 'none' });
      return;
    }
    if (!formData.scenario.trim()) {
      Taro.showToast({ title: '请输入情景描述', icon: 'none' });
      return;
    }

    const hasValidOptions = formData.options.filter(o => o.text.trim()).length >= 2;
    if (!hasValidOptions) {
      Taro.showToast({ title: '请至少填写2个选项', icon: 'none' });
      return;
    }

    const correctOption = formData.options.find(o => o.isCorrect);
    if (!correctOption) {
      Taro.showToast({ title: '请设置一个正确答案', icon: 'none' });
      return;
    }

    const question: Question = {
      id: formData.id,
      levelId: formData.levelId,
      title: formData.title,
      scenario: formData.scenario,
      knowledgeCategory: formData.knowledgeCategory,
      department: formData.department,
      correctAnswerId: correctOption.id,
      options: formData.options.filter(o => o.text.trim())
    };

    if (editingQuestion) {
      updateQuestion(question);
      Taro.showToast({ title: '更新成功', icon: 'success' });
    } else {
      addQuestion(question);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }

    setShowModal(false);
  };

  const updateOption = (index: number, field: keyof QuestionOption, value: any) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value };
    }
    setFormData({ ...formData, options: newOptions });
  };

  const getLevelName = (levelId: string) => {
    const level = levels.find(l => l.id === levelId) || LEVELS.find(l => l.id === levelId);
    return level ? level.title : levelId;
  };

  return (
    <ScrollView scrollY className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>管理后台</Text>
        <Text className={styles.headerDesc}>题库管理 · 岗位版本 · 数据统计</Text>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tab, activeTab === 'list' && styles.active)}
          onClick={() => setActiveTab('list')}
        >
          <Text>题库管理</Text>
        </View>
        <View
          className={classnames(styles.tab, activeTab === 'versions' && styles.active)}
          onClick={() => setActiveTab('versions')}
        >
          <Text>岗位版本</Text>
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'list' ? (
          <>
            <View className={styles.pickerGroup} style={{ marginBottom: '24rpx' }}>
              <View
                className={classnames(styles.pickerItem, filterLevel === 'all' && styles.active)}
                onClick={() => setFilterLevel('all')}
              >
                <Text>全部 ({questions.length})</Text>
              </View>
              {(levels.length > 0 ? levels : LEVELS).map(level => {
                const count = questions.filter(q => q.levelId === level.id).length;
                return (
                  <View
                    key={level.id}
                    className={classnames(styles.pickerItem, filterLevel === level.id && styles.active)}
                    onClick={() => setFilterLevel(level.id)}
                  >
                    <Text>{level.title} ({count})</Text>
                  </View>
                );
              })}
            </View>

            <Button className={styles.addButton} onClick={handleAdd}>
              + 新增情景题目
            </Button>

            {filteredQuestions.length === 0 ? (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📝</Text>
                <Text className={styles.emptyText}>暂无题目，点击上方按钮添加</Text>
              </View>
            ) : (
              <View className={styles.questionList}>
                {filteredQuestions.map(q => (
                  <View key={q.id} className={styles.questionItem}>
                    <View className={styles.questionHeader}>
                      <Text className={styles.questionTitle}>{q.title}</Text>
                      <View className={styles.questionActions}>
                        <Button
                          className={classnames(styles.actionBtn, styles.edit)}
                          onClick={() => handleEdit(q)}
                        >
                          编辑
                        </Button>
                        <Button
                          className={classnames(styles.actionBtn, styles.delete)}
                          onClick={() => handleDelete(q.id)}
                        >
                          删除
                        </Button>
                      </View>
                    </View>
                    <Text className={styles.questionScenario}>{q.scenario}</Text>
                    <View className={styles.questionMeta}>
                      <Text className={classnames(styles.metaTag, styles.level)}>
                        {getLevelName(q.levelId)}
                      </Text>
                      <Text className={classnames(styles.metaTag, styles.dept)}>
                        {DEPARTMENT_NAMES[q.department]}
                      </Text>
                      <Text className={classnames(styles.metaTag, styles.category)}>
                        {CATEGORY_KNOWLEDGE.find(c => c.key === q.knowledgeCategory)?.name}
                      </Text>
                      <Text className={styles.metaTag}>
                        {q.options.length} 个选项
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <View className={styles.sectionCard}>
              <Text className={styles.sectionTitle}>岗位版本说明</Text>
              <Text className={styles.sectionDesc}>
                每个岗位版本会优先展示对应部门的题目，再展示通用题目。
                新增题目时选择对应的"适用部门"即可实现岗位差异化。
              </Text>
            </View>

            {Object.entries(DEPARTMENT_NAMES).map(([key, name]) => {
              const deptQuestions = questions.filter(q => q.department === key);
              const genericQuestions = questions.filter(q => q.department === 'all');
              return (
                <View key={key} className={styles.questionItem}>
                  <View className={styles.questionHeader}>
                    <Text className={styles.questionTitle}>{name}</Text>
                  </View>
                  <View className={styles.questionMeta}>
                    <Text className={classnames(styles.metaTag, styles.dept)}>
                      专属题目 {deptQuestions.length} 道
                    </Text>
                    <Text className={classnames(styles.metaTag, styles.category)}>
                      通用题目 {genericQuestions.length} 道
                    </Text>
                    <Text className={styles.metaTag}>
                      合计 {deptQuestions.length + genericQuestions.length} 道
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </View>

      {showModal && (
        <View className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>
                {editingQuestion ? '编辑题目' : '新增题目'}
              </Text>
              <Text className={styles.modalClose} onClick={() => setShowModal(false)}>×</Text>
            </View>

            <ScrollView scrollY className={styles.modalBody}>
              {!editingQuestion && (
                <View className={styles.formGroup}>
                  <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text className={styles.formLabel}>从案例库选取</Text>
                    <View
                      className={classnames(styles.pickerItem, styles.active)}
                      onClick={() => setShowCasePicker(true)}
                    >
                      <Text>📋 选择案例</Text>
                    </View>
                  </View>
                  <Text className={styles.helpText}>
                    选择案例后自动填充情景描述、适用岗位、知识点和选项，也可手动填写
                  </Text>
                </View>
              )}

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>题目标题</Text>
                <Input
                  className={styles.formInput}
                  placeholder="如：是否立即删除聊天记录"
                  value={formData.title}
                  onInput={e => setFormData({ ...formData, title: e.detail.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>情景描述</Text>
                <Textarea
                  className={classnames(styles.formInput, styles.formTextarea)}
                  placeholder="详细描述遇到的监管场景..."
                  value={formData.scenario}
                  onInput={e => setFormData({ ...formData, scenario: e.detail.value })}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>所属关卡</Text>
                <View className={styles.pickerGroup}>
                  {(levels.length > 0 ? levels : LEVELS).map(level => (
                    <View
                      key={level.id}
                      className={classnames(
                        styles.pickerItem,
                        formData.levelId === level.id && styles.active
                      )}
                      onClick={() => setFormData({ ...formData, levelId: level.id })}
                    >
                      <Text>{level.title}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>适用部门（岗位版本）</Text>
                <View className={styles.pickerGroup}>
                  {Object.entries(DEPARTMENT_NAMES).map(([key, name]) => (
                    <View
                      key={key}
                      className={classnames(
                        styles.pickerItem,
                        formData.department === key && styles.active
                      )}
                      onClick={() => setFormData({
                        ...formData,
                        department: key as DepartmentType
                      })}
                    >
                      <Text>{name}</Text>
                    </View>
                  ))}
                </View>
                <Text className={styles.helpText}>
                  选择"通用版"所有岗位都能看到；选择具体部门则该岗位版本优先展示
                </Text>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>知识点分类</Text>
                <View className={styles.pickerGroup}>
                  {CATEGORY_KNOWLEDGE.map(cat => (
                    <View
                      key={cat.key}
                      className={classnames(
                        styles.pickerItem,
                        formData.knowledgeCategory === cat.key && styles.active
                      )}
                      onClick={() => setFormData({
                        ...formData,
                        knowledgeCategory: cat.key as KnowledgeCategory
                      })}
                    >
                      <Text>{cat.name}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>选项配置（点击"设为正确"标记答案）</Text>
                {formData.options.map((option, idx) => (
                  <View key={option.id} className={styles.optionGroup}>
                    <View className={styles.optionHeader}>
                      <Text className={styles.optionLabel}>选项 {optionLetters[idx]}</Text>
                      <View className={styles.optionSettings}>
                        <View
                          className={classnames(
                            styles.pickerItem,
                            styles.settingLabel,
                            option.isCorrect && styles.correct
                          )}
                          onClick={() => updateOption(idx, 'isCorrect', true)}
                        >
                          <Text>{option.isCorrect ? '✓ 正确答案' : '设为正确'}</Text>
                        </View>
                      </View>
                    </View>

                    <Input
                      className={styles.formInput}
                      placeholder="选项内容"
                      value={option.text}
                      onInput={e => updateOption(idx, 'text', e.detail.value)}
                      style={{ marginBottom: '16rpx' }}
                    />

                    <Text className={styles.settingLabel} style={{ marginBottom: '8rpx' }}>
                      风险等级
                    </Text>
                    <View className={styles.riskPicker} style={{ marginBottom: '16rpx' }}>
                      {riskLevels.map(r => (
                        <View
                          key={r.key}
                          className={classnames(
                            styles.riskItem,
                            styles[r.key],
                            option.riskLevel === r.key && styles.active
                          )}
                          onClick={() => updateOption(idx, 'riskLevel', r.key)}
                        >
                          <Text>{r.label}</Text>
                        </View>
                      ))}
                    </View>

                    <Text className={styles.settingLabel} style={{ marginBottom: '8rpx' }}>
                      风险解释
                    </Text>
                    <Textarea
                      className={classnames(styles.formInput, styles.formTextarea)}
                      placeholder="说明该选择存在的风险..."
                      value={option.riskExplanation}
                      onInput={e => updateOption(idx, 'riskExplanation', e.detail.value)}
                      style={{ marginBottom: '16rpx', minHeight: '100rpx' }}
                    />

                    <Text className={styles.settingLabel} style={{ marginBottom: '8rpx' }}>
                      案例参考（脱敏）
                    </Text>
                    <Textarea
                      className={classnames(styles.formInput, styles.formTextarea)}
                      placeholder="引用公司过往真实案例..."
                      value={option.caseReference}
                      onInput={e => updateOption(idx, 'caseReference', e.detail.value)}
                      style={{ minHeight: '100rpx' }}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>

            <View className={styles.modalFooter}>
              <Button className={styles.footerBtn} onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button className={classnames(styles.footerBtn, styles.primary)} onClick={handleSubmit}>
                {editingQuestion ? '保存修改' : '添加题目'}
              </Button>
            </View>
          </View>
        </View>
      )}

      {showCasePicker && (
        <View className={styles.modalOverlay} onClick={() => setShowCasePicker(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>📋 选择案例</Text>
              <Text className={styles.modalClose} onClick={() => setShowCasePicker(false)}>×</Text>
            </View>
            <ScrollView scrollY className={styles.modalBody}>
              {CASE_LIBRARY.map(caseItem => (
                <View
                  key={caseItem.id}
                  className={styles.caseCard}
                  onClick={() => handleSelectCase(caseItem)}
                >
                  <View className={styles.caseCardHeader}>
                    <Text className={styles.caseCardTitle}>{caseItem.title}</Text>
                    <View className={styles.caseCardDepts}>
                      {caseItem.departments.map(d => (
                        <Text key={d} className={classnames(styles.metaTag, styles.dept)}>
                          {DEPARTMENT_NAMES[d as DepartmentType]}
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className={styles.caseCardBg}>{caseItem.background}</Text>
                  <View className={styles.caseCardMeta}>
                    <Text className={classnames(styles.metaTag, styles.category)}>
                      {CATEGORY_KNOWLEDGE.find(c => c.key === caseItem.knowledgeCategory)?.name}
                    </Text>
                    <Text className={styles.metaTag}>
                      {caseItem.sampleOptions.length} 个参考选项
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AdminPage;
