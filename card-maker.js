/* LANDZ gratitude card maker. All draft state stays in this page/session. */
(function (global) {
  'use strict';
  const FONT = '"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  const VERSION = '2026.11.1';
  const FALLBACK_CARDS = {
    online: [
      {id:'trust-online',title:'谢谢，让我们参与您的选择',subtitle:'每一次托付，都值得认真回应',body:'感谢您在重要的置业选择中，愿意与我交流，也让我有机会了解您对家的期待。\n您关心的每一个细节，我都会继续认真跟进。愿接下来的每一次服务，都能为您带来更清晰的判断与更踏实的感受。',theme:'lilac'},
      {id:'autumn-online',title:'把感谢，放进日常服务里',subtitle:'秋意渐深，心意常在',body:'借着11月的感恩月，想认真向您道一声感谢。\n感谢您愿意分享自己的想法，也感谢您在交流中给予的信任。我会把这份心意放进接下来的每一次沟通与服务里，持续为您提供有用的信息和细致的支持。',theme:'autumn'},
      {id:'companion-online',title:'被您记得，是我的荣幸',subtitle:'有回应的关心，有温度的专业',body:'每一次与您的交流，都让我更了解您在意什么，也提醒我把服务做得更细一些。\n感谢您的信任与支持。无论您的需求处于哪个阶段，都欢迎随时与我联系。愿我的专业与主动，能够持续为您带来价值。',theme:'pearl'}
    ],
    print: [
      {id:'trust-print',title:'谢谢您的信任',subtitle:'用认真服务，回应每一份托付',body:'感谢您愿意把想法与期待交给我。\n您在意的事，我会认真记住；约定的服务，我会持续跟进。愿这份小小的心意，为今天的见面添一份温暖。',theme:'lilac'},
      {id:'autumn-print',title:'秋日有约，心意相伴',subtitle:'让感谢，在见面时被感受到',body:'感谢您留出时间，与我面对面交流。\n每一次了解，都让后续服务更贴近您的期待。愿这份秋日心意，为您带来一份舒心，也期待继续为您提供专业、细致的服务。',theme:'autumn'},
      {id:'followup-print',title:'把您在意的，放在心上',subtitle:'感谢交流，更期待认真回应',body:'感谢今天的交流，也感谢您分享真实的想法。\n您的关注与期待，我会落实到接下来的服务中。愿每一次联系，都有值得您信赖的回应。',theme:'pearl'}
    ]
  };
  const PALETTES = {
    lilac:{bg:'#fcf9ff',wash:'#e4d6f3',accent:'#8260a3',ink:'#4c3b62',muted:'#9b87af',line:'#d9c9e5',leaf:'#bb9fc8'},
    autumn:{bg:'#fffcf7',wash:'#f1dfc6',accent:'#9b7b55',ink:'#594b48',muted:'#aa9479',line:'#e4d4bc',leaf:'#c2a06d'},
    pearl:{bg:'#fbfbfe',wash:'#e5e1ef',accent:'#817498',ink:'#4c475d',muted:'#9a92a8',line:'#d9d4e5',leaf:'#b0a6c5'}
  };
  const STYLE = '.gcm{--gcm-ink:#3c3150;--gcm-purple:#765a99;--gcm-line:#e7deef;--gcm-muted:#82748f;color:var(--gcm-ink);font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif;line-height:1.65}.gcm *{box-sizing:border-box}.gcm button,.gcm input,.gcm textarea,.gcm select{font:inherit}.gcm button{cursor:pointer}.gcm button:focus-visible,.gcm input:focus-visible,.gcm textarea:focus-visible,.gcm select:focus-visible{outline:3px solid #ccb7e5;outline-offset:3px}.gcm-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.gcm-head h3{font-size:24px;line-height:1.4;margin:0 0 6px;font-weight:700}.gcm-head p{margin:0;color:var(--gcm-muted);font-size:13px;max-width:560px}.gcm-tabs{display:flex;gap:6px;background:#f3edf8;padding:5px;border-radius:14px;flex-shrink:0}.gcm-tab{border:0;background:transparent;border-radius:10px;padding:9px 17px;color:#756684;white-space:nowrap}.gcm-tab[aria-selected=true]{background:white;color:#684789;box-shadow:0 2px 9px #604b7b0e;font-weight:700}.gcm-grid{display:grid;grid-template-columns:minmax(270px,350px) minmax(0,1fr);gap:26px;align-items:start}.gcm-form{display:grid;gap:16px;padding:24px;border:1px solid var(--gcm-line);border-radius:20px;background:#fff}.gcm-field{display:grid;gap:6px}.gcm-field label{font-size:13px;font-weight:700;letter-spacing:.03em}.gcm-field input,.gcm-field textarea,.gcm-field select{width:100%;border:1px solid #ded4e8;border-radius:10px;background:#fcfaff;color:var(--gcm-ink);padding:11px 12px;line-height:1.7;min-width:0}.gcm-field textarea{resize:vertical;min-height:150px}.gcm-field .gcm-signature{min-height:85px}.gcm-hint{font-size:11px;color:var(--gcm-muted);line-height:1.7;overflow-wrap:anywhere}.gcm-count{display:flex;justify-content:space-between;gap:12px}.gcm-count span:last-child{white-space:nowrap}.gcm-count.gcm-long{color:#9a693b}.gcm-secondary-row{display:flex;gap:10px;flex-wrap:wrap}.gcm-btn{border:1px solid #ddcfe8;border-radius:11px;background:#fff;padding:10px 16px;color:#694e85;font-weight:600;font-size:13px;line-height:1.5;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:43px}.gcm-btn-primary{background:#73548f;border-color:#73548f;color:#fff}.gcm-btn:disabled{opacity:.48;cursor:wait}.gcm-textbtn{border:0;background:transparent;color:#7d658d;text-decoration:underline;text-underline-offset:4px;font-size:12px;padding:2px 0}.gcm-preview-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;background:radial-gradient(ellipse at 80% 0,#f1e9f6 0,transparent 55%),#f8f5fa;border:1px solid #ece4f1;border-radius:24px;padding:25px 24px 21px;min-width:0}.gcm-preview-label{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:11px;color:#86758e;letter-spacing:.08em}.gcm-canvas-holder{width:100%;max-width:365px;line-height:0;filter:drop-shadow(0 16px 24px #5f446223)}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{max-width:620px;margin:25px 0}.gcm-canvas{display:block;width:100%;height:auto;background:#fff;user-select:none;border-radius:2px}.gcm-downloads{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;width:100%;margin-top:2px}.gcm-status{font-size:12px;min-height:22px;color:#796685;text-align:center;max-width:560px;overflow-wrap:anywhere}.gcm-status[data-level=error]{color:#a54e50}.gcm-status[data-level=success]{color:#426d5d}.gcm-print-note{font-size:11px;color:#86758e;max-width:540px;text-align:center;line-height:1.75}.gcm-save-panel{width:100%;border:1px dashed #cebce0;background:#fff;padding:14px;border-radius:14px;line-height:1.7}.gcm-save-panel p{margin:0 0 10px;font-size:12px;color:#796585}.gcm-save-panel img{max-width:100%;height:auto;display:block;max-height:70vh;margin:auto;object-fit:contain}.gcm-save-panel[hidden],.gcm [hidden]{display:none!important}.gcm-callout{font-size:11px;color:#8a7b94;border-top:1px solid #eee7f3;padding-top:12px;margin-top:2px}.gcm-offscreen{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}@media(max-width:760px){.gcm-head{flex-direction:column;gap:14px}.gcm-head h3{font-size:22px}.gcm-tabs{width:100%}.gcm-tab{flex:1}.gcm-grid{grid-template-columns:1fr;gap:17px}.gcm-preview-wrap{order:-1;padding:18px 15px 16px}.gcm-canvas-holder{max-width:270px}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{margin:12px 0}.gcm-form{padding:19px;gap:14px}.gcm-downloads{gap:8px}.gcm-downloads .gcm-btn{flex:1;padding-left:10px;padding-right:10px;font-size:12px}.gcm-print-note{font-size:10px}.gcm-preview-label{font-size:10px}}';

  function characters(value) {
    const text = String(value == null ? '' : value);
    if (typeof Intl !== 'undefined' && Intl.Segmenter) return Array.from(new Intl.Segmenter('zh-CN',{granularity:'grapheme'}).segment(text), p => p.segment);
    return Array.from(text);
  }
  function clean(value) { return String(value == null ? '' : value).replace(/\r\n?/g,'\n'); }
  function font(ctx,size,weight) { ctx.font = (weight || 400) + ' ' + size + 'px ' + FONT; }
  function wrapText(ctx,text,width) {
    const lines=[];
    clean(text).split('\n').forEach(paragraph => {
      if (!paragraph) { lines.push(''); return; }
      let line='';
      characters(paragraph).forEach(char => {
        if (line && ctx.measureText(line+char).width > width) {
          if (/^[，。！？；：、）》」』】…,.!?;:]$/.test(char) && characters(line).length > 1) {
            const previous=characters(line); const carry=previous.pop();
            lines.push(previous.join('')); line=carry+char;
          } else { lines.push(line); line=char.trimStart(); }
        } else line += char;
      });
      lines.push(line);
    });
    return lines;
  }
  function fitText(ctx,text,width,height,maxSize,minSize,weight,lineFactor) {
    const factor=lineFactor || 1.68;
    for (let size=maxSize;size>=minSize;size--) {
      font(ctx,size,weight);
      const lines=wrapText(ctx,text,width), lineHeight=size*factor;
      if (lines.length*lineHeight <= height) return {fits:true,size,lines,lineHeight};
    }
    font(ctx,minSize,weight);
    return {fits:false,size:minSize,lines:wrapText(ctx,text,width),lineHeight:minSize*factor};
  }
  function drawLines(ctx,fit,x,y,color) {
    ctx.fillStyle=color; ctx.textBaseline='top';
    fit.lines.forEach((line,i)=>ctx.fillText(line,x,y+i*fit.lineHeight));
  }
  function leaf(ctx,x,y,scale,color,rotation) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rotation||0); ctx.scale(scale,scale); ctx.strokeStyle=color;ctx.lineWidth=1.1;
    ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(24,-51,53,-77,90,-102);ctx.stroke();
    [[17,-34,-16,-63],[30,-51,8,-82],[44,-66,35,-101],[59,-80,68,-113],[26,-45,59,-44],[40,-60,76,-63],[56,-77,91,-85]].forEach(p=>{ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo((p[0]+p[2])/2+6,(p[1]+p[3])/2-7,p[2],p[3]);ctx.stroke();});
    ctx.restore();
  }
  function normalizeCards(input) {
    const lists={online:[],print:[]};
    function put(card,index,fixedMode) {
      if (!card || typeof card!=='object') return;
      const raw=String(fixedMode||card.mode||card.type||card.format||card.channel||'online').toLowerCase();
      const mode=/print|offline|physical|线下|印刷/.test(raw)?'print':'online';
      const body=card.body||card.text||card.message||card.content||card.defaultBody;
      if (typeof body!=='string') return;
      lists[mode].push({id:String(card.id||mode+'-'+index),label:String(card.title||card.name||card.heading||'感谢每一份信任'),title:String(card.heading||card.headline||card.title||card.name||'感谢每一份信任'),subtitle:String(card.subtitle||card.tagline||'感恩相连 · 服务有光'),footer:String(card.footer||'感恩相连 · 服务有光'),body,theme:PALETTES[card.theme]?card.theme:['lilac','autumn','pearl'][index%3]});
    }
    if(Array.isArray(input)) input.forEach((c,i)=>put(c,i));
    else if(input&&typeof input==='object') Object.keys(input).forEach(key=>{if(Array.isArray(input[key]))input[key].forEach((c,i)=>put(c,i,key));});
    return {online:lists.online.length?lists.online:FALLBACK_CARDS.online,print:lists.print.length?lists.print:FALLBACK_CARDS.print};
  }
  function dataURLBytes(dataURL) {
    const raw=atob(dataURL.split(',')[1]||'');const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    return bytes;
  }
  function buildPdf(jpeg,width,height) {
    const jpg=typeof jpeg==='string'?dataURLBytes(jpeg):jpeg;
    const encoder=new TextEncoder();const parts=[];const offsets=[0];let length=0;
    function add(value) {const bytes=typeof value==='string'?encoder.encode(value):value;parts.push(bytes);length+=bytes.byteLength;}
    function object(number,body) {offsets[number]=length;add(number+' 0 obj\n');add(body);add('\nendobj\n');}
    add('%PDF-1.4\n%LANDZ\n');
    object(1,'<< /Type /Catalog /Pages 2 0 R >>');
    object(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    object(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 419.527559 297.637795] /Resources << /XObject << /Card 4 0 R >> >> /Contents 5 0 R >>');
    offsets[4]=length;add('4 0 obj\n<< /Type /XObject /Subtype /Image /Width '+width+' /Height '+height+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpg.byteLength+' >>\nstream\n');add(jpg);add('\nendstream\nendobj\n');
    const stream='q\n419.527559 0 0 297.637795 0 0 cm\n/Card Do\nQ\n';
    object(5,'<< /Length '+encoder.encode(stream).byteLength+' >>\nstream\n'+stream+'endstream');
    object(6,'<< /Title (LANDZ Gratitude Card A6) /Creator (LANDZ Gratitude Action Pack) >>');
    const xref=length;add('xref\n0 7\n0000000000 65535 f \n');
    for(let i=1;i<=6;i++)add(String(offsets[i]).padStart(10,'0')+' 00000 n \n');
    add('trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n'+xref+'\n%%EOF\n');
    return new Blob(parts,{type:'application/pdf'});
  }
  function loadLogo(source) {
    if(!source)return Promise.resolve(null);
    if(!/^data:image\/(?:png|jpeg|jpg|webp|svg\+xml);/i.test(source))return Promise.resolve(null);
    return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=source;});
  }
  function renderCard(canvas,draft,mode,template,logo) {
    const print=mode==='print', w=print?1748:1080,h=print?1240:1440;
    canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext('2d',{alpha:false});
    const p=PALETTES[template.theme]||PALETTES.lilac;
    ctx.fillStyle=p.bg;ctx.fillRect(0,0,w,h);
    const wash=ctx.createRadialGradient(w*.88,h*.03,10,w*.88,h*.03,w*.88);wash.addColorStop(0,p.wash);wash.addColorStop(1,p.bg);ctx.fillStyle=wash;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.strokeRect(w*.047,h*.048,w*.906,h*.904);
    ctx.save();ctx.globalAlpha=.68;leaf(ctx,w*.79,h*(print?.285:.18),print?1.9:1.55,p.leaf,-.18);ctx.restore();
    const x=print?155:105, width=print?1438:870;
    const brandY=print?128:120;
    if(logo){const boxW=print?320:300,boxH=print?100:90,ratio=Math.min(boxW/logo.width,boxH/logo.height);ctx.drawImage(logo,x,brandY,logo.width*ratio,logo.height*ratio);}
    else{font(ctx,print?32:28,600);ctx.fillStyle=p.accent;ctx.textBaseline='top';ctx.fillText('丽兹行  LANDZ',x,brandY);}
    font(ctx,print?15:13,400);ctx.fillStyle=p.muted;ctx.textBaseline='top';ctx.fillText('NOVEMBER  ·  GRATEFUL TOGETHER',x,brandY+(logo?(print?124:116):(print?93:88)));
    const titleFit=fitText(ctx,template.title,width,print?95:76,print?60:54,print?36:32,500,1.3);
    font(ctx,titleFit.size,500);drawLines(ctx,titleFit,x,print?285:300,p.ink);
    font(ctx,print?26:23,400);ctx.fillStyle=p.muted;ctx.fillText(template.subtitle,x,print?380:402);
    ctx.strokeStyle=p.accent;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,print?438:462);ctx.lineTo(x+(print?65:53),print?438:462);ctx.stroke();
    const recipient=clean(draft.recipient).trim();
    const salutation=recipient?(/^(致|亲爱的)/.test(recipient)?recipient:'致 '+recipient):'致 您';
    const recipientFit=fitText(ctx,salutation,width,print?70:68,36,22,500,1.25);
    font(ctx,recipientFit.size,500);drawLines(ctx,recipientFit,x,print?484:510,p.ink);
    const body=clean(draft.body).trim();
    const bodyFit=fitText(ctx,body,width,print?320:530,print?40:36,print?25:24,400,1.75);
    if(bodyFit.fits){font(ctx,bodyFit.size,400);drawLines(ctx,bodyFit,x,print?569:595,p.ink);}
    else{font(ctx,print?31:28,400);ctx.fillStyle=p.accent;ctx.fillText('正文较长，请精简后再导出。',x,print?610:660);font(ctx,print?25:22,400);ctx.fillStyle=p.muted;ctx.fillText('完整内容已保留在输入框中。',x,print?664:710);}
    const signature=clean(draft.signature).trim()||'丽兹行';
    const signatureFit=fitText(ctx,signature,width,print?100:108,28,20,400,1.5);
    ctx.textAlign='right';font(ctx,signatureFit.size,400);drawLines(ctx,signatureFit,x+width,print?950:1190,p.accent);ctx.textAlign='left';
    font(ctx,print?17:17,400);ctx.fillStyle=p.muted;ctx.fillText(template.footer||'感恩相连 · 服务有光',x,print?1110:1320);
    const footer='以专业与温度，回应每一份信任';const footerWidth=ctx.measureText(footer).width;ctx.fillText(footer,w-x-footerWidth,print?1110:1320);
    const problems=[];
    if(!body)problems.push('请填写想对顾客说的话');
    if(!bodyFit.fits)problems.push('正文超出版面，请减少字数或空行');
    if(!recipientFit.fits)problems.push('称呼较长，请精简后导出');
    if(!signatureFit.fits)problems.push('署名较长，请减少字数或换行');
    if(!titleFit.fits)problems.push('模板标题超出版面');
    return {ok:!problems.length,problems,bodyFontSize:bodyFit.size,width:w,height:h};
  }
  function mountCardMaker(target,options) {
    options=options||{};
    const container=typeof target==='string'?document.querySelector(target):target;
    if(!container)throw new Error('贺卡组件缺少挂载容器');
    if(container.__gratitudeCardMaker)container.__gratitudeCardMaker.destroy();
    if(!document.getElementById('gratitude-card-maker-styles')){const style=document.createElement('style');style.id='gratitude-card-maker-styles';style.textContent=STYLE;document.head.append(style);}
    const cards=normalizeCards(options.cards), uid='gcm-'+Math.random().toString(36).slice(2,10), storageKey=options.draftKey||'landz-gratitude-card-2026-11';
    const defaultDraft=mode=>({templateId:cards[mode][0].id,recipient:'王先生',body:cards[mode][0].body,signature:'您的丽兹行顾问\n[姓名]'});
    let state={mode:'online',drafts:{online:defaultDraft('online'),print:defaultDraft('print')}};
    if(options.persistDraft!==false){try{const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(saved&&saved.drafts){['online','print'].forEach(mode=>{if(saved.drafts[mode])state.drafts[mode]=Object.assign(defaultDraft(mode),saved.drafts[mode]);});if(saved.mode==='print')state.mode='print';}}catch(_) {}}
    let destroyed=false,renderCounter=0,animation=0,result={ok:false},busy=false;
    const logoPromise=loadLogo(options.logoDataUrl);
    const listeners=[];const urls=new Set();
    function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
    function on(node,event,fn){node.addEventListener(event,fn);listeners.push(()=>node.removeEventListener(event,fn));}
    const root=el('section','gcm');root.setAttribute('aria-label','我的感恩贺卡定制');
    const head=el('div','gcm-head'), heading=el('div');heading.append(el('h3','','把想说的话，写进自己的贺卡'),el('p','','输入称呼、心意和署名，生成属于你与顾客的专属表达。你的填写不会影响其他伙伴。'));
    const tabs=el('div','gcm-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','贺卡使用方式');const modeButtons={};
    [['online','线上发送'],['print','线下面见']].forEach(([mode,label])=>{const b=el('button','gcm-tab',label);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-controls',uid+'-editor');modeButtons[mode]=b;on(b,'click',()=>{state.mode=mode;populate();save();schedule();});tabs.append(b);});
    head.append(heading,tabs);root.append(head);
    const grid=el('div','gcm-grid'),form=el('div','gcm-form');form.id=uid+'-editor';
    function field(label,node,id){const box=el('div','gcm-field'),l=el('label','',label);node.id=uid+'-'+id;l.htmlFor=node.id;box.append(l,node);form.append(box);return box;}
    const templateSelect=el('select');field('选择一份心意',templateSelect,'template');
    const recipientInput=el('input');recipientInput.type='text';recipientInput.autocomplete='off';recipientInput.placeholder='例如：王先生、李女士一家';field('称呼',recipientInput,'recipient');
    const bodyInput=el('textarea');bodyInput.rows=7;bodyInput.placeholder='写下一件真实的服务细节，再说出你的感谢与下一步关心。';const bodyField=field('想对顾客说的话',bodyInput,'body');
    const countRow=el('div','gcm-hint gcm-count'),countHint=el('span'),count=el('span');countRow.append(countHint,count);bodyField.append(countRow);
    const signatureInput=el('textarea','gcm-signature');signatureInput.rows=2;signatureInput.placeholder='例如：您的丽兹行顾问\n张晓';field('署名',signatureInput,'signature');
    const secondary=el('div','gcm-secondary-row'),reference=el('button','gcm-textbtn','使用这份模板的参考文案'),reset=el('button','gcm-textbtn','重置我的本页草稿');reference.type=reset.type='button';secondary.append(reference,reset);form.append(secondary);
    form.append(el('div','gcm-callout','小提示：补入你们之间的一件真实细节，让感谢更有分量。线上与线下分别保存你的草稿；公共模板保持原样。'));
    const preview=el('div','gcm-preview-wrap'),previewLabel=el('div','gcm-preview-label'),labelText=el('span'),resolution=el('span');previewLabel.append(labelText,resolution);
    const holder=el('div','gcm-canvas-holder'),canvas=el('canvas','gcm-canvas');canvas.setAttribute('role','img');canvas.setAttribute('aria-label','你的感恩贺卡实时预览');holder.append(canvas);
    const downloads=el('div','gcm-downloads'),png=el('button','gcm-btn gcm-btn-primary','下载电子贺卡'),pdf=el('button','gcm-btn','下载打印PDF'),mobileSave=el('button','gcm-btn','长按保存预览');[png,pdf,mobileSave].forEach(b=>b.type='button');downloads.append(png,pdf,mobileSave);
    const status=el('div','gcm-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');const printNote=el('div','gcm-print-note');
    const savePanel=el('div','gcm-save-panel');savePanel.hidden=true;savePanel.append(el('p','','在微信或手机浏览器中，可长按下方图片保存到相册，再发送给顾客。'));const saveImage=el('img');saveImage.alt='长按保存你的定制贺卡';savePanel.append(saveImage);
    preview.append(previewLabel,holder,downloads,status,printNote,savePanel);grid.append(form,preview);root.append(grid);container.replaceChildren(root);
    function currentDraft(){return state.drafts[state.mode];}
    function currentTemplate(){return cards[state.mode].find(c=>c.id===currentDraft().templateId)||cards[state.mode][0];}
    function save(){if(options.persistDraft!==false){try{sessionStorage.setItem(storageKey,JSON.stringify(state));}catch(_) {}}}
    function say(message,level){status.textContent=message;status.dataset.level=level||'info';}
    function populate(){const d=currentDraft();templateSelect.replaceChildren();cards[state.mode].forEach(c=>{const option=el('option','',c.label||c.title);option.value=c.id;templateSelect.append(option);});templateSelect.value=currentTemplate().id;recipientInput.value=d.recipient;bodyInput.value=d.body;signatureInput.value=d.signature;['online','print'].forEach(mode=>{modeButtons[mode].setAttribute('aria-selected',String(mode===state.mode));modeButtons[mode].tabIndex=mode===state.mode?0:-1;});preview.dataset.mode=state.mode;pdf.hidden=state.mode!=='print';png.textContent=state.mode==='print'?'下载高清图片':'下载电子贺卡';labelText.textContent=state.mode==='print'?'PRINT · A6横版':'DIGITAL · 线上专属贺卡';resolution.textContent=state.mode==='print'?'1748 × 1240 px':'1080 × 1440 px';printNote.textContent=state.mode==='print'?'成品尺寸：148 × 105 mm（A6横版），约300 dpi。打印PDF时请选择“实际大小 / 100%”。此版保留安全边距；批量印刷请先打样。':'适用于微信发送；图片中仅包含当前贺卡内容。手机若未弹出下载，可选择“长按保存预览”。';countHint.textContent=state.mode==='print'?'建议正文140字以内，留白更舒展':'建议正文260字以内，短段落更适合手机阅读';savePanel.hidden=true;}
    async function render(){const ticket=++renderCounter;const mode=state.mode;const draft=Object.assign({},currentDraft());const template=Object.assign({},currentTemplate());const logo=await logoPromise;if(destroyed||ticket!==renderCounter)return null;result=renderCard(canvas,draft,mode,template,logo);const n=characters(draft.body).length;count.textContent=n+'字';countRow.classList.toggle('gcm-long',n>(mode==='print'?140:260));png.disabled=pdf.disabled=mobileSave.disabled=busy||!result.ok;if(!result.ok)say(result.problems.join('；')+'。完整输入会为你保留。','error');else if(!busy)say(mode==='print'?'你的线下贺卡已就绪，可下载高清图片或A6打印PDF。':'你的电子贺卡已就绪，写得越具体，心意越被感受到。');return result;}
    function schedule(){if(animation)global.cancelAnimationFrame(animation);animation=global.requestAnimationFrame(()=>{animation=0;render().catch(()=>say('预览暂时未完成，请稍后重试。','error'));});}
    function updateDraft(){const d=currentDraft();d.recipient=recipientInput.value;d.body=bodyInput.value;d.signature=signatureInput.value;savePanel.hidden=true;save();schedule();}
    [recipientInput,bodyInput,signatureInput].forEach(input=>on(input,'input',updateDraft));
    on(templateSelect,'change',()=>{const d=currentDraft(),old=currentTemplate();d.templateId=templateSelect.value;if(d.body===old.body)d.body=currentTemplate().body;populate();save();schedule();});
    on(reference,'click',()=>{currentDraft().body=currentTemplate().body;bodyInput.value=currentDraft().body;savePanel.hidden=true;save();schedule();});
    on(reset,'click',()=>{state.drafts[state.mode]=defaultDraft(state.mode);populate();save();render().then(()=>say('已重置你的本页草稿，其他伙伴的内容不受影响。','success'));});
    function filename(ext){const safe=clean(currentDraft().recipient).replace(/[\\/:*?"<>|\s]/g,'').slice(0,30)||'专属';return '丽兹行感恩贺卡-'+safe+(state.mode==='print'?'-A6打印版':'-线上版')+'.'+ext;}
    function downloadBlob(blob,name){const url=URL.createObjectURL(blob);urls.add(url);const a=el('a');a.href=url;a.download=name;a.rel='noopener';document.body.append(a);a.click();a.remove();global.setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},60000);}
    async function download(kind){if(busy)return;busy=true;png.disabled=pdf.disabled=mobileSave.disabled=true;say('正在生成你的专属贺卡…');try{const rendered=await render();if(!rendered||!rendered.ok)return false;if(kind==='pdf'){if(state.mode!=='print')throw new Error('请切换到线下面见版后下载打印PDF');const blob=buildPdf(canvas.toDataURL('image/jpeg',.97),canvas.width,canvas.height);downloadBlob(blob,filename('pdf'));say('A6打印PDF已生成，请按实际大小打印。','success');}else{const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('图片生成失败')),'image/png'));downloadBlob(blob,filename('png'));say('图片已生成；微信中若未保存成功，可点“长按保存预览”。','success');}return true;}catch(e){say(e&&e.message?e.message:'导出暂时未完成，请重试。','error');return false;}finally{busy=false;png.disabled=pdf.disabled=mobileSave.disabled=!result.ok;}}
    on(png,'click',()=>download('png'));on(pdf,'click',()=>download('pdf'));
    on(mobileSave,'click',async()=>{const rendered=await render();if(!rendered||!rendered.ok)return;saveImage.src=canvas.toDataURL('image/png');savePanel.hidden=false;say('长按下方图片，保存你自己的贺卡。');savePanel.scrollIntoView({behavior:'smooth',block:'nearest'});});
    on(tabs,'keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const mode=event.key==='Home'?'online':event.key==='End'?'print':state.mode==='online'?'print':'online';modeButtons[mode].click();modeButtons[mode].focus();});
    const api={version:VERSION,render,getDraft:()=>JSON.parse(JSON.stringify(state)),setDraft:(value,mode)=>{const targetMode=mode==='print'?'print':mode==='online'?'online':state.mode;['recipient','body','signature','templateId'].forEach(key=>{if(value&&value[key]!=null)state.drafts[targetMode][key]=String(value[key]);});state.mode=targetMode;populate();save();return render();},download,reset:()=>reset.click(),destroy:()=>{destroyed=true;if(animation)global.cancelAnimationFrame(animation);listeners.forEach(remove=>remove());urls.forEach(url=>URL.revokeObjectURL(url));if(container.__gratitudeCardMaker===api)delete container.__gratitudeCardMaker;root.remove();}};
    container.__gratitudeCardMaker=api;populate();render().catch(()=>say('预览暂时未完成，请重试。','error'));if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(!destroyed)schedule();});return api;
  }
  global.mountCardMaker=mountCardMaker;
  if(typeof module!=='undefined'&&module.exports)module.exports={buildPdf,wrapText,fitText,normalizeCards,characters,renderCard};
})(typeof window!=='undefined'?window:globalThis);
