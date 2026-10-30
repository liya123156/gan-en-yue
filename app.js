'use strict';
(() => {
  const app = document.getElementById('app');
  const mobileNav = document.getElementById('mobile-nav');
  const icons = {cards:'✧', messages:'≋', gifts:'♧', professional:'↧'};
  const fieldNames = {
    title:'内容',text:'具体内容',action:'具体行动',detail:'执行说明',responsibility:'负责什么',outputs:'交付内容',boundary:'职责边界',
    owner:'负责人',lead:'主责',partners:'协同',deadline:'完成节点',deliverable:'交付物',standard:'完成标准',result:'达成结果',purpose:'目的',
    role:'角色',name:'事项',for:'价值对象',provider:'内容提供',maintenance:'更新安排',useFor:'使用场景',usage:'使用方法',fields:'填写要点',
    rhythm:'推进节奏',focus:'运营重点',look:'关注什么',do:'如何推动',minimumFeedback:'最小反馈内容',recordRule:'记录口径',
    scope:'征集范围',collectionMethod:'征集方式',publishingMethod:'传播方式',editingNotes:'编辑要点',announcementTemplate:'征集发布文案',
    managerRecognitionTemplate:'管理者激励参考',benchmarkShare:'标杆分享',durationMinutes:'建议时长（分钟）',prompts:'分享问题',
    goal:'目标',host:'组织者',preparation:'提前准备',agenda:'研讨流程',minutes:'环节时长',hostWords:'主持参考',questions:'讨论问题',
    output:'本环节输出',storeOutputs:'单店四项输出',closingWords:'收尾引导',intro:'使用说明',days:'一周行动',day:'建议安排',
    weeklyReflection:'每周回看',confirmed:'已明确规则',tiers:'支持档位',counting:'计数口径',calculation:'计算方式',sharingProcess:'分摊与报销流程',
    examples:'计算示例',historicalBaseline:'历史参考',implementationAssumptions:'实施安排',step:'步骤',note:'提醒',entry:'使用入口',content:'内容',
    audience:'适用对象',audiences:'对象分类',status:'状态',metric:'指标',target:'目标',definition:'统计口径',source:'数据来源',use:'使用方式',
    layer:'结果层次',group:'对象大类',type:'对象',priority:'优先级',depth:'行动深度',record:'记录方式',module:'模块',
    invitation:'征集倡议',submissionFields:'提交内容',label:'填写项',required:'是否必填',groupMessage:'群发布参考',videoEndTitle:'片尾标题',
    videoEndSubtitle:'片尾说明',videoEndActions:'片尾行动提示',videoEndClosing:'片尾收尾',culture:'文化价值',reason:'设计依据',
    item:'事项',check:'验收方法',criteria:'验收标准',expected:'预期结果',risk:'需关注',decision:'处理安排',assumption:'实施假设',
    reference:'参考依据',amount:'支持金额',count:'份数',store:'门店',month:'月份',total:'合计',mean:'单店均值',median:'中位数',
    rule:'规则',process:'步骤',method:'方法',frequency:'频次',deadlineRule:'节点要求',notes:'补充说明',update:'更新方式',
    recipient:'适用对象',scenario:'使用场景',export:'导出方式',footer:'署名区',heading:'卡片标题',body:'正文',printSuggestion:'打印建议',
    acceptance:'验收与复盘',assumptions:'实施安排',background:'项目背景',budgetNote:'预算说明',caseOperations:'案例与激励运营',
    collection:'案例征集',date:'时间',effects:'最终价值',fees:'费用规则',foundations:'基础配套',gifts:'送出份数',headline:'总目标',
    materialDelivery:'物料交付',max:'份数上界',min:'份数起点',metrics:'结果指标',monthEnd:'月末收口',months:'参考月份',period:'项目周期',
    positioning:'项目定位',problems:'解决的问题',publishing:'传播安排',quantity:'份数',region:'大区',regionBacktest:'大区历史回测',
    remainingCost:'待共同承担费用',reward:'激励安排',roles:'责任分工',schedule:'执行排期',selection:'案例选择',septemberBacktest:'9月档位回测',
    septemberDistribution:'9月门店分布',septemberMedian:'9月单店中位数',sources:'资料来源',stores:'门店数',subgoals:'子目标',support:'支持经费',
    supports:'支撑安排',theme:'项目主题',threeMonthMeanPerStore:'三个月单店月均',threeMonthTotal:'三个月合计',through:'通过做什么',
    tier:'对应档位',topSupports:'前三项关键支撑',totalGoal:'总目标',url:'来源链接',weeklyOperations:'周度运营',
    companionText:'配套表达参考',framework:'表达框架',steps:'步骤',materials:'可选物料',template:'参考模板',usageNotes:'使用提醒',
    subtitle:'主题说明',home:'首页共识',eyebrow:'行动主题',opening:'开场倡议',cultureTitle:'感恩文化',cultureBody:'文化内涵',
    whyNovemberTitle:'感恩月契机',whyNovemberBody:'行动背景',interaction:'互动倡议',prompt:'想一想',hint:'行动提示',cta:'开始行动',
    actionSteps:'行动步骤',quickActions:'取用入口',description:'内容说明',button:'操作入口',serviceReminder:'服务提醒',storyPrompt:'故事分享倡议',
    closing:'收尾倡议',category:'对象分类',order:'显示顺序',online:'线上表达',offline:'线下递送',messageGuide:'表达使用方法',messages:'表达参考',
    audienceId:'适用对象',scene:'适用场景',customize:'请补充的真实内容',cards:'贺卡模板',editableFields:'可定制内容',placeholder:'填写示例',
    recommendedMax:'建议字数',workshop:'单店文化研讨',professionalMaterials:'专业资料',stories:'服务故事',emptyState:'分享倡议',
    weekAction:'每周行动参考',launchCopy:'启动发布参考',external:'外部文化背景',company:'丽兹行感恩文化',meaning:'现代感恩精神',
    channel:'使用方式',dimensions:'样张尺寸',files:'下载文件',previewNote:'样张说明',updatedAt:'更新日期',notes:'使用说明',
    acceptanceMethod:'验收方式',completion:'完成要求',progress:'进度情况'
  };
  const omitKeys = new Set(['id','version','sourceRef','recommendedIds','checkedAt','recommendedBodyMax','design','key','no','number','fileId','libraryFileId','audienceId','order']);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arr = v => Array.isArray(v) ? v : v == null ? [] : [v];
  const plain = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(plain).join('；') : v && typeof v === 'object' ? Object.values(v).filter(x=>typeof x==='string').join('；') : String(v ?? '');
  const safeUrl = value => { try { const u = new URL(value, location.href); return ['https:','http:','file:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  const lines = value => String(value ?? '').replace(/\\n/g,'\n').split(/[\r\n]+/).map(s=>s.trim()).filter(Boolean);
  const textBlock = value => lines(value).map(line => `<p>${esc(line)}</p>`).join('');
  const labelFor = key => fieldNames[key] || (/^[a-z][a-z0-9_]*$/i.test(key) ? '补充说明' : key);
  const short = (v, limit=180) => {const s=plain(v);return s.length>limit?s.slice(0,limit)+'…':s;};
  function readable(value, level=0) {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return `<div class="reading">${textBlock(value)}</div>`;
    if (typeof value === 'boolean') return value ? '是' : '否';
    if (Array.isArray(value)) return `<div class="reading-array">${value.map(v=> typeof v==='string' ? `<div class="numbered-item"><b>·</b><div>${textBlock(v)}</div></div>` : `<div class="reading-object">${readable(v,level+1)}</div>`).join('')}</div>`;
    return `<div class="reading">${Object.entries(value).filter(([key,val])=>!omitKeys.has(key)&&val!=null&&val!==''&&!(Array.isArray(val)&&!val.length)).map(([key,val])=>`<div class="property"><span class="property-label">${esc(labelFor(key))}：</span>${typeof val === 'object' ? readable(val,level+1) : key==='url'?`<a href="${esc(safeUrl(val))}" target="_blank" rel="noopener noreferrer">查看原始资料 ↗</a>`:textBlock(val)}</div>`).join('')}</div>`;
  }
  function numbered(items) {
    return arr(items).map((item,i)=>`<div class="numbered-item"><b>${esc(item?.no || '①②③④⑤⑥⑦⑧⑨⑩'[i] || (i+1))}</b><div>${typeof item==='string'?textBlock(item):`<strong>${esc(item.title||'')}</strong>${textBlock(item.text || item.detail || item.action || '')}`}</div></div>`).join('');
  }
  const heading = (id,kicker,title,description,no='') => `<section class="section" id="${id}"><div class="section-heading"><div><p class="section-kicker">${esc(kicker)}</p><h2>${esc(title)}</h2>${description?`<p class="section-intro">${esc(description)}</p>`:''}</div><span class="section-number" aria-hidden="true">${esc(no)}</span></div>`;
  let data, messageFilter='all', giftFilter='all', toastTimer;
  function toast(text) {const el=document.getElementById('toast');clearTimeout(toastTimer);el.textContent=text;el.classList.add('show');toastTimer=setTimeout(()=>el.classList.remove('show'),2500);}
  async function copy(text) {
    try {
      if(navigator.clipboard&&window.isSecureContext) await navigator.clipboard.writeText(text);
      else {const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();if(!document.execCommand('copy'))throw new Error('copy');field.remove();}
      toast('已复制，补上真实细节后就可以发送');
    } catch {toast('请长按选中文字复制');}
  }
  function downloadText(text,name) {
    const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
  }
  function objectToText(v, depth=0) {
    if(v==null)return '';
    if(typeof v!=='object')return String(v);
    if(Array.isArray(v))return v.map(x=>objectToText(x,depth+1)).join('\n');
    return Object.entries(v).filter(([k])=>!omitKeys.has(k)).map(([k,val])=>`${labelFor(k)}：${objectToText(val,depth+1)}`).join('\n');
  }
  function renderAction() {
    const a=data.action||{}, h=a.home||{}, s=a.stories||{}, fees=data.project?.fees||{};
    document.title='丽兹行感恩连接行动包｜贺卡・文案・服务资料';
    const sections=[['start','01','行动说明与目标'],['cards','02','贺卡定制与下载'],['messages','03','分场景感谢文案'],['gifts','04','伴手礼推荐与预算'],['professional','05','专业资料下载'],['together','06','行动与案例分享']];
    const directoryLinks=sections.map(([id,no,title])=>`<a href="#${id}" data-section-link><span>${no}</span><b>${title}</b></a>`).join('')+`<a href="#support" data-section-link class="directory-extra"><span>＋</span><b>补充资料与费用支持</b></a>`;
    const directory=`<aside class="sales-directory" aria-label="行动包目录"><div class="directory-title"><span>LANDZ SERVICE TOOLKIT</span><h2>感恩连接<br>行动物料包</h2><p>面向销售中心的顾客服务工具<br>选择内容，编辑后即可取用。</p></div><nav class="directory-links" aria-label="功能目录">${directoryLinks}</nav><a class="directory-qr" href="qr.html">分享行动包二维码 <span aria-hidden="true">↗</span></a></aside>`;
    const phoneDirectory=`<details class="phone-directory"><summary><span>功能目录</span><b>贺卡 · 文案 · 礼品 · 资料</b></summary><nav class="directory-links" aria-label="手机功能目录">${directoryLinks}</nav></details>`;
    const hero=`<section class="hero" id="start"><div class="hero-layout"><div class="hero-content"><p class="eyebrow">NOVEMBER 2026 · 销售中心顾客服务工具</p><div class="hero-theme">感恩相连，服务有光</div><h1>丽兹行<br><em>感恩连接行动包</em></h1><div class="hero-copy"><p>这个11月，面向全量业主与客户，主动表达感谢。先了解顾客当前的想法与需求变化，再以合适的表达、专业内容和具体服务，认真回应每一份信任。</p><p>在这里，你可以定制并下载贺卡、取用分场景文案、按预算挑选伴手礼，下载hmall图与市场报告，为下一次顾客连接做好准备。</p></div><div class="hero-bottom"><span class="pill">5种贺卡风格 · 线上与线下</span><span class="pill">18个服务场景 · 按需取用</span></div><div class="hero-actions"><a class="hero-cta" href="#cards">定制我的贺卡 <span aria-hidden="true">↗</span></a><a class="hero-secondary" href="#consensus">阅读行动说明 <span aria-hidden="true">↓</span></a></div></div><aside class="hero-guide" aria-label="兰斯博士的使用提示"><div class="ip-portrait"><img src="media/dr-lans.webp" alt="兰斯博士：丽兹行AI服务伙伴" width="1254" height="1254" fetchpriority="high"></div><div class="ip-speech"><span>兰斯博士 · 行动提示</span><p>先听懂顾客的需要，<br>再准备合适的感谢与服务。</p><small>选用工具 → 个性定制 → 主动连接</small></div></aside></div></section>`;
    const aim=`<div class="sales-aim" id="how-to"><p class="section-kicker">HOW TO USE · 使用步骤</p><h2>从了解顾客，到准备一次有价值的连接。</h2><div class="sales-aim-grid"><article><b>01</b><h3>先了解，现在需要什么</h3><p>回顾服务经历，主动听听顾客最近的打算和变化，确认当下关心的问题。</p></article><article><b>02</b><h3>选内容，写下真实感谢</h3><p>按顾客关系与服务阶段，选择贺卡和文案，补充你们之间真实的经历与细节。</p></article><article><b>03</b><h3>配服务，把约定做到</h3><p>准备有用的专业资料或适宜的心意，主动联系、面见，并把后续服务逐项跟进。</p></article></div></div>`;
    const shortcuts=[{id:'cards',title:'贺卡定制',description:'5种商务设计，编辑称呼、正文与署名，下载电子版或A6打印版。'},{id:'messages',title:'场景文案',description:'18个服务场景，按业主、客户和关系阶段选用，替换真实细节。'},{id:'gifts',title:'伴手礼推荐',description:'30元以内、30—60元、60元以上，结合对象、场景与预算选款。'},{id:'professional',title:'专业资料',description:'下载hmall图与市场报告，编辑与顾客需要有关的成交信息。'}];
    const quick=`<div class="quick-grid">${shortcuts.map((q,i)=>`<a class="quick-card" href="#${esc(q.id)}"><div class="quick-top"><span class="quick-icon">${icons[q.id]||'✧'}</span><span class="quick-number">0${i+2}</span></div><h3>${esc(q.title)}</h3><p>${esc(q.description)}</p><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
    const consensus=heading('consensus','01 · ACTION GUIDE','感恩月目标与行动说明','11月1日—30日，把心里的感谢主动表达出来，也把顾客当下需要的服务准备好。','01')+`<div class="consensus-grid"><article class="surface consensus-main"><p class="quote-line">珍惜顾客的信任，从主动理解他的需要开始。</p><div class="reading"><p>顾客愿意分享家庭的需要、房产的安排与重要的选择，让我们的专业有了创造价值的机会。感恩利他，体现在记得对方关心的事，也愿意主动了解新的想法，并随需求变化调整服务。</p><p>这个月，我们面向全量业主与客户主动表达感谢；在售业主重点推进线下面见。一次真诚的问候、一份有用的信息、一张定制贺卡、一项认真完成的服务，都可以让感谢被感受到。</p></div><div class="callout"><p><strong>先倾听 → 再准备 → 主动表达 → 持续跟进</strong><br>让顾客更了解你的专业与用心，也更了解丽兹行能够为他做什么。</p></div></article><article class="surface"><h3>为什么在11月，一起行动？</h3><div class="reading"><p>11月有集中表达感谢的文化契机。丽兹行每年的感恩月，通过国王与天使传递伙伴间的感谢，通过爱心义卖参与社会回馈，也把这份感谢带进与顾客的日常服务。</p><p>感恩在每一天，11月更主动地表达。这里统一准备了感性表达与专业服务工具，方便你根据顾客的关系、当前需求和服务阶段，快速选择、个性定制并直接使用。</p></div><ul class="guide-facts"><li><strong>服务对象</strong><span>全量业主与客户；保安、物业、管家另作感谢与记录。</span></li><li><strong>行动重点</strong><span>全量线上表达，在售业主重点面见，服务随需求变化调整。</span></li><li><strong>物料用途</strong><span>顾客表达、主动联系、面见准备与后续专业服务。</span></li></ul></article></div><details class="more-content"><summary>查看对象分类与建议服务深度</summary><div class="reading audience-grid">${arr(a.audiences).sort((x,y)=>(x.order||0)-(y.order||0)).map(x=>`<article class="audience-card"><span class="tag ${x.priority?.includes('S')?'gold':''}">${esc(x.priority||x.category||'服务对象')}</span><h3>${esc(x.label||x.type||x.category||'顾客服务')}</h3><p>${esc(x.online||x.action||'主动表达感谢，提供具体服务。')}</p><p>${esc(x.depth||'')}</p></article>`).join('')}</div></details></section>`;
    const cards=heading('cards','02 · PERSONALIZED CARDS','贺卡定制与下载','5种商务风格，配有线上发送版和A6线下面见版；选择设计后，编辑内容即可预览与下载。','02')+`<div class="tool-guide"><img src="media/dr-lans.webp" alt="" width="56" height="56" loading="lazy"><p><strong>兰斯博士的小提示</strong>先选择适合顾客的风格，再写入真实的感谢与下一步服务；五种设计可随时切换。</p></div><div id="card-maker-root"></div><details class="more-content template-downloads"><summary>查看并下载10款贺卡样张</summary><p class="template-intro">线上5款、线下5款。可先查看设计，正式发送前请在上方编辑称呼、正文和署名；线下PDF按A6横版实际大小打印。</p><div id="template-gallery" class="template-gallery"><p class="template-intro">正在打开贺卡样张…</p></div></details></section>`;
    const messages=heading('messages','03 · CLIENT COMMUNICATION','分场景感谢文案','按照服务对象与沟通阶段选用；先听听顾客当前的需要，再把感谢与适合他的服务说清楚。','03')+`<div class="message-guide"><strong>推荐表达顺序</strong><span>感谢一段真实经历</span><i>→</i><span>了解当下的需要</span><i>→</i><span>提出具体的服务</span></div><div class="filters" id="message-filters"></div><div class="message-grid" id="message-grid"></div><div class="callout"><p>方括号内容是需要替换的真实信息，请核对后再发送。建议按顾客关系调整称呼与语气，内容简洁、事实准确，给对方留出合适的回复空间。</p></div></section>`;
    const gifts=heading('gifts','04 · THOUGHTFUL GIFTS','伴手礼推荐与预算','按预算、顾客偏好与递送场景选择，一份得体的心意，也配上一项切实有用的服务。','04')+`<div class="filters" id="gift-filters"></div><div class="gift-grid" id="gift-grid"></div><div class="callout"><p>${esc(data.gifts?.priceDisclaimer||'展示价格为参考预算，请以下单页面实际价格为准。')}<br>${esc(data.gifts?.deliveryPolicy||'提前填写上海具体地址核验配送时效，建议使用日前三天完成准备。')}</p></div></section>`;
    const profCards=[['hmall图','项目组统一提供最新版本，下载后结合顾客关注点使用。'],['市场报告','由业务管理部门发布，项目组统一更新；使用时留意报告日期、统计范围与来源。'],['成交信息表达框架','结合经核实、可分享的真实成交信息，说明与顾客有关的参考价值。']];
    const professional=heading('professional','05 · PROFESSIONAL RESOURCES','专业资料下载与成交信息编辑','根据顾客关注点准备专业内容，帮助客户比较选择，也让业主更清楚当前市场与后续安排。','05')+`<div class="professional-intro">${profCards.map(([title,text])=>`<article class="professional-card"><h3>${title}</h3><p>${text}</p></article>`).join('')}</div><div class="material-list" id="material-list"><div class="empty-state"><strong>正在读取专业资料</strong><p>项目组统一提供hmall图和市场报告，发布后可在这里直接下载。</p></div></div><details class="detail-panel more-content"><summary>编辑与顾客需求相关的成交信息</summary><div class="reading"><p>依据已核实且可分享的信息填写，结合顾客关注点说明参考价值和可比差异。</p><label class="editor-field" for="transaction-editor">成交信息草稿 · 可自行编辑</label><textarea id="transaction-editor" class="transaction-editor" spellcheck="false"></textarea><div class="card-actions"><button class="btn primary" data-copy-transaction>复制我的内容</button><button class="btn" data-download-transaction>下载文字</button></div></div></details></section>`;
    const together=heading('together','06 · NEXT ACTION','行动与案例分享','准备下一次主动联系，也把有价值的服务做法分享给同行的伙伴。','06')+`<article class="closing-banner"><div><p class="closing-lead">听懂需要，认真回应。<br>让感谢走进每一次连接。</p><p>准备一段真诚的表达、一份对当下有帮助的内容，主动了解顾客的新想法，并把约定的事继续做好。</p><div class="card-actions"><a class="btn primary" href="#cards">定制贺卡 ↗</a><a class="btn" href="#messages">选用文案</a><a class="btn" href="#professional">取用专业资料</a></div></div><img class="closing-ip" src="media/dr-lans.webp" alt="兰斯博士为你的下一次服务加油" width="180" height="180" loading="lazy"></article><details class="more-content story-support"><summary>分享服务案例与顾客正反馈</summary><div class="reading"><p>哪一次主动了解，让服务更贴近顾客的需要？哪一个具体动作，让顾客给了你真实的回应？把场景、行动和可学习的做法分享出来，让更多伙伴感受到创造价值的成就。</p><ul class="generic-list">${arr(s.submissionFields).map(x=>`<li>${esc(x.label)}</li>`).join('')}</ul><p>通过单店已有的分享渠道提交，项目组持续挖掘、传播与分享优质做法。</p><div class="card-actions"><button class="btn" data-copy-story>复制案例分享框架</button></div></div></details></section>`;
    const tiers=arr(fees.tiers).length?fees.tiers:[{label:'0—10份',amount:0},{label:'11—20份',amount:100},{label:'21—30份',amount:200},{label:'31—40份',amount:300},{label:'41—50份',amount:400},{label:'51份及以上',amount:500}];
    const supports=heading('support','A LITTLE MORE SUPPORT','补充资料与费用支持','文化研讨方案、补充资料下载与单店服务经费说明，按需查看和使用。','＋')+`<details class="detail-panel support-panel"><summary><span>文化研讨方案</span><small>单店一起聊清楚，回到服务中行动</small></summary><div class="reading"><div class="workshop-bar"><div><h3>${esc(a.workshop?.title||'感恩主题单店文化研讨')}</h3><p>${esc(a.workshop?.durationMinutes||40)}分钟 · 共同参与，形成具体行动</p></div><button class="btn" data-download-workshop>下载主持方案</button></div><details class="more-content"><summary>展开完整研讨方案</summary><div class="reading">${readable(a.workshop)}</div></details></div></details><details class="detail-panel support-panel"><summary><span>补充资料下载</span><small>项目组统一提供，按需取用</small></summary><div class="reading"><div class="material-list" id="supplement-material-list"><div class="empty-state"><strong>正在读取补充资料</strong><p>其他行动资料将在这里统一提供。</p></div></div></div></details><details class="detail-panel support-panel"><summary><span>基础支持 · 单店全月服务经费</span><small>按实际行动给予支持，每店全月最高500元</small></summary><div class="reading"><div class="fees-grid"><article class="surface"><h3>单店全月支持档位</h3><table class="fee-table"><thead><tr><th>11月顾客礼物实际送出量</th><th>大区总支持上限</th></tr></thead><tbody>${tiers.map(t=>`<tr><td>${esc(t.label||`${t.min}—${t.max??'以上'}份`)}</td><td>${esc(t.amount)}元</td></tr>`).join('')}</tbody></table><p class="gift-note">按达到的最高档确定，档位不累加；500元是每家店全月的支持上限。</p></article><article class="calculator"><h3>算一算，这家店可获得多少支持</h3><div class="calc-field"><label for="gift-count">当月顾客礼物实际送出（份）</label><input id="gift-count" type="number" min="0" max="10000" step="1" inputmode="numeric" value="0"></div><div class="calc-field"><label for="gift-cost">实际可分摊费用（元，选填）</label><input id="gift-cost" type="number" min="0" step="0.01" inputmode="decimal" placeholder="填写后可校验实际支持额"></div><div class="calc-field"><label for="other-share">其他层级最终承担费用（元，选填）</label><input id="other-share" type="number" min="0" step="0.01" inputmode="decimal" placeholder="采购垫付款不直接视为最终承担"></div><div class="calc-output"><span id="calc-label">档位支持上限</span><strong id="calc-result">0<small>元</small></strong></div><p class="calc-explain" id="calc-explain">按单店最高档计算，不累加，不超过500元。</p></article></div><div class="support-rules"><h4>采购与费用，先说清楚</h4><p>礼品库预算是选款参考，实际费用按现行分摊与报销制度执行。采购前由店总、经理与参与者说清各方承担，保留采购、付款和实际送出记录。</p><p>实际支持不超过扣除其他层级最终承担金额后的可分摊费用；垫付款不直接视为最终承担，同一笔费用不重复分摊。</p><details class="more-content"><summary>查看送出量统计口径</summary>${readable(fees.counting)}</details></div></div></details></section>`;
    app.innerHTML=`<div class="sales-layout">${directory}<div class="sales-body page-shell">${phoneDirectory}${hero}${aim}${quick}${consensus}${cards}${messages}${gifts}${professional}${together}${supports}</div></div>`;
    mobileNav.innerHTML=shortcuts.map(q=>`<a href="#${esc(q.id)}"><span>${icons[q.id]||'✧'}</span>${esc(({cards:'贺卡定制',messages:'场景文案',gifts:'伴手礼',professional:'专业资料'})[q.id])}</a>`).join('');
    renderMessages();renderGifts();loadMaterials();loadTemplates();
    document.querySelectorAll('#gift-count,#gift-cost,#other-share').forEach(x=>x.addEventListener('input',updateFee));updateFee();
    const tx=arr(a.professionalMaterials).find(x=>x.id==='transaction_info'||x.template);
    document.getElementById('transaction-editor').value=tx?.template||'【日期与信息范围】\n【经核实、可分享的成交事实】\n【与顾客相关的参考价值】\n【需要一起看的可比差异】\n【下一步服务安排】';
    if(typeof window.mountCardMaker==='function') {
      try {window.mountCardMaker(document.getElementById('card-maker-root'),{cards:a.cards,logoDataUrl:window.GRATITUDE_ASSETS?.logoDataUrl});}
      catch(error) {document.getElementById('card-maker-root').innerHTML='<div class="empty-state"><strong>贺卡组件暂未载入</strong><p>请刷新重试，或使用下方的贺卡模板样张。</p></div>';console.error(error);}
    } else document.getElementById('card-maker-root').innerHTML='<div class="empty-state"><strong>贺卡组件暂未载入</strong><p>请刷新后再试。</p></div>';
  }
  function renderMessages() {
    const messages=arr(data.action?.messages);
    const options=[['all','全部场景'],...new Map(messages.map(x=>[x.audienceId||x.audience,x.audience||x.audienceId])).entries()];
    document.getElementById('message-filters').innerHTML=options.map(([key,label])=>`<button class="filter-btn ${messageFilter===key?'active':''}" data-message-filter="${esc(key)}">${esc(label)}</button>`).join('');
    const filtered=messages.filter(m=>messageFilter==='all'||(m.audienceId||m.audience)===messageFilter);
    document.getElementById('message-grid').innerHTML=filtered.map((m,i)=>`<details class="message-card" ${i===0?'open':''}><summary><h3>${esc(m.title)}</h3></summary><div class="message-inner"><div class="tags"><span class="tag">${esc(m.audience)}</span><span class="tag gold">${esc(m.scene||'感谢表达')}</span></div><p class="message-text">${esc(m.text||m.body||'')}</p>${m.customize?.length?`<p class="message-tip">发送前替换：${esc(arr(m.customize).join('、'))}</p>`:''}${m.note?`<p class="message-tip">${esc(m.note)}</p>`:''}<div class="card-actions"><button class="btn primary" data-copy-message="${esc(m.id)}">复制这段表达</button></div></div></details>`).join('');
  }
  function renderGifts() {
    const list=Array.isArray(data.gifts)?data.gifts:arr(data.gifts?.items||data.gifts?.gifts);
    const options=[['all','全部心意'],['≤30元','30元以内'],['30—60元','30—60元'],['>60元','60元以上']];
    document.getElementById('gift-filters').innerHTML=options.map(([key,label])=>`<button class="filter-btn ${giftFilter===key?'active':''}" data-gift-filter="${key}">${label}</button>`).join('');
    const filtered=list.filter(g=>giftFilter==='all'||g.budgetTier===giftFilter);
    document.getElementById('gift-grid').innerHTML=filtered.map(g=>{
      const availability=plain(g.availability||'');
      const limitations=[g.name,g.linkType,g.deliveryNote,availability].join(' ');
      const stockLimited=/缺货|备选/.test(limitations);
      const inquiry=/询价|起订/.test(limitations);
      const label=stockLimited?'备选 · 先核库存':inquiry?'询价后选用':g.priority?'优先推荐':'';
      const deliveryTitle=stockLimited?'库存待核，缺货时不作采购主推':/5束起订/.test(limitations)?'需询价 · 参考团购5束起订':inquiry?'报价与库存需提前确认':'下单前核验上海地址与送达时间';
      return `<article class="gift-card"><div class="quick-top"><span class="gift-symbol">${g.category?.includes('花')?'❀':g.category?.includes('文')?'◇':'♧'}</span>${label?`<span class="tag ${stockLimited||inquiry?'availability':'gold'}">${esc(label)}</span>`:''}</div><h3>${esc(g.name)}</h3><p class="gift-price">${esc(g.estimatedPriceRange||g.budgetTier)}</p><dl><dt>对象</dt><dd>${esc(plain(g.recipient))}</dd><dt>场景</dt><dd>${esc(g.scenario)}</dd><dt>递送</dt><dd>${esc(g.mailOrFace)}</dd></dl><div class="gift-link"><a class="btn" href="${esc(safeUrl(g.purchaseUrl||g.fallbackUrl))}" target="_blank" rel="noopener noreferrer">${inquiry?'查看并询价':/搜索|选购|目录|店铺|官方店/.test(g.linkType||'')?'前往选款':'查看商品'} ↗</a><small>${esc(g.linkType||'选购参考入口')}<br>${esc(g.priceBasis||'参考预算，以下单实际价格为准')}</small></div><p class="gift-note">${esc(g.selectionNote||'')}</p><details class="gift-delivery" ${stockLimited?'open':''}><summary>${esc(deliveryTitle)}</summary><p>${esc(availability)}${availability&&g.deliveryNote?'<br>':''}${esc(g.deliveryNote||'提前选择上海具体收货地址，核验库存及预计送达日期。')}</p></details></article>`;
    }).join('');
  }
  async function loadMaterials() {
    const el=document.getElementById('material-list'),extra=document.getElementById('supplement-material-list');if(!el||!extra)return;
    const row=file=>`<article class="material-row"><span class="file-icon">${esc((file.fileName||'FILE').split('.').at(-1).toUpperCase().slice(0,5))}</span><div class="file-info"><h3>${esc(file.title||file.fileName)}</h3><p>${esc(({hmall:'hmall图',market:'市场报告',other:'补充资料'})[file.category]||'补充资料')} · ${esc(file.date||String(file.updatedAt||'').slice(0,10))}${file.source?`<br>来源：${esc(file.source.replace(/Liya|Leah/gi,'项目组'))}`:''}</p></div><a href="${esc(safeUrl(file.downloadUrl||file.url))}" class="btn" download="${esc(file.fileName||'行动资料')}">下载 ↧</a></article>`;
    const empty=(title,text)=>`<div class="empty-state"><strong>${title}</strong><p>${text}</p></div>`;
    try {
      let value;
      if(location.protocol==='file:')value=window.GRATITUDE_MATERIALS||data.materials||[];
      else {
        const endpoint=window.GRATITUDE_SUPABASE_ENABLED?'/api/materials':'./materials.json';
        const res=await fetch(endpoint,{headers:{Accept:'application/json'},cache:'no-store'});if(!res.ok)throw new Error('unavailable');
        value=await res.json();
      }
      const items=(Array.isArray(value)?value:arr(value.materials||value.items||value.files)).filter(x=>x.active!==false);
      const professional=items.filter(file=>['hmall','market'].includes(file.category));
      const supplements=items.filter(file=>!['hmall','market'].includes(file.category));
      el.innerHTML=professional.length?professional.map(row).join(''):empty('专业资料即将更新','hmall图与市场报告由项目组统一提供。<br>发布后可在这里直接下载，使用时请留意版本与日期。');
      extra.innerHTML=supplements.length?supplements.map(row).join(''):empty('更多支持，陆续补充','项目组发布的其他行动资料会出现在这里。<br>你也可以先取用上方的贺卡、表达参考和文化研讨方案。');
    }catch(error){
      el.innerHTML=empty('专业资料暂未读取','请稍后刷新查看项目组发布的hmall图与市场报告。');
      extra.innerHTML=empty('补充资料暂未读取','请稍后刷新，其他行动工具可继续使用。');
    }
  }
  async function loadTemplates() {
    const el=document.getElementById('template-gallery');if(!el)return;
    try {
      let manifest=data.templates||window.GRATITUDE_TEMPLATES;
      if(!manifest&&location.protocol!=='file:'){
        const response=await fetch('./templates/manifest.json?v=20261030-bright-v2',{headers:{Accept:'application/json'},cache:'no-store'});
        if(!response.ok)throw new Error('templates unavailable');
        manifest=await response.json();
      }
      if(!manifest&&location.protocol==='file:'){
        manifest={items:['online','offline'].flatMap(channel=>arr(data.action?.cards?.[channel]).map(card=>({id:card.id,title:card.title,channel,dimensions:channel==='online'?'1080×1440px':'A6横版 · 148×105mm',files:{png:`templates/${card.id}.png`,...(channel==='offline'?{pdf:`templates/${card.id}.pdf`}:{})}})))};
      }
      const templates=Array.isArray(manifest)?manifest:arr(manifest?.items);
      if(!templates.length)throw new Error('templates empty');
      const templateUrl=value=>{const source=safeUrl(value);if(source==='#'||source.startsWith('file:'))return source;const url=new URL(source,location.href);url.searchParams.set('v','20261030-bright-v2');return url.href;};
      el.innerHTML=templates.map(card=>{
        const files=card.files||{},png=files.png||card.preview;
        return `<article class="template-card"><a class="template-preview ${card.channel==='offline'?'offline':'online'}" href="${esc(templateUrl(png))}" target="_blank" rel="noopener noreferrer"><img src="${esc(templateUrl(png))}" alt="${esc(card.title)}${card.channel==='offline'?'线下':'线上'}贺卡模板样张" loading="lazy"></a><div class="template-info"><span class="tag">${card.channel==='offline'?'线下面见 · 打印版':'线上发送 · 图片版'}</span><h3>${esc(card.title)}</h3><p>${esc(card.dimensions||'')}</p><div class="card-actions">${files.png?`<a class="btn" href="${esc(templateUrl(files.png))}" download>下载PNG</a>`:''}${files.pdf?`<a class="btn" href="${esc(templateUrl(files.pdf))}" download>下载打印PDF</a>`:''}</div></div></article>`;
      }).join('');
    }catch(error){el.innerHTML='<div class="empty-state"><strong>样张暂未载入</strong><p>请稍后刷新重试。你也可以直接在上方选择模板，填写后下载自己的贺卡。</p></div>';}
  }
  function updateFee() {
    const n=Math.max(0,Math.floor(Number(document.getElementById('gift-count').value)||0));
    const limit=n<=10?0:Math.min(500,Math.floor((n-1)/10)*100);
    const costEl=document.getElementById('gift-cost'), other=Math.max(0,Number(document.getElementById('other-share').value)||0);
    let result=limit, explanation=`送出${n}份，对应最高档${limit}元；档位不累加。`;
    if(costEl.value!==''){const cost=Math.max(0,Number(costEl.value)||0);result=Math.min(limit,Math.max(0,cost-other));explanation+=`扣除其他层级已承担费用后，剩余${Math.max(0,cost-other).toFixed(2)}元，支持额取两者较小值。`;}
    document.getElementById('calc-label').textContent=costEl.value===''?'档位支持上限':'测算实际支持额';
    document.getElementById('calc-result').innerHTML=`${Number(result.toFixed(2))}<small>元</small>`;
    document.getElementById('calc-explain').textContent=explanation;
  }
  function attach() {
    app.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.dataset.messageFilter!=null){messageFilter=button.dataset.messageFilter;renderMessages();return;}
      if(button.dataset.giftFilter!=null){giftFilter=button.dataset.giftFilter;renderGifts();return;}
      if(button.dataset.copyMessage){const m=arr(data.action?.messages).find(x=>x.id===button.dataset.copyMessage);if(m)copy(m.text);return;}
      if(button.hasAttribute('data-copy-transaction')){copy(document.getElementById('transaction-editor').value);return;}
      if(button.hasAttribute('data-download-transaction')){downloadText(document.getElementById('transaction-editor').value,'我的成交信息服务表达.txt');return;}
      if(button.hasAttribute('data-copy-story')){copy(arr(data.action?.stories?.submissionFields).map(x=>`【${x.label}】`).join('\n'));return;}
      if(button.hasAttribute('data-download-workshop')){downloadText(objectToText(data.action.workshop),'感恩主题文化研讨主持方案.txt');return;}
    });
    const directory=document.querySelector('.phone-directory');
    document.querySelectorAll('[data-section-link]').forEach(link=>link.addEventListener('click',()=>{if(directory)directory.open=false;}));
    if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){const id=entry.target.id==='consensus'?'start':entry.target.id;document.querySelectorAll('[data-section-link],#mobile-nav a').forEach(link=>link.classList.toggle('active',link.hash==='#'+id));}}},{rootMargin:'-10% 0px -65% 0px'});document.querySelectorAll('.section,#start').forEach(section=>observer.observe(section));}
    if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
  async function init() {
    try {
      data=window.GRATITUDE_CONTENT;
      if(!data){const response=await fetch('content.json');if(!response.ok)throw new Error('missing content');data=await response.json();}
      if(!data.action)throw new Error('invalid content');
      const current=new URL(location.href);if(current.searchParams.has('view')){current.searchParams.delete('view');history.replaceState(history.state,'',current.pathname+current.search+current.hash);}
      renderAction();attach();
    }catch(error){console.error(error);app.innerHTML='<div class="error-state"><h1>内容暂未载入</h1><p>请刷新后再试。离线打开时，请保持完整交付包的页面、内容和组件文件位于同一目录。</p><a class="btn" href="?view=action">重新打开行动包</a></div>';}
  }
  init();
})();
