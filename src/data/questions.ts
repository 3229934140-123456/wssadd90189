import { Question, DepartmentType } from '@/types';

export const QUESTIONS: Question[] = [
  {
    id: 'q1',
    levelId: 'level1',
    title: '是否删除聊天记录',
    scenario: '市场监管局突击检查到店，执法人员要求检查员工手机中的客户沟通记录。你作为门店负责人，第一反应是让员工立即删除涉及销售话术的聊天记录，以免被发现问题。',
    knowledgeCategory: 'evidencePreservation',
    department: 'sales',
    correctAnswerId: 'q1-c',
    options: [
      {
        id: 'q1-a',
        text: '立即让所有员工删除敏感聊天记录',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '隐藏、伪造、毁灭证据属于严重违法行为，可构成妨害公务罪或帮助毁灭证据罪，将面临更严厉的行政处罚甚至刑事责任。监管部门有权调取通讯运营商的后台数据，删除本地记录并不能真正销毁证据。',
        caseReference: '【案例·2023年华东某门店】店长在执法人员进场前3分钟组织员工删除微信记录，最终被认定为"隐匿证据"，处罚金额从原本的5万元提高到20万元，并追加了妨碍公务的行政拘留。'
      },
      {
        id: 'q1-b',
        text: '让员工把手机藏起来，拒绝配合检查',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '拒绝、阻碍监管检查属于违法行为，可被处以警告、罚款，情节严重的还可能追究刑事责任。配合检查是法定义务。',
        caseReference: '【案例·2022年南方某连锁品牌】店员拒绝出示手机并与执法人员发生冲突，企业被列入经营异常名录，品牌形象受损严重，当月门店业绩下滑40%。'
      },
      {
        id: 'q1-c',
        text: '要求员工配合检查，同时立即联系公司法务',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '配合检查是法定义务，但有权要求在法律顾问在场的情况下接受询问。及时通知法务可避免因不懂法而做出不当陈述或承诺。',
        caseReference: '【正面案例·2024年某集团】门店负责人在执法检查时第一时间通知法务，法务人员通过电话指导应答策略，最终将处罚风险控制在最低限度，仅罚款8000元。'
      },
      {
        id: 'q1-d',
        text: '当场承认所有问题，态度好争取从轻处理',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '未经法务评估的自认可能被记录为证据，导致原本可争议的事项变成既定事实。认错态度可以配合，但不要轻易承认具体违法事实。',
        caseReference: '【案例·2023年某区域经理】因急于表现配合态度，在笔录中承认了"长期存在价格欺诈"，实际上仅为个别案例，最终处罚金额是原本预估的3倍。'
      }
    ]
  },
  {
    id: 'q2',
    levelId: 'level1',
    title: '员工是否独自接受询问',
    scenario: '执法人员要求单独找一线店员做笔录了解情况，你作为负责人不确定是否应该让员工独自接受询问。',
    knowledgeCategory: 'employeeManagement',
    department: 'all',
    correctAnswerId: 'q2-b',
    options: [
      {
        id: 'q2-a',
        text: '让员工独自接受询问，相信员工能处理好',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '普通员工缺乏法律知识，容易在紧张状态下做出对企业不利的陈述。员工作为利害关系人，其陈述可作为对企业不利的证据使用。',
        caseReference: '【案例·2022年某分店】一名入职仅1个月的新员工独自接受询问，因紧张承认了"公司统一培训的虚假宣传话术"，被认定为企业行为，最终罚款15万元。'
      },
      {
        id: 'q2-b',
        text: '要求企业负责人或法务陪同，先对员工进行简单指导',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '企业有权安排负责人或法律顾问陪同员工接受询问，也有权在询问前对员工进行合法合规的应答指导，提醒员工如实陈述但不要猜测或推断。',
        caseReference: '【正面案例】法务提前告知员工"只说自己亲眼看到的，不要推测公司整体情况"，有效避免了员工的过度陈述，将影响控制在单店层面。'
      },
      {
        id: 'q2-c',
        text: '让员工统一口径，否认一切问题',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '串供、指使他人作伪证属于严重违法行为，可能构成妨害作证罪。执法人员经验丰富，很容易识别出前后矛盾的陈述。',
        caseReference: '【案例】门店经理指使3名员工做虚假陈述，被执法人员通过交叉询问识破，最终以妨害作证罪移送公安机关。'
      },
      {
        id: 'q2-d',
        text: '声称员工请假了，拖延时间',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '无正当理由拖延检查可能被认定为阻碍执法，反而引起更深入的调查。合理的时间安排（如等待法务到场）是允许的，但不能无故拖延。',
        caseReference: '【案例】以"员工不在"为由拖延3天，最终被监管部门启动全面稽查，查出更多问题。'
      }
    ]
  },
  {
    id: 'q3',
    levelId: 'level1',
    title: '如何处理扣押的经营资料',
    scenario: '执法人员当场扣押了一批销售合同和财务单据，并出具了扣押清单。你不确定接下来该怎么做。',
    knowledgeCategory: 'evidencePreservation',
    department: 'all',
    correctAnswerId: 'q3-c',
    options: [
      {
        id: 'q3-a',
        text: '当场与执法人员争辩，拒绝在扣押清单上签字',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '拒绝签字不影响扣押的法律效力，反而可能被记录为态度不好。如果对扣押有异议，应通过法定程序申请行政复议，而非当场对抗。',
        caseReference: '【案例】负责人拒绝签字并与执法人员争执，被录像记录为"阻碍执法"，后续处罚从重处理。'
      },
      {
        id: 'q3-b',
        text: '悄悄复印备份被扣押的资料，以备后续使用',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '已经被扣押的物品，擅自复制或转移可能构成妨害证据保全。如果需要资料副本，应通过正规程序向监管部门申请查阅或复印。',
        caseReference: '【案例】员工偷偷复印被扣押的合同并进行修改，被认定为篡改证据，追加处罚。'
      },
      {
        id: 'q3-c',
        text: '核对清单后签字，留存好扣押凭证，立即通知法务',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '在核对清单内容与实际相符后签字确认是正确流程，扣押凭证是后续申请复议或诉讼的重要证据。及时移交法务处理可保障程序权利。',
        caseReference: '【正面案例】门店仔细核对了扣押清单的12份文件，发现多列了1份不相关的个人文件并当场指出，避免了无关资料被纳入调查范围。'
      },
      {
        id: 'q3-d',
        text: '趁执法人员不注意，拿回几份关键合同',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '擅自转移已扣押的物品属于严重违法行为，可构成非法处置查封、扣押、冻结的财产罪，将面临刑事责任。',
        caseReference: '【案例】负责人趁乱拿回2份合同，被监控拍下，最终以非法处置扣押财产罪被追究刑事责任。'
      }
    ]
  },
  {
    id: 'q4',
    levelId: 'level2',
    title: '收到处罚告知书后是否立即缴纳',
    scenario: '公司收到《行政处罚告知书》，拟处罚款30万元。老板说"花钱消灾，赶紧交了算了"，但你觉得有些事实认定有问题。',
    knowledgeCategory: 'legalCompliance',
    department: 'all',
    correctAnswerId: 'q4-b',
    options: [
      {
        id: 'q4-a',
        text: '听从老板建议，立即缴纳罚款了事',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '缴纳罚款意味着接受处罚决定，将丧失申请听证和复议的权利。行政处罚记录会被公示，影响企业信用评级、招投标资格和融资。',
        caseReference: '【案例】某公司匆忙缴纳25万元罚款，事后发现该处罚适用法律错误，但已过复议期限无法救济，且该处罚记录导致公司错失一项500万元的政府采购项目。'
      },
      {
        id: 'q4-b',
        text: '在3日内申请听证，同时由法务评估处罚依据',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '收到告知书后有3天的听证申请期限，这是法定程序权利。通过听证可以当面陈述申辩理由，很多处罚金额在听证阶段得到调减或撤销。',
        caseReference: '【正面案例】某公司收到40万元处罚告知后申请听证，在听证会上指出证据链存在瑕疵，最终监管部门主动将罚款调减至5万元。'
      },
      {
        id: 'q4-c',
        text: '置之不理，等对方再来找再说',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '逾期不申请听证也不缴纳罚款，处罚决定书会生效并产生每日3%的加处罚款，还可能被法院强制执行，影响法定代表人高消费。',
        caseReference: '【案例】某公司对10万元罚款置之不理，3个月后加处罚款累计到10万元，加上滞纳金共需支付23万余元，银行账户被法院冻结。'
      },
      {
        id: 'q4-d',
        text: '找熟人关系打点，争取内部撤销',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '通过行贿等不正当手段影响处罚决定，企业和相关个人均可能构成行贿罪或单位行贿罪，面临刑事追责。',
        caseReference: '【案例】某企业负责人托关系送了5万元给经办人员希望撤案，结果双双被查，企业因行贿罪被判处罚金，负责人被判处缓刑。'
      }
    ]
  },
  {
    id: 'q5',
    levelId: 'level2',
    title: '提交情况说明的策略',
    scenario: '监管部门要求公司在7日内提交书面情况说明。法务正在出差，老板让你先起草一份说明提交。',
    knowledgeCategory: 'regulatoryCommunication',
    department: 'all',
    correctAnswerId: 'q5-d',
    options: [
      {
        id: 'q5-a',
        text: '写一份详细的情况说明，主动承认所有可能的问题',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '书面说明将作为案件证据存档。未经评估的自认可能把原本监管部门未掌握的问题主动暴露，形成"自认证据"。',
        caseReference: '【案例】某公司在情况说明中主动承认了3年前的一笔违规操作，而监管部门原本只在调查近期一起投诉，最终被追溯处罚了3年的违规所得共计120万元。'
      },
      {
        id: 'q5-b',
        text: '只写"情况不属实"四个字，不提供具体解释',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '过于简单的申辩无法让监管部门了解企业立场，可能被视为不配合调查，反而不利于问题解决。合理的申辩需要有事实和证据支撑。',
        caseReference: '【案例】某公司回复过于简略，被监管部门认定为"态度消极"，启动了更全面的专项稽查。'
      },
      {
        id: 'q5-c',
        text: '先提交再说，反正可以修改',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '提交给监管部门的书面材料都是正式文件，会附卷留存。后续修改会被视为前后陈述不一致，降低可信度。',
        caseReference: '【案例】某公司先提交了一份承认违规的说明，一周后又想撤回改口，被质疑"不诚信"，不利陈述已被记录在案。'
      },
      {
        id: 'q5-d',
        text: '申请延期提交，等法务审核后再出具正式说明',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '可以书面申请延期提交说明，说明理由（如法务出差、需要核实资料等），只要理由合理，监管部门通常会批准延期3-7天。',
        caseReference: '【正面案例】某公司以"需要调取历史数据并经法务审核"为由申请延期5天，获得批准后由专业团队准备了一份有证据支撑的申辩材料，成功降低了处罚等级。'
      }
    ]
  },
  {
    id: 'q6',
    levelId: 'level2',
    title: '如何回应处罚听证',
    scenario: '公司申请的行政处罚听证会即将召开，法务建议你作为业务负责人出席作证。',
    knowledgeCategory: 'regulatoryCommunication',
    department: 'all',
    correctAnswerId: 'q6-c',
    options: [
      {
        id: 'q6-a',
        text: '出席时态度强硬，逐条驳斥监管方的所有指控',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '听证不是辩论赛，过于强硬的对抗态度可能引起听证主持人反感。合理的申辩应基于事实和证据，而非情绪化反驳。',
        caseReference: '【案例】某负责人在听证会上激烈指责执法人员"钓鱼执法"，未提供任何证据，最终被认定态度恶劣，从重处罚。'
      },
      {
        id: 'q6-b',
        text: '表示企业很困难，请求同情减免罚款',
        riskLevel: 'low',
        isCorrect: false,
        riskExplanation: '行政处罚的金额依据是违法事实和法律规定，而非企业经营状况。除非符合法定减免条件（如主动消除危害后果、配合查处有立功表现等），单纯求情效果有限。',
        caseReference: '【案例】某企业在听证会上大谈经营困难却不针对处罚依据申辩，听证主持人当庭表示"困难不是违法的理由"，维持原处罚决定。'
      },
      {
        id: 'q6-c',
        text: '由法务主导陈述，业务负责人只回答事实问题',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '法律适用问题由法务专业陈述，业务负责人就事实经过做客观陈述，不做法律判断和定性。这种分工既能保证专业性，又能避免说错话。',
        caseReference: '【正面案例】在法务的精心准备下，业务负责人客观陈述了事件经过和已采取的整改措施，法务则从法律适用和证据链角度进行申辩，最终将罚款从30万元降至8万元。'
      },
      {
        id: 'q6-d',
        text: '业务负责人不出席，全权委托法务处理',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '虽然法律上可以全权委托，但业务负责人缺席可能被视为对案件不重视。涉及具体业务事实的问题，法务可能无法准确回答。',
        caseReference: '【案例】法务独自出席，但因不了解具体业务细节，在回答业务流程问题时含糊不清，被认定为"事实陈述不清"。'
      }
    ]
  },
  {
    id: 'q7',
    levelId: 'level3',
    title: '媒体突然联系曝光',
    scenario: '监管部门的调查尚未结束，某媒体记者突然联系公司，称已收到消费者投诉和"内部爆料"，准备报道公司涉嫌违规的新闻，并要求采访。',
    knowledgeCategory: 'mediaResponse',
    department: 'all',
    correctAnswerId: 'q7-c',
    options: [
      {
        id: 'q7-a',
        text: '拒绝采访，说"无可奉告"并挂断电话',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '简单粗暴的拒绝会被解读为"心虚"或"默认"，记者可能在报道中特别强调这一点，引发公众更大的质疑。',
        caseReference: '【案例】某品牌公关直接挂断记者电话，被报道为"涉事企业态度傲慢，拒绝回应质疑"，该报道阅读量迅速突破10万+，品牌口碑急剧下滑。'
      },
      {
        id: 'q7-b',
        text: '详细解释情况，把所有事实都告诉记者',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '在监管调查结论出来之前，任何对媒体的陈述都可能被断章取义，甚至与后续行政处罚决定相矛盾，造成更大被动。',
        caseReference: '【案例】某负责人对媒体"坦诚"承认了管理疏漏，最终被行政处罚决定书引用为"自认违规"的证据，无法再争议。'
      },
      {
        id: 'q7-c',
        text: '礼貌回应并记录记者信息，由专人统一回复',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '专业的媒体应对是：先礼貌接待，记录对方身份和采访需求，告知会有专人统一回复，不做任何实质性表态。随后由公关和法务共同拟定官方声明。',
        caseReference: '【正面案例】某公司公关团队在接到媒体电话后24小时内发布了一份措辞严谨的官方声明，表明"正在配合监管调查，最终结论以官方通报为准"，有效引导了舆论走向。'
      },
      {
        id: 'q7-d',
        text: '找关系给媒体"封口费"撤稿',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '向媒体或记者支付费用撤稿，可能构成对非国家工作人员行贿罪。且一旦曝光，会引发更大的舆论危机，形成"二次伤害"。',
        caseReference: '【案例】某企业花20万元"摆平"媒体，结果被对方录音举报，不但报道没撤下来，还新增了行贿嫌疑，法定代表人被立案调查。'
      }
    ]
  },
  {
    id: 'q8',
    levelId: 'level3',
    title: '社交媒体上的负面舆情',
    scenario: '有消费者在微博、小红书等平台发帖爆料你公司涉嫌违规，并贴出了相关图片和聊天记录，转发量正在快速上升。',
    knowledgeCategory: 'mediaResponse',
    department: 'customerService',
    correctAnswerId: 'q8-b',
    options: [
      {
        id: 'q8-a',
        text: '立即在评论区反驳，称消费者造谣',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '在事实未查清前公开指责消费者，极易引发"店大欺客"的舆论反噬。如果后续证实消费者所说属实，企业的公信力将彻底崩塌。',
        caseReference: '【案例】某品牌官方账号在评论区回怼消费者"造谣要负法律责任"，结果2小时后消费者贴出了更多实锤证据，品牌被全网群嘲为"嘴硬"，相关话题登上热搜榜第二名。'
      },
      {
        id: 'q8-b',
        text: '先联系发帖人了解诉求，同时内部核实情况',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '大多数消费者发帖是因为正常投诉渠道得不到回应。先私下联系了解具体诉求，同时内部核实事实真相，是解决舆情的第一步。很多危机在这个阶段就能化解。',
        caseReference: '【正面案例】某品牌在消费者发帖后1小时内联系到对方，承认客服处理不当并给予合理赔偿，消费者主动删除了帖子并发布了一条澄清说明，舆情在发酵前就被平息。'
      },
      {
        id: 'q8-c',
        text: '删除公司负面评论，花钱降热搜',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '删帖和压热搜会被网友截图留证，反而坐实"有问题"的猜测，形成"欲盖弥彰"的效果。花钱操控舆论还可能涉嫌违法。',
        caseReference: '【案例】某公司花50万降热搜，被网友发现后话题热度反而暴涨10倍，从10万阅读量冲到了5000万+，最终监管部门主动介入调查。'
      },
      {
        id: 'q8-d',
        text: '不做回应，等热度自然消退',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '在信息传播极快的今天，"冷处理"往往等于默认。沉默的每一小时，舆论都可能向更坏的方向发展。超过24小时不回应，基本就错过了最佳处置窗口。',
        caseReference: '【案例】某公司选择沉默应对，3天后负面话题阅读量突破1亿，多家主流媒体跟进报道，此时再发声明已经没有人相信了。'
      }
    ]
  },
  {
    id: 'q9',
    levelId: 'level3',
    title: '内部员工向媒体爆料',
    scenario: '经查实，向媒体提供信息的是公司一名离职员工，他还在持续向媒体爆料更多内部资料。',
    knowledgeCategory: 'employeeManagement',
    department: 'hr',
    correctAnswerId: 'q9-a',
    options: [
      {
        id: 'q9-a',
        text: '发送律师函警告，同时评估商业秘密泄露情况',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '离职员工泄露商业秘密或保密信息，可通过律师函警告其停止侵权，并保留追究法律责任的权利。同时评估泄露范围，对已泄露的信息制定应对策略。',
        caseReference: '【正面案例】某公司在发送律师函的同时，向法院申请了行为保全（临时禁令），要求离职员工立即停止传播公司机密，法院在48小时内作出了支持裁定。'
      },
      {
        id: 'q9-b',
        text: '在公司内部群公开指责该员工并威胁报复',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '公开威胁不但违法（可能构成寻衅滋事或敲诈勒索），还会被对方截图作为证据使用，同时寒了在职员工的心。',
        caseReference: '【案例】HR在公司500人大群里公开泄露离职员工的身份证号和家庭住址并威胁"小心点"，被员工以侵犯隐私权和威胁人身安全报警，HR被行政拘留。'
      },
      {
        id: 'q9-c',
        text: '联系员工私下和解，花钱买断信息',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '花钱买断相当于给对方一个持续敲诈的理由，后续可能被反复勒索。且如果涉及违法事实的掩盖，还可能构成包庇。',
        caseReference: '【案例】某公司给离职员工支付了30万"封口费"，结果对方半年后又来要50万，不给就继续爆料，形成了无底洞。'
      },
      {
        id: 'q9-d',
        text: '开除所有与该员工有联系的在职员工',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '无正当理由批量辞退员工可能构成违法解除劳动合同，面临大量劳动仲裁赔偿，同时引发内部恐慌和更多人向媒体爆料。',
        caseReference: '【案例】某公司以"泄密嫌疑"为由辞退了8名与离职员工有微信联系的员工，全部被判违法解除，共支付赔偿金60余万元。'
      }
    ]
  },
  {
    id: 'q10',
    levelId: 'level4',
    title: '整改方案的制定',
    scenario: '行政处罚决定已生效，监管部门要求15日内提交整改方案并在30日内完成整改。老板说"应付一下就行，别太认真"。',
    knowledgeCategory: 'rectificationTimeline',
    department: 'all',
    correctAnswerId: 'q10-c',
    options: [
      {
        id: 'q10-a',
        text: '随便写一份整改方案交差，反正不会仔细看',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '整改方案是后续复查的依据。如果方案本身流于形式，复查时很容易被认定为"整改不到位"，可能触发新一轮处罚或加倍罚款。',
        caseReference: '【案例】某公司提交的整改方案只有"加强培训"四个字，复查时被认定为"整改措施不具体、无操作性"，监管部门启动了二次调查，罚款从20万提高到了60万。'
      },
      {
        id: 'q10-b',
        text: '整改方案写得越夸张越好，显得态度好',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '整改方案需要具备可执行性。如果承诺了无法兑现的整改措施（如"一周内完成全员高级合规认证"），复查时无法完成反而被认定为"虚假整改"。',
        caseReference: '【案例】某公司承诺"3日内完成全国200家门店全面整改"，实际根本不可能完成，复查时被认定为"敷衍塞责"，被追加处罚。'
      },
      {
        id: 'q10-c',
        text: '制定具体可落地的整改方案，明确责任人和时间节点',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '一份合格的整改方案应包含：问题清单、原因分析、具体整改措施（可量化、可验证）、责任部门/责任人、完成时限、验收标准、长效机制等要素。',
        caseReference: '【正面案例】某公司的整改方案长达28页，逐项对应处罚决定书认定的违法事实，制定了5大项18小项整改措施，每项都有具体责任人和完成时限，复查时一次性通过。'
      },
      {
        id: 'q10-d',
        text: '只整改表面问题，核心问题能拖就拖',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '监管复查非常关注根本性问题是否解决。如果只做表面文章而核心问题依旧，会被认定为"拒不整改"，可按日连续处罚。',
        caseReference: '【案例】某公司在门店贴了几张合规海报就算"整改"，但核心的虚假宣传话术没有改变，被复查发现后按日连续处罚，10天就多罚了30万。'
      }
    ]
  },
  {
    id: 'q11',
    levelId: 'level4',
    title: '整改复查未通过',
    scenario: '监管部门组织整改复查，认定部分整改措施落实不到位，出具了复查不合格意见，并约谈公司负责人。',
    knowledgeCategory: 'rectificationTimeline',
    department: 'all',
    correctAnswerId: 'q11-d',
    options: [
      {
        id: 'q11-a',
        text: '和复查人员争辩，坚持认为已经整改到位',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '当场争辩不利于问题解决，反而可能让复查人员认为态度不好。如果对复查意见有异议，应通过书面渠道申请复核，而非当场对抗。',
        caseReference: '【案例】负责人在复查现场与执法人员激烈争辩，被记录为"拒绝接受监督意见"，直接被立案调查是否存在"拒不整改"情形。'
      },
      {
        id: 'q11-b',
        text: '赶紧请客吃饭送礼，争取下次复查通过',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '向执法人员行贿构成单位行贿罪，企业和相关个人都将被追究刑事责任。这是绝对不能触碰的红线。',
        caseReference: '【案例】某公司负责人给复查人员塞了1万元购物卡，被当场拒绝并移交纪检监察机关，公司因行贿被立案调查。'
      },
      {
        id: 'q11-c',
        text: '反正也整改不好，干脆放弃不管了',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '整改复查不通过意味着违法状态仍在持续，监管部门可以依法按日连续处罚，还可以申请法院强制执行，甚至将企业列入严重违法失信名单。',
        caseReference: '【案例】某公司放弃整改，3个月后被按日连续处罚累计达90万元，法定代表人被限制高消费，公司被列入经营异常名录。'
      },
      {
        id: 'q11-d',
        text: '虚心接受意见，当场沟通明确整改标准，立即重新制定方案',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '复查不合格说明整改与监管的预期存在差距。虚心接受、当场请教"具体怎么做才算达标"，可以避免理解偏差。然后立即重新制定更符合要求的整改方案并加快落实。',
        caseReference: '【正面案例】某公司在复查未通过后，当场请复查人员逐条指出问题和具体标准，回去后用3天时间完成了针对性整改，第二次复查顺利通过，未被追加处罚。'
      }
    ]
  },
  {
    id: 'q12',
    levelId: 'level4',
    title: '整改期间的业务安排',
    scenario: '整改方案要求对销售流程进行重大调整，可能影响门店业绩约30%。销售总监强烈反对，说"整改是合规部门的事，不能影响业务"。',
    knowledgeCategory: 'rectificationTimeline',
    department: 'sales',
    correctAnswerId: 'q12-a',
    options: [
      {
        id: 'q12-a',
        text: '坚决按整改方案执行，业务调整是整改的必要代价',
        riskLevel: 'low',
        isCorrect: true,
        riskExplanation: '整改的本质就是停止和纠正违法经营行为。如果为了业绩继续原有做法，等于持续违法，复查一定不通过，还可能被认定为"拒不整改"，法律后果更严重。',
        caseReference: '【正面案例】某公司果断暂停了被认定违规的高利润产品线，虽然短期业绩下滑，但整改顺利通过，避免了被吊销营业执照的风险，3个月后推出了合规替代产品，业绩逐步回升。'
      },
      {
        id: 'q12-b',
        text: '表面整改，实际业务照旧做',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '"明修栈道暗度陈仓"式的虚假整改一旦被发现，会被从重处罚。监管部门的复查经常会采取突击检查、暗访等方式，很难蒙混过关。',
        caseReference: '【案例】某公司白天培训合规话术，晚上偷偷让销售继续用老话术打电话，被监管部门暗访录下证据，以"拒不整改"和"提供虚假材料"双重名义从重处罚，罚款翻了两番。'
      },
      {
        id: 'q12-c',
        text: '只在被检查的门店整改，其他门店继续',
        riskLevel: 'high',
        isCorrect: false,
        riskExplanation: '行政处罚针对的是企业整体而非单个门店。如果其他门店继续违规，等于企业的违法状态没有消除，随时可能被再次处罚。',
        caseReference: '【案例】某公司只整改了被查的那家店，一个月后另一家店又被举报，被认定为"屡教不改"，监管部门对其进行了全区域门店拉网式检查，开出了5张罚单。'
      },
      {
        id: 'q12-d',
        text: '让合规部门想办法既不改变业务又能通过复查',
        riskLevel: 'medium',
        isCorrect: false,
        riskExplanation: '整改的核心要求是"实质改正"，而非形式合规。试图找"捷径"绕过整改要求，本质就是虚假整改，一旦被识破后果严重。',
        caseReference: '【案例】某公司试图让合规部门设计一套"表面合规话术"，结果被复查人员认定为"换汤不换药"，属于整改不到位。'
      }
    ]
  }
];

export function getQuestionsByLevel(levelId: string): Question[] {
  return QUESTIONS.filter(q => q.levelId === levelId);
}

export function getQuestionsByDepartment(dept: DepartmentType): Question[] {
  return QUESTIONS.filter(q => q.department === dept || q.department === 'all');
}
