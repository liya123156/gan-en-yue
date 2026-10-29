'use strict';
(() => {
  const app = document.getElementById('app');
  const mobileNav = document.getElementById('mobile-nav');
  const params = new URLSearchParams(location.search);
  const isProject = params.get('view') === 'project' || /\/project\/?$/.test(location.pathname);
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
  const viewSwitch = `<div class="view-switch"><a href="?view=action" class="${isProject?'':'active'}">销售中心行动包</a><a href="?view=project" class="${isProject?'active':''}">项目组工作台</a></div>`;
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
    const a=data.action||{}, h=a.home||{};
    document.title='感恩相连 · 服务有光｜丽兹行感恩连接行动包';
    const opening=arr(h.opening);
    const hero = `<section class="hero"><p class="eyebrow">${esc(h.eyebrow||'2026 NOVEMBER · 感恩连接行动')}</p><h1>感恩相连，<br><em>服务有光。</em></h1><div class="hero-copy">${textBlock(opening[0]||h.headline||'把每一份信任，回应成具体的服务。')}${textBlock(opening.at(-1)||'今天，选一位顾客，完成一次有内容的连接。')}</div><div class="hero-bottom"><span class="pill">11月 · 全量顾客主动表达</span><span class="pill">重点连接 · 面见传递信任</span></div><p class="hero-note">你的感谢，由你定制。你的服务，让顾客感受到。</p>${viewSwitch}</section>`;
    const shortcuts=arr(h.quickActions).length?h.quickActions:[{id:'cards',title:'做一张专属贺卡',description:'写下称呼和心意，保存你的专属表达。'},{id:'messages',title:'找一句适合的表达',description:'按顾客对象与服务阶段选用。'},{id:'gifts',title:'挑一份合适的心意',description:'三档预算，找到恰当的伴手礼。'},{id:'professional',title:'带一份有用的内容',description:'专业资料与成交信息表达框架。'}];
    const quick=`<div class="quick-grid">${shortcuts.map((q,i)=>`<a class="quick-card" href="#${esc(q.id)}"><div class="quick-top"><span class="quick-icon">${icons[q.id]||'✧'}</span><span class="quick-number">0${i+1}</span></div><h3>${esc(q.title)}</h3><p>${esc(q.description)}</p><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;
    const consensus=heading('consensus','A THANK-YOU, WITH MEANING','从一份真实的感谢开始','先想起一个具体的人，再准备一件对他有帮助的事。','01')+`<div class="consensus-grid"><article class="surface consensus-main"><p class="quote-line">${esc(h.cultureTitle||'感恩，是看见顾客的托付，并认真回应。')}</p><div class="reading">${textBlock(h.cultureBody||'')}</div><div class="callout"><p><strong>${esc(h.interaction?.prompt||'现在，你脑海里想到的第一位顾客是谁？')}</strong><br>${esc(h.interaction?.hint||'从这一位开始，写下你们之间的真实细节。')}</p></div></article><article class="surface"><h3>${esc(h.whyNovemberTitle||'11月，让感恩成为共同的行动。')}</h3><div class="reading">${textBlock(h.whyNovemberBody||'')}</div><div class="action-steps">${arr(h.actionSteps).map(s=>`<div class="action-step"><b>${esc(s.number)}</b><div><strong>${esc(s.title)}</strong><br>${esc(s.body)}</div></div>`).join('')}</div></article></div><details class="more-content"><summary>看看不同顾客，如何表达与服务</summary><div class="reading audience-grid">${arr(a.audiences).sort((x,y)=>(x.order||0)-(y.order||0)).map(x=>`<article class="audience-card"><span class="tag ${x.priority?.includes('S')?'gold':''}">${esc(x.priority||x.category||'服务对象')}</span><h3>${esc(x.label||x.type||x.category||'顾客服务')}</h3><p>${esc(x.online||x.action||'主动表达感谢，提供具体服务。')}</p><p>${esc(x.depth||'')}</p></article>`).join('')}</div></details></section>`;
    const cards=heading('cards','MADE FOR ONE PERSON','这一张，只写给他','线上与线下分别设计。填写、预览、下载，你的内容只属于你自己的贺卡。','02')+`<div id="card-maker-root"></div><div class="callout"><p>${esc(a.cards?.intro||'选择模板后填写称呼、正文和署名，结合一次真实服务，让感谢更具体。')}</p></div><details class="more-content template-downloads"><summary>下载6款模板样张</summary><p class="template-intro">先看看哪款更适合这位顾客。样张中的称呼、正文和署名为填写参考，请在上方定制后再发送；线下PDF按A6横版实际大小打印。</p><div id="template-gallery" class="template-gallery"><p class="template-intro">正在打开模板样张…</p></div></details></section>`;
    const messages=heading('messages','WORDS THAT FEEL PERSONAL','把感谢，说到心里','参考文案帮你开头，你们之间的真实细节让这段话有温度。','03')+`<div class="filters" id="message-filters"></div><div class="message-grid" id="message-grid"></div><div class="callout"><p>${esc(a.messageGuide?.principle||'发送前，补充一件真实细节、一份具体价值和一个合适的下一步；尊重顾客的时间与意愿。')}</p></div></section>`;
    const gifts=heading('gifts','A LITTLE THOUGHTFULNESS','小小心意，恰好合适','按预算和真实需求选择。礼物与一份有价值的服务，一起送达。','04')+`<div class="filters" id="gift-filters"></div><div class="gift-grid" id="gift-grid"></div><div class="callout"><p>${esc(data.gifts?.priceDisclaimer||'展示价格为参考预算，请以下单页面实际价格为准。')}<br>${esc(data.gifts?.deliveryPolicy||'提前填写上海具体地址核验配送时效，建议使用日前三天完成准备。')}</p></div></section>`;
    const prof=heading('professional','PROFESSIONAL CARE','多准备一步，多创造一点价值','把心意与专业内容放在一起，让每次连接都对顾客有帮助。','05')+`<div class="professional-intro">${arr(a.professionalMaterials).map(x=>`<article class="professional-card"><h3>${esc(x.title)}</h3><p>${esc(x.provider||'')}<br>${esc(x.maintenance||'')}</p></article>`).join('')}</div><div class="material-list" id="material-list"><div class="empty-state"><strong>正在读取已发布资料</strong><p>hmall图、市场报告等由Liya上传后，在这里统一取用。</p></div></div><details class="detail-panel more-content"><summary>编辑一份与顾客相关的成交信息</summary><div class="reading"><p>依据已核实且可分享的信息填写，结合顾客关注点说明参考价值和可比差异。</p><label class="editor-field" for="transaction-editor">你的成交信息草稿 · 只在当前页面编辑</label><textarea id="transaction-editor" class="transaction-editor" spellcheck="false"></textarea><div class="card-actions"><button class="btn primary" data-copy-transaction>复制我的内容</button><button class="btn" data-download-transaction>下载文字</button></div></div></details></section>`;
    const s=a.stories||{};
    const stories=heading('stories','GOOD SERVICE, SHARED','让好服务，点亮更多行动','让顾客的认可激励伙伴，让具体的好做法被学习和复制。','06')+`<div class="story-layout"><article class="story-banner"><h3>哪一次服务，<br>让你感到自己的价值？</h3><p>${esc(s.invitation||h.storyPrompt||'把一段真实的服务经历分享出来，让更多伙伴获得行动灵感。')}</p><p class="story-question">一件具体行动，一句真实回应，一个可以借鉴的做法。</p><div class="card-actions"><button class="btn" data-copy-story>复制故事分享框架</button></div></article><article class="surface"><h3>你的故事，可以从这几句话开始</h3><ul class="generic-list">${arr(s.submissionFields).length?arr(s.submissionFields).map(x=>`<li>${esc(x.label)}</li>`).join(''):'<li>顾客当时关心什么？</li><li>我具体做了什么？</li><li>顾客有什么真实回应？</li><li>下一步服务或业务有什么变化？</li>'}</ul><p class="gift-note">${esc(s.collectionMethod||'通过现有单店、经理或BP渠道提交，项目组核实提炼后组织传播与分享。')}</p></article></div><details class="more-content"><summary>查看征集与标杆分享参考</summary><div class="reading">${readable({scope:s.scope,publishingMethod:s.publishingMethod,editingNotes:s.editingNotes,announcementTemplate:s.announcementTemplate,managerRecognitionTemplate:s.managerRecognitionTemplate,benchmarkShare:s.benchmarkShare})}</div></details></section>`;
    const workshop=heading('workshop','TURN UNDERSTANDING INTO ACTION','一起聊清楚，一起行动','项目组提供研讨方案，店总与经理结合本店资源开展共识。','07')+`<div class="workshop-bar"><div><h3>${esc(a.workshop?.title||'感恩主题单店文化研讨')}</h3><p>${esc(a.workshop?.durationMinutes||40)}分钟 · 四项行动输出 · 伙伴共同参与</p></div><button class="btn" data-download-workshop>下载主持方案</button></div><details class="more-content"><summary>展开完整研讨方案</summary><div class="reading">${readable(a.workshop)}</div></details><details class="more-content"><summary>一周行动灵感</summary><div class="reading">${readable(a.weekAction)}</div></details><div class="wide-note">${esc(h.closing||'今天，选一位顾客，完成一次有内容的连接。')}</div></section>`;
    app.innerHTML=`<div class="page-shell">${hero}${quick}${consensus}${cards}${messages}${gifts}${prof}${stories}${workshop}</div>`;
    mobileNav.innerHTML=shortcuts.slice(0,4).map(q=>`<a href="#${esc(q.id)}"><span>${icons[q.id]||'✧'}</span>${esc(({cards:'贺卡',messages:'表达',gifts:'伴手礼',professional:'专业物料'})[q.id]||q.title)}</a>`).join('');
    renderMessages();renderGifts();loadMaterials();loadTemplates();
    const tx=arr(a.professionalMaterials).find(x=>x.id==='transaction_info'||x.template);
    document.getElementById('transaction-editor').value=tx?.template||'【日期与信息范围】\n【经核实、可分享的成交事实】\n【与顾客相关的参考价值】\n【需要一起看的可比差异】\n【下一步服务安排】';
    if(typeof window.mountCardMaker==='function') {
      try {window.mountCardMaker(document.getElementById('card-maker-root'),{cards:a.cards,logoDataUrl:window.GRATITUDE_ASSETS?.logoDataUrl});}
      catch(error) {document.getElementById('card-maker-root').innerHTML='<div class="empty-state"><strong>贺卡组件暂未载入</strong><p>请刷新重试，或使用完整交付包中的贺卡模板。</p></div>';console.error(error);}
    } else document.getElementById('card-maker-root').innerHTML='<div class="empty-state"><strong>贺卡组件暂未载入</strong><p>请保持card-maker.js与本页面在同一文件夹后重新打开。</p></div>';
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
    const el=document.getElementById('material-list');if(!el)return;
    try {
      let value;
      if(location.protocol==='file:')value=window.GRATITUDE_MATERIALS||data.materials||[];
      else {
        const endpoint=window.GRATITUDE_SUPABASE_ENABLED?'/api/materials':'./materials.json';
        const res=await fetch(endpoint,{headers:{Accept:'application/json'},cache:'no-store'});if(!res.ok)throw new Error('unavailable');
        value=await res.json();
      }
      const items=Array.isArray(value)?value:arr(value.materials||value.items||value.files);
      if(!items.length)throw new Error('empty');
      el.innerHTML=items.map(file=>`<article class="material-row"><span class="file-icon">${esc((file.fileName||'FILE').split('.').at(-1).toUpperCase().slice(0,5))}</span><div class="file-info"><h3>${esc(file.title||file.fileName)}</h3><p>${esc(({hmall:'hmall图',market:'市场报告',other:'服务资料'})[file.category]||file.category||'服务资料')} · ${esc(file.date||String(file.updatedAt||'').slice(0,10))}${file.source?`<br>来源：${esc(file.source)}`:''}</p></div><a href="${esc(safeUrl(file.downloadUrl||file.url))}" class="btn" download="${esc(file.fileName||'专业资料')}">下载 ↧</a></article>`).join('');
    }catch(error){el.innerHTML=`<div class="empty-state"><strong>${location.protocol==='file:'?'在线共享资料，请在正式工作台取用':'专业资料待上传发布'}</strong><p>hmall图由Liya一次性上传；市场报告由业务管理部门提供，Liya按需更新。<br>请以这里实际展示的文件为准，发布后的资料可从同一入口取用。</p></div>`;}
  }
  async function loadTemplates() {
    const el=document.getElementById('template-gallery');if(!el)return;
    try {
      let manifest=data.templates||window.GRATITUDE_TEMPLATES;
      if(!manifest&&location.protocol!=='file:'){
        const response=await fetch('./templates/manifest.json',{headers:{Accept:'application/json'}});
        if(!response.ok)throw new Error('templates unavailable');
        manifest=await response.json();
      }
      if(!manifest&&location.protocol==='file:'){
        manifest={items:['online','offline'].flatMap(channel=>arr(data.action?.cards?.[channel]).map(card=>({id:card.id,title:card.title,channel,dimensions:channel==='online'?'1080×1440px':'A6横版 · 148×105mm',files:{png:`templates/${card.id}.png`,...(channel==='offline'?{pdf:`templates/${card.id}.pdf`}:{})}})))};
      }
      const templates=Array.isArray(manifest)?manifest:arr(manifest?.items);
      if(!templates.length)throw new Error('templates empty');
      el.innerHTML=templates.map(card=>{
        const files=card.files||{},png=files.png||card.preview;
        return `<article class="template-card"><a class="template-preview ${card.channel==='offline'?'offline':'online'}" href="${esc(safeUrl(png))}" target="_blank" rel="noopener noreferrer"><img src="${esc(safeUrl(png))}" alt="${esc(card.title)}${card.channel==='offline'?'线下':'线上'}贺卡模板样张" loading="lazy"></a><div class="template-info"><span class="tag">${card.channel==='offline'?'线下面见 · 打印版':'线上发送 · 图片版'}</span><h3>${esc(card.title)}</h3><p>${esc(card.dimensions||'')}</p><div class="card-actions">${files.png?`<a class="btn" href="${esc(safeUrl(files.png))}" download>下载PNG</a>`:''}${files.pdf?`<a class="btn" href="${esc(safeUrl(files.pdf))}" download>下载打印PDF</a>`:''}</div></div></article>`;
      }).join('');
    }catch(error){el.innerHTML='<div class="empty-state"><strong>样张暂未载入</strong><p>请稍后刷新重试。你也可以直接在上方选择模板，填写后下载自己的贺卡。</p></div>';}
  }
  function renderProject() {
    const p=data.project||{},t=p.totalGoal||{};
    document.title='11月感恩月项目组工作台｜丽兹行';
    const hero=`<section class="hero project-hero"><p class="eyebrow">PROJECT WORKBENCH · 2026 NOVEMBER</p><h1>感恩月项目组<br><em>完整执行方案</em></h1><p class="hero-copy">${esc(p.title||'11月感恩月 · 全量顾客连接行动')}<br>从目标共识，到真实服务，再到全过程推动与正向激励。</p><div class="hero-bottom"><span class="pill">10月31日 · 物料交付</span><span class="pill">11月3日 · 全司启动</span><span class="pill">11月全月 · 每周推进</span></div>${viewSwitch}<nav class="project-nav" aria-label="项目内容导航">${[['project-goals','目标与支撑'],['project-roles','职责分工'],['project-schedule','全月执行'],['project-operations','目标进度'],['project-fees','费用规则'],['project-delivery','物料交付'],['project-acceptance','验收复盘']].map(([id,name])=>`<a href="#${id}">${name}</a>`).join('')}</nav></section>`;
    const metrics=`<div class="metric-grid"><article class="metric-card"><p class="label">业主与客户线上表达</p><strong>100%</strong><small>有效名单全量覆盖<br>尊重顾客意愿与服务节奏</small></article><article class="metric-card"><p class="label">在售业主面见起点</p><strong>≥20%</strong><small>店总结合历史与名单校准<br>按现有系统口径统计</small></article><article class="metric-card"><p class="label">TOP业主面见起点</p><strong>≥40%</strong><small>重点对象优先推进<br>目标与实际结果分别呈现</small></article></div>`;
    const bg=heading('project-background','CONTEXT & POSITIONING','为什么开展这个项目','背景先讲清楚，行动才更有共同方向。','01')+`<div class="goals-columns"><article class="surface"><h3>项目背景</h3>${readable(p.background)}</article><article class="surface"><h3>一句话定位</h3>${readable(p.positioning)}<div class="callout"><p>项目组的内部顾客是销售中心；行动服务的对象是业主、客户及相关服务群体。</p></div></article></div></section>`;
    const goals=heading('project-goals','GOALS & KEY SUPPORT','目标确定，支撑聚焦','三个子目标逐层衔接，每项突出前三项关键支撑，并保留基础配套。','02')+`<article class="surface"><p class="goal-headline">${esc(t.headline||p.goal||'以感恩为主题，面向全量顾客有效开展感恩连接行动。')}</p><div class="goal-block"><h3>通过做什么</h3>${numbered(t.through)}</div><div class="goal-block"><h3>解决什么问题</h3>${numbered(t.problems)}</div><div class="goal-block"><h3>最终达成的效果</h3>${arr(t.effects).map(x=>`<div class="numbered-item"><b>·</b><div><strong>${esc(x.for)}：${esc(x.title||'')}</strong>${textBlock(x.text||'')}</div></div>`).join('')}</div><div class="callout"><p>${esc(t.culture||'')}</p></div></article><div class="subgoal-grid more-content">${arr(p.subgoals).map((g,i)=>`<article class="subgoal-card"><div class="subgoal-top"><span class="no">0${i+1}</span><h3>${esc(g.title)}</h3><p>${esc(g.result)}</p></div><div class="subgoal-body"><p class="support-label">重点前三项 · KEY SUPPORT</p>${arr(g.topSupports).map((s,j)=>`<div class="support-item"><h4>${j+1}. ${esc(s.title)}</h4><p>${esc(s.action)}</p><p>主责：${esc(s.owner)} · ${esc(s.deadline)}</p><details class="more-content"><summary>交付与完成标准</summary>${readable({deliverable:s.deliverable,standard:s.standard})}</details></div>`).join('')}<details class="foundation"><summary>基础配套</summary>${readable(g.foundations)}</details></div></article>`).join('')}</div><details class="more-content"><summary>对象分类与行动深度</summary><div class="reading">${readable(p.audiences)}</div></details></section>`;
    const roles=heading('project-roles','CLEAR OWNERSHIP','每个角色，交付什么','项目组与HRBP统一承接；各层级围绕目标承担具体行动。','03')+`<div class="role-grid">${arr(p.roles).map(r=>`<article class="role-card"><h3>${esc(r.role)}</h3>${readable({responsibility:r.responsibility,outputs:r.outputs,boundary:r.boundary})}</article>`).join('')}</div></section>`;
    const schedule=heading('project-schedule','MONTHLY EXECUTION','把每一步，排到具体节点','围绕启动节点安排准备工作，全月按周持续推进。','04')+`<div class="timeline">${arr(p.schedule).map(s=>`<article class="timeline-item"><div class="timeline-date">${esc(s.date)}<br><span class="tag">${esc(s.status||'计划安排')}</span></div><div class="timeline-content"><h3>${esc(s.action)}</h3>${readable(s.detail)}<div class="timeline-meta">主责：${esc(s.lead)}${s.partners?` · 协同：${esc(plain(s.partners))}`:''}<br>交付：${esc(plain(s.output))}<br>完成标准：${esc(plain(s.standard))}</div></div></article>`).join('')}</div></section>`;
    const operations=heading('project-operations','TARGETS & WEEKLY OPERATIONS','围绕目标，每周推动','看进度、找卡点、给支持，持续挖掘真实服务带来的变化。','05')+`<div class="surface">${readable(p.weeklyOperations)}</div><details class="more-content"><summary>三层结果与统计口径</summary><div class="reading">${readable(p.metrics)}</div></details><details class="more-content"><summary>案例征集、传播与激励安排</summary><div class="reading">${readable(p.caseOperations)}</div></details><div class="callout"><p>当前页面展示目标与执行方案。实际覆盖、面见和业务结果以现有系统及经核实记录为准，暂不填入模拟完成数据。</p></div></section>`;
    const tiers=arr(p.fees?.tiers).length?p.fees.tiers:[{label:'0—10份',amount:0},{label:'11—20份',amount:100},{label:'21—30份',amount:200},{label:'31—40份',amount:300},{label:'41—50份',amount:400},{label:'51份及以上',amount:500}];
    const fees=heading('project-fees','SHARED SUPPORT','顾客服务经费，共同支持','大区总按单店当月实际送出量分档支持，每家店全月最高500元。','06')+`<div class="fees-grid"><article class="surface"><h3>单店全月支持档位</h3><table class="fee-table"><thead><tr><th>实际送出量</th><th>大区总支持上限</th></tr></thead><tbody>${tiers.map(t=>`<tr><td>${esc(t.label||`${t.min}—${t.max??'以上'}份`)}</td><td>${esc(t.amount)}元</td></tr>`).join('')}</tbody></table><p class="gift-note">按最高档确定，档位不累加。此处500元是每家店全月上限；具体分摊依完整费用规则执行。</p></article><article class="calculator"><h3>算一算，这家店可获得多少支持</h3><div class="calc-field"><label for="gift-count">当月实际送出礼物（份）</label><input id="gift-count" type="number" min="0" max="10000" step="1" inputmode="numeric" value="0"></div><div class="calc-field"><label for="gift-cost">实际可分摊费用（元，选填）</label><input id="gift-cost" type="number" min="0" step="0.01" inputmode="decimal" placeholder="填写后可校验实际支持额"></div><div class="calc-field"><label for="other-share">其他层级已承担费用（元，选填）</label><input id="other-share" type="number" min="0" step="0.01" inputmode="decimal" placeholder="填写已承担金额"></div><div class="calc-output"><span id="calc-label">档位支持上限</span><strong id="calc-result">0<small>元</small></strong></div><p class="calc-explain" id="calc-explain">按单店最高档计算，不累加，不超过500元。</p></article></div><details class="more-content"><summary>完整分摊、采购与报销规则</summary><div class="reading">${readable(p.fees)}</div></details></section>`;
    const delivery=heading('project-delivery','MATERIAL DELIVERY','把支持，准备成可以直接使用的工具','物料详情集中在销售中心行动包；这里明确交付、维护与验收责任。','07')+`<article class="surface">${readable(p.materialDelivery)}<div class="card-actions"><a class="btn primary" href="?view=action">打开完整行动包 ↗</a><a class="btn" href="admin.html">上传与更新物料</a></div></article></section>`;
    const acceptance=heading('project-acceptance','REVIEW & ACCEPTANCE','行动完成，价值要讲清楚','复盘覆盖与连接，也呈现顾客感受、伙伴成长和11月业务变化。','08')+`<article class="acceptance-card">${readable(p.acceptance)}</article><details class="more-content"><summary>实施安排与资料来源</summary><div class="reading">${readable({assumptions:p.assumptions,sources:p.sources})}</div></details><div class="card-actions"><button class="btn primary" data-download-plan>下载完整方案文字</button><button class="btn" data-print-plan>打印 / 保存PDF</button></div></section>`;
    app.innerHTML=`<div class="page-shell">${hero}${metrics}${bg}${goals}${roles}${schedule}${operations}${fees}${delivery}${acceptance}</div>`;
    mobileNav.innerHTML=[['project-goals','◎','目标'],['project-schedule','≋','执行'],['project-operations','↗','进度'],['project-fees','◇','费用']].map(([id,icon,name])=>`<a href="#${id}"><span>${icon}</span>${name}</a>`).join('');
    document.querySelectorAll('#gift-count,#gift-cost,#other-share').forEach(x=>x.addEventListener('input',updateFee));updateFee();
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
      if(button.hasAttribute('data-download-plan')){downloadText(objectToText(data.project),'11月感恩月完整项目方案.txt');return;}
      if(button.hasAttribute('data-print-plan')){window.print();return;}
    });
    if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)mobileNav.querySelectorAll('a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-10% 0px -60% 0px'});document.querySelectorAll('.section').forEach(s=>observer.observe(s));}
    if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
  }
  async function init() {
    try {
      data=window.GRATITUDE_CONTENT;
      if(!data){const response=await fetch('content.json');if(!response.ok)throw new Error('missing content');data=await response.json();}
      if(!data.project&&!data.action)throw new Error('invalid content');
      isProject?renderProject():renderAction();attach();
    }catch(error){console.error(error);app.innerHTML='<div class="error-state"><h1>内容暂未载入</h1><p>请刷新后再试。离线打开时，请保持完整交付包的页面、内容和组件文件位于同一目录。</p><a class="btn" href="?view=action">重新打开行动包</a></div>';}
  }
  init();
})();
