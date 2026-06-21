import { KnowledgeCategory, DepartmentType } from '@/types';

export interface CaseItem {
  id: string;
  title: string;
  background: string;
  riskConsequence: string;
  departments: DepartmentType[];
  knowledgeCategory: KnowledgeCategory;
  sampleOptions: {
    text: string;
    riskLevel: 'high' | 'medium' | 'low';
    riskExplanation: string;
    caseReference: string;
  }[];
}

export const CASE_LIBRARY: CaseItem[] = [
  {
    id: 'case-s1',
    title: '删除聊天记录',
    background: '市场监管局突击检查到店，执法人员要求检查员工手机中的客户沟通记录。',
    riskConsequence: '隐藏、伪造、毁灭证据属于严重违法行为，可构成妨害公务罪或帮助毁灭证据罪。',
    departments: ['sales', 'all'],
    knowledgeCategory: 'evidencePreservation',
    sampleOptions: [
      { text: '立即让所有员工删除敏感聊天记录', riskLevel: 'high', riskExplanation: '删除证据属于严重违法行为，将面临更严厉处罚。', caseReference: '【案例·2023年华东某门店】店长组织员工删除微信记录，被认定为"隐匿证据"，处罚金额从5万提高到20万元。' },
      { text: '让员工把手机藏起来', riskLevel: 'high', riskExplanation: '拒绝配合检查属于违法行为。', caseReference: '【案例·2022年某连锁品牌】店员拒绝出示手机，企业被列入经营异常名录。' },
      { text: '要求员工配合检查，同时联系法务', riskLevel: 'low', riskExplanation: '配合检查是法定义务，有权要求法律顾问在场。', caseReference: '【正面案例·2024年某集团】第一时间通知法务，将处罚风险控制在最低限度。' }
    ]
  },
  {
    id: 'case-s2',
    title: '员工独自接受询问',
    background: '执法人员要求单独找一线店员做笔录了解情况。',
    riskConsequence: '普通员工缺乏法律知识，容易在紧张状态下做出对企业不利的陈述。',
    departments: ['all'],
    knowledgeCategory: 'employeeManagement',
    sampleOptions: [
      { text: '让员工独自接受询问', riskLevel: 'high', riskExplanation: '员工作为利害关系人，其陈述可作为对企业不利的证据。', caseReference: '【案例·2022年某分店】新员工独自接受询问，承认了"公司统一培训的虚假宣传话术"，罚款15万元。' },
      { text: '要求企业负责人或法务陪同', riskLevel: 'low', riskExplanation: '企业有权安排负责人或法律顾问陪同。', caseReference: '【正面案例】法务提醒员工"只说自己亲眼看到的"，将影响控制在单店层面。' },
      { text: '让员工统一口径', riskLevel: 'high', riskExplanation: '串供、指使他人作伪证可能构成妨害作证罪。', caseReference: '【案例】经理指使3名员工做虚假陈述，以妨害作证罪移送公安机关。' }
    ]
  },
  {
    id: 'case-l1',
    title: '是否立即缴纳罚款',
    background: '公司收到《行政处罚告知书》，拟处罚款30万元。老板说"花钱消灾，赶紧交了算了"。',
    riskConsequence: '缴纳罚款意味着接受处罚决定，将丧失申请听证和复议的权利。',
    departments: ['all'],
    knowledgeCategory: 'legalCompliance',
    sampleOptions: [
      { text: '立即缴纳罚款了事', riskLevel: 'medium', riskExplanation: '缴纳后将丧失申请听证和复议的权利。', caseReference: '【案例】某公司匆忙缴纳25万元罚款，事后发现适用法律错误，但已过复议期限。' },
      { text: '在3日内申请听证', riskLevel: 'low', riskExplanation: '收到告知书后有3天的听证申请期限，这是法定程序权利。', caseReference: '【正面案例】某公司申请听证后，指出证据链瑕疵，罚款从40万调减至5万元。' },
      { text: '置之不理等对方再来', riskLevel: 'high', riskExplanation: '逾期将产生每日3%的加处罚款。', caseReference: '【案例】某公司对10万元罚款置之不理，3个月后需支付23万余元。' }
    ]
  },
  {
    id: 'case-m1',
    title: '媒体突然联系曝光',
    background: '监管调查尚未结束，某媒体记者突然联系公司，称已收到消费者投诉和"内部爆料"，准备报道公司涉嫌违规的新闻。',
    riskConsequence: '在监管调查结论出来之前，任何不当应对都可能引发更大舆论危机。',
    departments: ['customerService', 'all'],
    knowledgeCategory: 'mediaResponse',
    sampleOptions: [
      { text: '拒绝采访说"无可奉告"', riskLevel: 'medium', riskExplanation: '简单拒绝会被解读为"心虚"或"默认"。', caseReference: '【案例】某品牌挂断记者电话，被报道为"涉事企业态度傲慢"，阅读量突破10万+。' },
      { text: '详细解释把所有事实都告诉媒体', riskLevel: 'high', riskExplanation: '对媒体的陈述可能被断章取义，与后续行政处罚相矛盾。', caseReference: '【案例】某负责人对媒体"坦诚"承认了管理疏漏，被行政处罚决定书引用为"自认违规"证据。' },
      { text: '礼貌回应并记录记者信息，由专人统一回复', riskLevel: 'low', riskExplanation: '先礼貌接待、记录需求，由公关和法务共同拟定官方声明。', caseReference: '【正面案例】某公司24小时内发布措辞严谨的官方声明，有效引导了舆论走向。' }
    ]
  },
  {
    id: 'case-m2',
    title: '社交媒体负面舆情',
    background: '有消费者在微博、小红书等平台发帖爆料公司涉嫌违规，并贴出了相关图片，转发量正在快速上升。',
    riskConsequence: '在信息传播极快的今天，不当应对会引发更大的舆论危机。',
    departments: ['customerService', 'sales'],
    knowledgeCategory: 'mediaResponse',
    sampleOptions: [
      { text: '立即在评论区反驳称消费者造谣', riskLevel: 'high', riskExplanation: '在事实未查清前公开指责消费者，极易引发舆论反噬。', caseReference: '【案例】某品牌官方回怼消费者"造谣要负法律责任"，2小时后被实锤打脸，登上热搜。' },
      { text: '先联系发帖人了解诉求，同时内部核实', riskLevel: 'low', riskExplanation: '大多数消费者发帖是因为正常投诉渠道得不到回应。', caseReference: '【正面案例】某品牌1小时内联系到消费者，消费者主动删帖并发布澄清说明。' },
      { text: '删除公司负面评论，花钱降热搜', riskLevel: 'high', riskExplanation: '删帖和压热搜会被截图留证，形成"欲盖弥彰"效果。', caseReference: '【案例】某公司花50万降热搜，被网友发现后热度暴涨10倍。' }
    ]
  },
  {
    id: 'case-h1',
    title: '离职员工向媒体爆料',
    background: '经查实，向媒体提供信息的是公司一名离职员工，他还在持续向媒体爆料更多内部资料。',
    riskConsequence: '离职员工泄露商业秘密可追究法律责任，但处理不当会引发更多问题。',
    departments: ['hr', 'all'],
    knowledgeCategory: 'employeeManagement',
    sampleOptions: [
      { text: '发送律师函警告，同时评估商业秘密泄露情况', riskLevel: 'low', riskExplanation: '可通过律师函警告停止侵权，保留追究法律责任的权利。', caseReference: '【正面案例】某公司发送律师函同时向法院申请行为保全，法院48小时内作出支持裁定。' },
      { text: '在公司内部群公开指责该员工', riskLevel: 'high', riskExplanation: '公开威胁可能构成寻衅滋事或敲诈勒索。', caseReference: '【案例】HR在500人大群公开泄露离职员工身份证号，被行政拘留。' },
      { text: '花钱买断信息', riskLevel: 'high', riskExplanation: '花钱买断相当于给对方持续敲诈的理由。', caseReference: '【案例】某公司支付30万"封口费"，半年后对方又来要50万。' }
    ]
  },
  {
    id: 'case-r1',
    title: '整改方案敷衍',
    background: '行政处罚决定已生效，监管部门要求15日内提交整改方案并在30日内完成整改。老板说"应付一下就行，别太认真"。',
    riskConsequence: '整改方案是后续复查的依据，流于形式会被认定为"整改不到位"。',
    departments: ['all'],
    knowledgeCategory: 'rectificationTimeline',
    sampleOptions: [
      { text: '随便写一份整改方案交差', riskLevel: 'high', riskExplanation: '整改方案流于形式，复查时容易被认定为"整改不到位"。', caseReference: '【案例】某公司整改方案只有"加强培训"四个字，被启动二次调查，罚款从20万提高到60万。' },
      { text: '制定具体可落地的整改方案', riskLevel: 'low', riskExplanation: '合格整改方案应包含问题清单、原因分析、具体措施、责任人和时限。', caseReference: '【正面案例】某公司28页整改方案逐项对应处罚决定，复查一次性通过。' },
      { text: '整改方案写得越夸张越好', riskLevel: 'medium', riskExplanation: '承诺无法兑现的措施会被认定为"虚假整改"。', caseReference: '【案例】某公司承诺"3日内完成全国200家门店全面整改"，实际不可能完成。' }
    ]
  },
  {
    id: 'case-r2',
    title: '整改复查未通过',
    background: '监管部门组织整改复查，认定部分整改措施落实不到位，出具了复查不合格意见，并约谈公司负责人。',
    riskConsequence: '整改复查不通过意味着违法状态仍在持续，可能被按日连续处罚。',
    departments: ['all'],
    knowledgeCategory: 'rectificationTimeline',
    sampleOptions: [
      { text: '和复查人员争辩，坚持认为已整改到位', riskLevel: 'medium', riskExplanation: '当场争辩不利于问题解决，反而可能被视为态度不好。', caseReference: '【案例】负责人在复查现场与执法人员激烈争辩，被立案调查"拒不整改"。' },
      { text: '虚心接受意见，当场沟通明确整改标准', riskLevel: 'low', riskExplanation: '虚心接受、请教具体标准，避免理解偏差。', caseReference: '【正面案例】某公司当场请复查人员逐条指出问题，3天完成针对性整改，第二次复查顺利通过。' },
      { text: '请客吃饭送礼争取通过', riskLevel: 'high', riskExplanation: '向执法人员行贿构成单位行贿罪。', caseReference: '【案例】某公司负责人给复查人员塞1万元购物卡，被移交纪检监察机关。' }
    ]
  },
  {
    id: 'case-s3',
    title: '整改期间业务调整争议',
    background: '整改方案要求对销售流程进行重大调整，可能影响门店业绩约30%。销售总监强烈反对，说"整改是合规部门的事"。',
    riskConsequence: '如果为了业绩继续原有做法，等于持续违法，复查一定不通过。',
    departments: ['sales'],
    knowledgeCategory: 'rectificationTimeline',
    sampleOptions: [
      { text: '坚决按整改方案执行', riskLevel: 'low', riskExplanation: '整改的本质就是停止和纠正违法经营行为。', caseReference: '【正面案例】某公司果断暂停违规产品线，3个月后推出合规替代产品，业绩逐步回升。' },
      { text: '表面整改实际业务照旧', riskLevel: 'high', riskExplanation: '虚假整改一旦被发现会被从重处罚。', caseReference: '【案例】白天培训合规话术，晚上偷偷用老话术打电话，被暗访录下证据，罚款翻了两番。' },
      { text: '只在被检查的门店整改', riskLevel: 'high', riskExplanation: '行政处罚针对企业整体而非单个门店。', caseReference: '【案例】只整改被查的店，一个月后另一店又被举报，被全区域拉网式检查开出5张罚单。' }
    ]
  },
  {
    id: 'case-l2',
    title: '提交情况说明的策略',
    background: '监管部门要求公司在7日内提交书面情况说明。法务正在出差，老板让你先起草一份提交。',
    riskConsequence: '书面说明将作为案件证据存档，未经评估的自认可能暴露更多问题。',
    departments: ['all'],
    knowledgeCategory: 'regulatoryCommunication',
    sampleOptions: [
      { text: '写一份详细说明主动承认所有问题', riskLevel: 'high', riskExplanation: '书面说明将作为证据存档，未经评估的自认可能暴露未掌握的问题。', caseReference: '【案例】某公司在说明中主动承认了3年前的违规操作，被追溯处罚120万元。' },
      { text: '申请延期提交，等法务审核后再出具', riskLevel: 'low', riskExplanation: '可以书面申请延期，只要理由合理，监管部门通常批准延期3-7天。', caseReference: '【正面案例】某公司申请延期5天获得批准，由专业团队准备申辩材料，成功降低处罚等级。' },
      { text: '先提交再说反正可以修改', riskLevel: 'medium', riskExplanation: '提交的材料都是正式文件会附卷留存，后续修改会被视为前后不一致。', caseReference: '【案例】某公司先提交承认违规的说明，一周后想撤回改口，被质疑"不诚信"。' }
    ]
  }
];
