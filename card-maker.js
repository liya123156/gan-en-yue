/* LANDZ gratitude card maker. All draft state stays in this page/session. */
(function (global) {
  'use strict';
  const FONT = '"Noto Sans CJK SC","PingFang SC","Microsoft YaHei",sans-serif';
  const SERIF = '"Noto Serif SC","Songti SC",STSong,SimSun,"Noto Sans CJK SC",serif';
  const VERSION = '2026.11.2';
  const THEMES = ['champagne','haipai','amber','jade','bluegold'];
  const THEME_NAMES = {champagne:'都会鎏金',haipai:'海派雅紫',amber:'梧桐暖杏',jade:'玉兰青绿',bluegold:'申城蓝金'};
  const THEME_NOTES = {champagne:'外滩建筑 · 香槟金',haipai:'海派装饰 · 雅致紫',amber:'秋日梧桐 · 暖杏铜',jade:'玉兰花意 · 玉润绿',bluegold:'陆家嘴天际线 · 蓝金'};
  const THEME_ALIASES = {lilac:'haipai',autumn:'amber',pearl:'champagne'};
  const PALETTES = {
    champagne:{bg:'#fffdf6',wash:'#efe0bd',panel:'#f5e9d1',accent:'#a47d39',ink:'#493b2e',muted:'#8e7b60',line:'#d7c29a',motif:'bund'},
    haipai:{bg:'#fffaf6',wash:'#ead9e8',panel:'#eee1eb',accent:'#86516f',ink:'#4b3544',muted:'#917687',line:'#d3b6c5',motif:'deco'},
    amber:{bg:'#fffaf2',wash:'#f3dcc6',panel:'#f5dfc8',accent:'#b77645',ink:'#573e30',muted:'#9f7c64',line:'#dfbb97',motif:'autumn'},
    jade:{bg:'#fcfcf4',wash:'#dce7d6',panel:'#e5eadb',accent:'#507261',ink:'#344b41',muted:'#7c927f',line:'#b8cbb2',motif:'magnolia'},
    bluegold:{bg:'#fffcf4',wash:'#e0e6e8',panel:'#e8ecea',accent:'#4b657b',ink:'#314553',muted:'#82919a',line:'#b8c6ce',motif:'lujiazui'}
  };
  const FALLBACK_HEADINGS=['承蒙信任，谨致谢意','知遇相伴，感恩同行','秋意渐浓，惦念如常','以心相待，致谢相知','相伴申城，感谢有您'];
  const FALLBACK_ONLINE=[
    '感谢您在重要的置业选择中，给予我的信任与交流的机会。\n您对生活的期待、对细节的考量，我始终认真记在心里。\n值此感恩月，谨向您致以诚挚谢意，也期待以持续的专业准备与细致服务，为您的每一次选择提供有价值的支持。',
    '在上海这座不断向前的城市里，能够参与您对理想生活的思考，是我的荣幸。\n感谢您愿意分享真实的需要，也感谢每一次坦诚的交流。\n我会持续关注您的计划与变化，以更贴近所需的专业服务，认真回应这份信任。',
    '深秋渐至，借这一封短笺，向您道一声感谢。\n感谢您在交流中给予的信任与支持，您关心的事，我会持续用心跟进。\n愿接下来的每一次联系，都有值得您参考的信息，也有细致、妥帖的回应。',
    '感谢您愿意让我了解您的想法，并在重要的选择中给予信任。\n我珍惜每一次交流，也重视您不同阶段的需要与变化。\n愿以专业、耐心与持续的行动，陪伴您把关心的问题逐项理清，让服务始终贴近您的期待。',
    '城市的风景不断更新，认真服务您的心意始终如一。\n感谢您给予我的信任，也感谢您在每一次沟通中的真诚。\n我将持续做好专业准备，关注您新的计划与需要，以有价值的服务，回应每一份托付。'
  ];
  const FALLBACK_PRINT=[
    '承蒙信任，谨致谢意。\n感谢您愿意分享真实的想法，让我有机会参与您的重要选择。\n您关心的事，我会认真准备、持续跟进，以细致服务回应这份托付。',
    '感谢今天的交流与信任。\n您对生活的期待与考量，我已认真记下。\n期待以持续的专业准备，陪伴您把下一步选择看得更清晰、做得更从容。',
    '秋意渐浓，谨以这份心意，向您表达诚挚感谢。\n感谢您拨冗相见，也感谢您分享真实的需要。\n约定的服务，我会逐项做好；您关心的事，我会持续回应。',
    '感谢您的时间与信任。\n每一次深入了解，都让服务更贴近您的期待。\n愿以专业与耐心，将今天的交流落实为下一步细致、妥帖的行动。',
    '感谢相遇，亦感谢每一份信任。\n能够为您提供服务，是我的荣幸。\n愿接下来的每一次联系，都有专业准备，也有对您所需的认真回应。'
  ];
  const FALLBACK_CARDS={online:THEMES.map((theme,i)=>({id:theme+'-online',label:THEME_NAMES[theme],title:FALLBACK_HEADINGS[i],subtitle:'以专业与诚意，回应每一份信任',body:FALLBACK_ONLINE[i],theme})),print:THEMES.map((theme,i)=>({id:theme+'-print',label:THEME_NAMES[theme],title:FALLBACK_HEADINGS[i],subtitle:'以专业与诚意，回应每一份信任',body:FALLBACK_PRINT[i],theme}))};
  const STYLE = ".gcm{--gcm-ink:#3c3150;--gcm-purple:#765a99;--gcm-line:#e7deef;--gcm-muted:#82748f;color:var(--gcm-ink);font-family:Inter,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;line-height:1.65}\n.gcm *{box-sizing:border-box}.gcm button,.gcm input,.gcm textarea,.gcm select{font:inherit}.gcm button{cursor:pointer}.gcm button:focus-visible,.gcm input:focus-visible,.gcm textarea:focus-visible,.gcm select:focus-visible{outline:3px solid #ccb7e5;outline-offset:3px}.gcm-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.gcm-head h3{font-size:24px;line-height:1.4;margin:0 0 6px;font-weight:700}.gcm-head p{margin:0;color:var(--gcm-muted);font-size:13px;max-width:560px}.gcm-tabs{display:flex;gap:6px;background:#f3edf8;padding:5px;border-radius:14px;flex-shrink:0}.gcm-tab{border:0;background:transparent;border-radius:10px;padding:9px 17px;color:#756684;white-space:nowrap}.gcm-tab[aria-selected=true]{background:white;color:#684789;box-shadow:0 2px 9px #604b7b0e;font-weight:700}.gcm-grid{display:grid;grid-template-columns:minmax(270px,350px) minmax(0,1fr);gap:26px;align-items:start}.gcm-form{display:grid;gap:16px;padding:24px;border:1px solid var(--gcm-line);border-radius:20px;background:#fff}.gcm-field{display:grid;gap:6px}.gcm-field label{font-size:13px;font-weight:700;letter-spacing:.03em}.gcm-field input,.gcm-field textarea,.gcm-field select{width:100%;border:1px solid #ded4e8;border-radius:10px;background:#fcfaff;color:var(--gcm-ink);padding:11px 12px;line-height:1.7;min-width:0}.gcm-field textarea{resize:vertical;min-height:150px}.gcm-field .gcm-signature{min-height:85px}.gcm-hint{font-size:11px;color:var(--gcm-muted);line-height:1.7;overflow-wrap:anywhere}.gcm-count{display:flex;justify-content:space-between;gap:12px}.gcm-count span:last-child{white-space:nowrap}.gcm-count.gcm-long{color:#9a693b}.gcm-secondary-row{display:flex;gap:10px;flex-wrap:wrap}.gcm-btn{border:1px solid #ddcfe8;border-radius:11px;background:#fff;padding:10px 16px;color:#694e85;font-weight:600;font-size:13px;line-height:1.5;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:43px}.gcm-btn-primary{background:#73548f;border-color:#73548f;color:#fff}.gcm-btn:disabled{opacity:.48;cursor:wait}.gcm-textbtn{border:0;background:transparent;color:#7d658d;text-decoration:underline;text-underline-offset:4px;font-size:12px;padding:2px 0}.gcm-preview-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;background:radial-gradient(ellipse at 80% 0,#f1e9f6 0,transparent 55%),#f8f5fa;border:1px solid #ece4f1;border-radius:24px;padding:25px 24px 21px;min-width:0}.gcm-preview-label{width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:11px;color:#86758e;letter-spacing:.08em}.gcm-canvas-holder{width:100%;max-width:365px;line-height:0;filter:drop-shadow(0 16px 24px #5f446223)}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{max-width:620px;margin:25px 0}.gcm-canvas{display:block;width:100%;height:auto;background:#fff;user-select:none;border-radius:2px}.gcm-downloads{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;width:100%;margin-top:2px}.gcm-status{font-size:12px;min-height:22px;color:#796685;text-align:center;max-width:560px;overflow-wrap:anywhere}.gcm-status[data-level=error]{color:#a54e50}.gcm-status[data-level=success]{color:#426d5d}.gcm-print-note{font-size:11px;color:#86758e;max-width:540px;text-align:center;line-height:1.75}.gcm-save-panel{width:100%;border:1px dashed #cebce0;background:#fff;padding:14px;border-radius:14px;line-height:1.7}.gcm-save-panel p{margin:0 0 10px;font-size:12px;color:#796585}.gcm-save-panel img{max-width:100%;height:auto;display:block;max-height:70vh;margin:auto;object-fit:contain}.gcm-save-panel[hidden],.gcm [hidden]{display:none!important}.gcm-callout{font-size:11px;color:#8a7b94;border-top:1px solid #eee7f3;padding-top:12px;margin-top:2px}.gcm-offscreen{position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden}\n@media(max-width:760px){.gcm-head{flex-direction:column;gap:14px}.gcm-head h3{font-size:22px}.gcm-tabs{width:100%}.gcm-tab{flex:1}.gcm-grid{grid-template-columns:1fr;gap:17px}.gcm-preview-wrap{order:-1;padding:18px 15px 16px}.gcm-canvas-holder{max-width:270px}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{margin:12px 0}.gcm-form{padding:19px;gap:14px}.gcm-downloads{gap:8px}.gcm-downloads .gcm-btn{flex:1;padding-left:10px;padding-right:10px;font-size:12px}.gcm-print-note{font-size:10px}.gcm-preview-label{font-size:10px}}\n/* Warm business collection · 2026.11 */\n.gcm{--gcm-ink:#40343a;--gcm-purple:#86516f;--gcm-line:#eadfce;--gcm-muted:#82736b;font-family:\"PingFang SC\",\"Microsoft YaHei\",\"Noto Sans CJK SC\",sans-serif}.gcm-head{gap:22px;margin-bottom:24px}.gcm-head h3{font-family:\"Noto Serif SC\",\"Songti SC\",STSong,SimSun,serif;font-size:28px;line-height:1.45;margin:0 0 9px;letter-spacing:.04em;font-weight:600}.gcm-tabs{background:#f4ecdf;border:1px solid #e8dac4;border-radius:13px}.gcm-tab{color:#846b6d;padding:10px 18px}.gcm-tab[aria-selected=true]{color:#784861;box-shadow:0 3px 12px #78604c14}.gcm-grid{grid-template-columns:minmax(280px,360px) minmax(0,1fr);gap:28px}.gcm-form{padding:26px;gap:18px;border-radius:18px;background:linear-gradient(145deg,#fffefa,#fffaf3);box-shadow:0 8px 24px #83674106}.gcm-field{gap:8px}.gcm-field input,.gcm-field textarea,.gcm-field select{border-color:#e2d5c4;border-radius:9px;background:#fffdf9;padding:11px 13px;line-height:1.8}.gcm-field textarea{min-height:180px}.gcm-field .gcm-signature{min-height:88px}.gcm-field label,.gcm-style-title{font-size:13px;font-weight:700;letter-spacing:.04em}.gcm-btn{border-color:#dac7ab;border-radius:9px;background:#fffdf9;padding:11px 18px;color:#7b4b65;min-height:44px}.gcm-btn-primary{background:#86516f;border-color:#86516f;color:#fff}.gcm-btn:hover{box-shadow:0 5px 14px #86516f12;transform:translateY(-1px)}.gcm-btn:disabled{transform:none}.gcm-textbtn{color:#8b5e68}.gcm-preview-wrap{gap:16px;background:radial-gradient(ellipse at 82% 4%,#ffe8c6 0,transparent 57%),linear-gradient(150deg,#fff9f0,#fff4e9);border-color:#eddfc9;border-radius:20px;padding:26px 25px 22px}.gcm-preview-label{color:#91785f;letter-spacing:.1em}.gcm-canvas-holder{max-width:390px;filter:drop-shadow(0 18px 24px #84674324)}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{max-width:650px;margin:23px 0}.gcm-status{color:#806a63}.gcm-print-note{color:#8d796c;line-height:1.8}.gcm-save-panel{border-color:#d7ba8d;background:#fffdf8}.gcm-callout{color:#8c796d;border-color:#eadfce}.gcm button:focus-visible,.gcm input:focus-visible,.gcm textarea:focus-visible,.gcm select:focus-visible{outline-color:#d2af74}\n.gcm-style-block{display:grid;gap:9px}.gcm-style-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.gcm-style-choice{padding:4px;border:1px solid #e5d9c8;border-radius:8px;background:#fffdfa;color:#66534b;display:grid;gap:5px;min-width:0;text-align:center;font-size:10px;line-height:1.5}.gcm-style-choice[aria-checked=true]{border:2px solid #a47a48;padding:3px;background:#fff4dd;box-shadow:0 0 0 2px #c99d5530}.gcm-style-thumb{height:53px;border-radius:4px;position:relative;overflow:hidden;background:var(--style-bg);border:1px solid #ffffffb0}.gcm-style-thumb:before{content:\"\";position:absolute;inset:6px;border:1px solid var(--style-accent);opacity:.65}.gcm-style-thumb:after{content:\"\";position:absolute;left:15%;right:15%;height:16px;bottom:7px;background:repeating-linear-gradient(90deg,var(--style-accent) 0 2px,transparent 2px 6px);opacity:.45;clip-path:polygon(0 100%,0 55%,12% 55%,12% 23%,25% 23%,25% 45%,35% 45%,35% 0,45% 0,45% 40%,55% 40%,55% 15%,70% 15%,70% 60%,85% 60%,85% 35%,100% 35%,100% 100%)}.gcm-style-name{display:block;white-space:normal;overflow-wrap:anywhere}.gcm-style-hint{font-size:11px;line-height:1.6;color:#8b7767}\n@media(max-width:1100px) and (min-width:761px){.gcm-grid{grid-template-columns:minmax(250px,310px) minmax(0,1fr);gap:20px}.gcm-form{padding:20px}.gcm-style-grid{gap:4px}.gcm-style-choice{font-size:9px}.gcm-style-thumb{height:45px}.gcm-head{flex-wrap:wrap}}\n@media(max-width:760px){.gcm-head h3{font-size:25px}.gcm-grid{grid-template-columns:1fr;gap:19px}.gcm-preview-wrap{order:0;padding:20px 15px 18px}.gcm-canvas-holder{max-width:310px}.gcm-preview-wrap[data-mode=print] .gcm-canvas-holder{margin:12px 0}.gcm-form{padding:20px;gap:16px}.gcm-style-thumb{height:59px}.gcm-style-choice{font-size:10px}}\n";

  function characters(value) {
    const text = String(value == null ? '' : value);
    if (typeof Intl !== 'undefined' && Intl.Segmenter) return Array.from(new Intl.Segmenter('zh-CN',{granularity:'grapheme'}).segment(text), p => p.segment);
    return Array.from(text);
  }
  function clean(value) { return String(value == null ? '' : value).replace(/\r\n?/g,'\n'); }
  function font(ctx,size,weight,family) { ctx.font = (weight || 400) + ' ' + size + 'px ' + (family || FONT); }
  function wrapText(ctx,text,width) {
    const lines=[];
    clean(text).split('\n').forEach(paragraph => {
      if (!paragraph) { lines.push(''); return; }
      const paragraphStart=lines.length;
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
      // Keep a short closing phrase with its natural clause, rather than orphaning one or two characters.
      if(lines.length-paragraphStart>1&&characters(lines[lines.length-1]).length<=4){
        const previous=lines[lines.length-2],last=lines[lines.length-1],breaks=Array.from(previous.matchAll(/[，；：、,;]/g));
        for(let i=breaks.length-1;i>=0;i--){const split=breaks[i].index+1,tail=previous.slice(split);if(tail&&ctx.measureText(tail+last).width<=width){lines[lines.length-2]=previous.slice(0,split);lines[lines.length-1]=tail+last;break;}}
      }
    });
    return lines;
  }
  function fitText(ctx,text,width,height,maxSize,minSize,weight,lineFactor,family) {
    const factor=lineFactor || 1.68;
    for (let size=maxSize;size>=minSize;size--) {
      font(ctx,size,weight,family);
      const lines=wrapText(ctx,text,width), lineHeight=size*factor;
      if (lines.length*lineHeight <= height) return {fits:true,size,lines,lineHeight};
    }
    font(ctx,minSize,weight,family);
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
      const theme=PALETTES[card.theme]?card.theme:THEME_ALIASES[card.theme]||THEMES[index%THEMES.length];
      lists[mode].push({id:String(card.id||mode+'-'+index),label:String(card.styleName||card.label||card.title||card.name||THEME_NAMES[theme]),title:String(card.heading||card.headline||card.title||card.name||'承蒙信任，谨致谢意'),subtitle:String(card.subtitle||card.tagline||'以专业与诚意，回应每一份信任'),footer:String(card.footer||'感恩相连 · 服务有光'),body,theme});
    }
    if(Array.isArray(input)) input.forEach((c,i)=>put(c,i));
    else if(input&&typeof input==='object') Object.keys(input).forEach(key=>{if(Array.isArray(input[key]))input[key].forEach((c,i)=>put(c,i,key));});
    for(const mode of ['online','print']) {
      if(!lists[mode].length)lists[mode]=FALLBACK_CARDS[mode].map(c=>Object.assign({},c));
      else if(lists[mode].length<5)FALLBACK_CARDS[mode].forEach(c=>{if(lists[mode].length<5&&!lists[mode].some(x=>x.theme===c.theme))lists[mode].push(Object.assign({},c));});
    }
    return lists;
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
  function line(ctx,x1,y1,x2,y2) {ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function bund(ctx,width,height) {
    const scale=width/650;ctx.save();ctx.scale(scale,scale);const base=height/scale;
    ctx.beginPath();ctx.moveTo(0,base);ctx.lineTo(650,base);ctx.stroke();
    const blocks=[[12,88,62],[84,66,51],[148,110,70],[231,80,52],[294,137,72],[381,93,59],[454,116,74],[543,71,76]];
    for(const [x,high,w] of blocks){ctx.strokeRect(x,base-high,w,high);line(ctx,x-4,base-high,x+w+4,base-high);line(ctx,x+5,base-high+8,x+w-5,base-high+8);for(let xx=x+11;xx<x+w-6;xx+=13){line(ctx,xx,base-13,xx,base-high+20);}for(let yy=base-30;yy>base-high+14;yy-=20)line(ctx,x+4,yy,x+w-4,yy);}
    // A stepped Art Deco tower and the clock-topped Customs House evoke the Bund.
    ctx.beginPath();ctx.moveTo(158,base-110);ctx.lineTo(166,base-127);ctx.lineTo(173,base-127);ctx.lineTo(173,base-143);ctx.lineTo(192,base-155);ctx.lineTo(211,base-143);ctx.lineTo(211,base-127);ctx.lineTo(218,base-127);ctx.lineTo(218,base-110);ctx.stroke();
    line(ctx,192,base-155,192,base-169);
    ctx.strokeRect(317,base-184,27,47);ctx.beginPath();ctx.arc(330.5,base-166,8,0,Math.PI*2);ctx.stroke();line(ctx,330.5,base-166,330.5,base-172);line(ctx,330.5,base-166,336,base-163);ctx.beginPath();ctx.moveTo(315,base-184);ctx.lineTo(330.5,base-200);ctx.lineTo(346,base-184);ctx.stroke();
    ctx.restore();
  }
  function lujiazui(ctx,width,height) {
    const scale=width/650;ctx.save();ctx.scale(scale,scale);const base=height/scale;
    line(ctx,0,base,650,base);
    // Oriental Pearl: antenna, two spheres and sloping supporting legs.
    line(ctx,105,base-210,105,base-179);ctx.beginPath();ctx.arc(105,base-163,17,0,Math.PI*2);ctx.stroke();line(ctx,100,base-146,97,base-100);line(ctx,110,base-146,113,base-100);ctx.beginPath();ctx.arc(105,base-82,28,0,Math.PI*2);ctx.stroke();line(ctx,90,base-58,65,base);line(ctx,105,base-54,105,base);line(ctx,120,base-58,145,base);line(ctx,80,base-42,130,base-42);
    // Jin Mao's tiered silhouette.
    const levels=[[195,65,80],[204,100,62],[212,132,46],[220,159,30],[226,184,18]];
    levels.forEach(([x,top,w])=>{ctx.strokeRect(x,base-top,w,Math.min(35,top));line(ctx,x-3,base-top,x+w+3,base-top);});line(ctx,235,base-184,235,base-205);
    // World Financial Center with its distinctive trapezoid opening.
    ctx.beginPath();ctx.moveTo(330,base);ctx.lineTo(340,base-231);ctx.lineTo(390,base-231);ctx.lineTo(402,base);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(348,base-216);ctx.lineTo(382,base-216);ctx.lineTo(376,base-193);ctx.lineTo(353,base-193);ctx.closePath();ctx.stroke();line(ctx,347,base-181,339,base);line(ctx,383,base-181,393,base);
    // Shanghai Tower: tapering, curved and twisting toward the crown.
    ctx.beginPath();ctx.moveTo(478,base);ctx.bezierCurveTo(458,base-90,474,base-210,492,base-262);ctx.bezierCurveTo(505,base-278,520,base-281,533,base-270);ctx.bezierCurveTo(556,base-208,567,base-89,554,base);ctx.stroke();ctx.beginPath();ctx.moveTo(485,base);ctx.bezierCurveTo(540,base-85,483,base-175,525,base-274);ctx.stroke();for(let y=30;y<250;y+=24)line(ctx,479,base-y,552,base-y-7);
    [[18,48,28],[48,66,29],[158,52,27],[278,90,33],[415,52,35],[575,81,31],[612,43,28]].forEach(([x,high,w])=>ctx.strokeRect(x,base-high,w,high));
    ctx.restore();
  }
  function magnolia(ctx,x,y,scale,color) {
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.strokeStyle=color;ctx.lineWidth=1.1;
    const petals=[[0,-64,-27,-126,-48,-88],[-2,-66,35,-124,53,-87],[-3,-62,-82,-98,-69,-43],[2,-62,80,-101,72,-40],[0,-48,-43,-68,-42,-18],[0,-48,46,-71,45,-17]];
    petals.forEach(([sx,sy,cx,cy,ex,ey])=>{ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo(cx,cy,ex,ey);ctx.quadraticCurveTo(ex*.45,ey+31,0,0);ctx.stroke();});ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-6,42,19,78,32,126);ctx.stroke();ctx.beginPath();ctx.moveTo(9,49);ctx.quadraticCurveTo(55,24,67,52);ctx.quadraticCurveTo(40,65,9,49);ctx.stroke();ctx.restore();
  }
  function deco(ctx,x,y,width,height,color) {
    ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1;
    for(let n=0;n<5;n++){const inset=n*14;ctx.beginPath();ctx.moveTo(x+inset,y+height);ctx.lineTo(x+inset,y+height*.38+inset*.3);ctx.quadraticCurveTo(x+width*.5,y-height*.34+inset,x+width-inset,y+height*.38+inset*.3);ctx.lineTo(x+width-inset,y+height);ctx.stroke();}line(ctx,x+width*.5,y+height*.08,x+width*.5,y+height);ctx.restore();
  }
  function paper(ctx,w,h,p,print) {
    ctx.fillStyle=p.bg;ctx.fillRect(0,0,w,h);
    const wash=ctx.createRadialGradient(w*.94,h*.05,0,w*.94,h*.05,w*.95);wash.addColorStop(0,p.wash);wash.addColorStop(1,p.bg);ctx.fillStyle=wash;ctx.fillRect(0,0,w,h);
    const m=print?48:44;ctx.strokeStyle=p.line;ctx.lineWidth=1.5;ctx.strokeRect(m,m,w-m*2,h-m*2);ctx.globalAlpha=.5;ctx.strokeRect(m+11,m+11,w-m*2-22,h-m*2-22);ctx.globalAlpha=1;
    const gold='#bc985d';ctx.strokeStyle=gold;ctx.lineWidth=3;
    [[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]].forEach(([x,y,sx,sy])=>{line(ctx,x,y,x+sx*42,y);line(ctx,x,y,x,y+sy*42);});
    if(print){const g=ctx.createLinearGradient(70,70,575,h);g.addColorStop(0,p.panel);g.addColorStop(1,p.bg);ctx.fillStyle=g;ctx.fillRect(70,70,500,h-140);ctx.strokeStyle=p.line;ctx.lineWidth=1.5;line(ctx,599,100,599,h-100);}
    ctx.save();ctx.globalAlpha=.38;ctx.strokeStyle=p.accent;ctx.lineWidth=1.3;
    if(p.motif==='bund'){ctx.translate(print?115:92,print?935:1213);bund(ctx,print?420:610,print?170:140);}
    if(p.motif==='lujiazui'){ctx.translate(print?112:91,print?912:1195);lujiazui(ctx,print?430:630,print?190:160);}
    if(p.motif==='deco'){deco(ctx,print?115:790,print?920:180,print?420:170,print?170:265,p.accent);if(!print){ctx.globalAlpha=.23;ctx.translate(92,1228);bund(ctx,540,115);}}
    if(p.motif==='autumn'){leaf(ctx,print?156:916,print?1100:390,print?2.4:1.75,p.accent,-.45);leaf(ctx,print?340:90,print?1050:1300,print?1.8:1.5,p.accent,1.3);}
    if(p.motif==='magnolia'){magnolia(ctx,print?325:952,print?1100:360,print?1.8:1.55,p.accent);if(!print)magnolia(ctx,145,1300,.8,p.accent);}
    ctx.restore();
  }
  function renderCard(canvas,draft,mode,template,logo) {
    const print=mode==='print', w=print?1748:1080,h=print?1240:1440;
    canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:false});
    const p=PALETTES[template.theme]||PALETTES[THEME_ALIASES[template.theme]]||PALETTES.champagne;
    paper(ctx,w,h,p,print);
    const brandX=print?118:92,brandY=print?118:100;
    if(logo){const boxW=300,boxH=92,ratio=Math.min(boxW/logo.width,boxH/logo.height);ctx.drawImage(logo,brandX,brandY,logo.width*ratio,logo.height*ratio);}
    else{font(ctx,31,600,SERIF);ctx.fillStyle=p.accent;ctx.textBaseline='top';ctx.fillText('LANDZ  丽兹行',brandX,brandY);}
    font(ctx,print?16:15,400,'Georgia,serif');ctx.textBaseline='top';ctx.fillStyle=p.muted;ctx.fillText('WITH APPRECIATION',brandX,print?257:237);
    ctx.textAlign='right';font(ctx,print?18:16,400,'Georgia,serif');ctx.fillText('SHANGHAI',w-(print?118:92),print?125:105);ctx.fillText('NOVEMBER 2026',w-(print?118:92),print?154:132);ctx.textAlign='left';
    const titleX=print?118:92,titleY=print?362:314,titleWidth=print?420:875,titleH=print?212:143;
    const titleText=print?String(template.title).replace(/[，,]/,'，\n'):template.title;
    const titleFit=fitText(ctx,titleText,titleWidth,titleH,print?64:58,print?37:36,500,1.35,SERIF);font(ctx,titleFit.size,500,SERIF);drawLines(ctx,titleFit,titleX,titleY,p.ink);
    const subFit=fitText(ctx,template.subtitle||'以专业与诚意，回应每一份信任',titleWidth,print?105:61,print?24:23,18,400,1.5);font(ctx,subFit.size,400);drawLines(ctx,subFit,titleX,print?642:478,p.muted);
    ctx.strokeStyle='#b99966';ctx.lineWidth=2;line(ctx,titleX,print?789:555,titleX+(print?80:66),print?789:555);
    if(print){font(ctx,17,400,'Georgia,serif');ctx.fillStyle=p.muted;ctx.fillText('A NOTE OF THANKS',titleX,828);}
    const x=print?673:92,width=print?930:896,recipientY=print?252:594,bodyY=print?354:671,bodyH=print?416:406;
    const recipient=clean(draft.recipient).trim();const salutation=recipient?(/^(致|亲爱的)/.test(recipient)?recipient:'致 '+recipient):'致 您';
    const recipientFit=fitText(ctx,salutation,width,print?64:58,print?36:33,22,500,1.25,SERIF);font(ctx,recipientFit.size,500,SERIF);drawLines(ctx,recipientFit,x,recipientY,p.ink);
    const body=clean(draft.body).trim();const bodyFit=fitText(ctx,body,width,bodyH,print?38:34,print?25:23,400,1.78);
    if(bodyFit.fits){font(ctx,bodyFit.size,400);drawLines(ctx,bodyFit,x,bodyY,p.ink);}
    else{font(ctx,print?31:27,400);ctx.fillStyle=p.accent;ctx.fillText('正文较长，请精简后再导出。',x,bodyY+25);font(ctx,print?24:21,400);ctx.fillStyle=p.muted;ctx.fillText('完整内容已保留在输入框中。',x,bodyY+82);}
    const signature=clean(draft.signature).trim()||'丽兹行';const signatureWidth=print?900:540;
    const signatureFit=fitText(ctx,signature,signatureWidth,print?115:100,print?29:27,20,400,1.6);ctx.textAlign='right';font(ctx,signatureFit.size,400);drawLines(ctx,signatureFit,x+width,print?884:1130,p.accent);ctx.textAlign='left';
    const footer=template.footer||'感恩相连 · 服务有光';const footerX=print?673:92,footerY=print?1116:1361,footerWidth=print?930:896;
    ctx.strokeStyle=p.line;ctx.lineWidth=1;line(ctx,footerX,footerY-22,footerX+footerWidth,footerY-22);font(ctx,print?18:17,400);ctx.fillStyle=p.muted;ctx.fillText(footer,footerX,footerY);
    ctx.textAlign='right';font(ctx,print?17:15,400,'Georgia,serif');ctx.fillText('LANDZ · WITH GRATITUDE',footerX+footerWidth,footerY);ctx.textAlign='left';
    const problems=[];if(!body)problems.push('请填写想对顾客说的话');if(!bodyFit.fits)problems.push('正文超出版面，请减少字数或空行');if(!recipientFit.fits)problems.push('称呼较长，请精简后导出');if(!signatureFit.fits)problems.push('署名较长，请减少字数或换行');if(!titleFit.fits)problems.push('模板标题超出版面');if(!subFit.fits)problems.push('模板副标题超出版面');
    return {ok:!problems.length,problems,bodyFontSize:bodyFit.size,width:w,height:h,theme:template.theme};
  }
  function mountCardMaker(target,options) {
    options=options||{};
    const container=typeof target==='string'?document.querySelector(target):target;
    if(!container)throw new Error('贺卡组件缺少挂载容器');
    if(container.__gratitudeCardMaker)container.__gratitudeCardMaker.destroy();
    if(!document.getElementById('gratitude-card-maker-styles')){const style=document.createElement('style');style.id='gratitude-card-maker-styles';style.textContent=STYLE;document.head.append(style);}
    const cards=normalizeCards(options.cards), uid='gcm-'+Math.random().toString(36).slice(2,10), storageKey=options.draftKey||'landz-gratitude-card-2026-11';
    const defaultDraft=mode=>({templateId:cards[mode][0].id,recipient:'王先生',body:cards[mode][0].body,signature:'您的丽兹行顾问'});
    let state={mode:'online',drafts:{online:defaultDraft('online'),print:defaultDraft('print')}};
    if(options.persistDraft!==false){try{const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(saved&&saved.drafts){['online','print'].forEach(mode=>{if(saved.drafts[mode])state.drafts[mode]=Object.assign(defaultDraft(mode),saved.drafts[mode]);});if(saved.mode==='print')state.mode='print';}}catch(_) {}}
    let destroyed=false,renderCounter=0,animation=0,result={ok:false},busy=false;
    const logoPromise=loadLogo(options.logoDataUrl);
    const listeners=[];const urls=new Set();
    function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=text;return node;}
    function on(node,event,fn){node.addEventListener(event,fn);listeners.push(()=>node.removeEventListener(event,fn));}
    const root=el('section','gcm');root.setAttribute('aria-label','我的感恩贺卡定制');
    const head=el('div','gcm-head'), heading=el('div');heading.append(el('h3','','定制一封得体的感谢'),el('p','','五款商务贺卡，线上发送与线下面见各有专属版式。填写称呼、正文与署名，预览后即可下载；你的定制仅保存在本页。'));
    const tabs=el('div','gcm-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','贺卡使用方式');const modeButtons={};
    [['online','线上发送'],['print','线下面见']].forEach(([mode,label])=>{const b=el('button','gcm-tab',label);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-controls',uid+'-editor');modeButtons[mode]=b;on(b,'click',()=>{state.mode=mode;populate();save();schedule();});tabs.append(b);});
    head.append(heading,tabs);root.append(head);
    const grid=el('div','gcm-grid'),form=el('div','gcm-form');form.id=uid+'-editor';
    function field(label,node,id){const box=el('div','gcm-field'),l=el('label','',label);node.id=uid+'-'+id;l.htmlFor=node.id;box.append(l,node);form.append(box);return box;}
    const styleBlock=el('div','gcm-style-block'),styleTitle=el('span','gcm-style-title','01 选择贺卡设计'),styleGrid=el('div','gcm-style-grid'),styleHint=el('div','gcm-style-hint');styleGrid.setAttribute('role','radiogroup');styleGrid.setAttribute('aria-label','五款贺卡设计');styleBlock.append(styleTitle,styleGrid,styleHint);form.append(styleBlock);const templateSelect=el('select');const templateField=field('选择贺卡设计',templateSelect,'template');templateField.hidden=true;
    const recipientInput=el('input');recipientInput.type='text';recipientInput.autocomplete='off';recipientInput.placeholder='例如：王先生、李女士一家';field('称呼',recipientInput,'recipient');
    const bodyInput=el('textarea');bodyInput.rows=7;bodyInput.placeholder='写下一件真实的服务细节，再说出你的感谢与下一步关心。';const bodyField=field('想对顾客说的话',bodyInput,'body');
    const countRow=el('div','gcm-hint gcm-count'),countHint=el('span'),count=el('span');countRow.append(countHint,count);bodyField.append(countRow);
    const signatureInput=el('textarea','gcm-signature');signatureInput.rows=2;signatureInput.placeholder='例如：您的丽兹行顾问\n张晓';field('署名',signatureInput,'signature');
    const secondary=el('div','gcm-secondary-row'),reference=el('button','gcm-textbtn','使用这份模板的参考文案'),reset=el('button','gcm-textbtn','重置我的本页草稿');reference.type=reset.type='button';secondary.append(reference,reset);form.append(secondary);
    form.append(el('div','gcm-callout','填写建议：把真实的感谢与下一步服务写清楚，语气诚恳、表达得体。线上与线下分别保留草稿，其他伙伴的定制互不影响。'));
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
    function selectTemplate(id) {
      const d=currentDraft(),old=currentTemplate();d.templateId=id;
      if(d.body===old.body)d.body=currentTemplate().body;
      populate();save();schedule();
    }
    function populate(){
      const d=currentDraft();const selected=currentTemplate();d.templateId=selected.id;
      templateSelect.replaceChildren();styleGrid.replaceChildren();
      cards[state.mode].forEach((c,index)=>{
        const option=el('option','',c.label||THEME_NAMES[c.theme]);option.value=c.id;templateSelect.append(option);
        const choice=el('button','gcm-style-choice');choice.type='button';choice.setAttribute('role','radio');choice.setAttribute('aria-checked',String(c.id===d.templateId));choice.setAttribute('aria-label',(c.label||THEME_NAMES[c.theme])+'，'+(THEME_NOTES[c.theme]||''));choice.tabIndex=c.id===d.templateId?0:-1;
        const thumb=el('span','gcm-style-thumb');thumb.setAttribute('aria-hidden','true');thumb.style.cssText='--style-bg:'+PALETTES[c.theme].panel+';--style-accent:'+PALETTES[c.theme].accent;
        choice.append(thumb,el('span','gcm-style-name',THEME_NAMES[c.theme]||c.label));
        on(choice,'click',()=>selectTemplate(c.id));
        on(choice,'keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const n=cards[state.mode].length;const next=event.key==='Home'?0:event.key==='End'?n-1:(index+(event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1)+n)%n;selectTemplate(cards[state.mode][next].id);styleGrid.children[next].focus();});styleGrid.append(choice);
      });
      styleHint.textContent=THEME_NOTES[selected.theme]||'商务贺卡 · 专属定制';templateSelect.value=d.templateId;
      recipientInput.value=d.recipient;bodyInput.value=d.body;signatureInput.value=d.signature;
      ['online','print'].forEach(mode=>{modeButtons[mode].setAttribute('aria-selected',String(mode===state.mode));modeButtons[mode].tabIndex=mode===state.mode?0:-1;});
      preview.dataset.mode=state.mode;preview.dataset.theme=selected.theme;pdf.hidden=state.mode!=='print';png.textContent=state.mode==='print'?'下载高清图片':'下载电子贺卡';labelText.textContent=state.mode==='print'?'PRINT · A6商务横版':'DIGITAL · 专属电子贺卡';resolution.textContent=state.mode==='print'?'1748 × 1240 px':'1080 × 1440 px';
      printNote.textContent=state.mode==='print'?'成品尺寸148 × 105 mm（A6横版），约300 dpi。打印PDF请选择“实际大小 / 100%”，批量印刷前请先打样。':'适用于微信等线上渠道发送。图片只包含当前贺卡；微信中未弹出下载时，可选择“长按保存预览”。';countHint.textContent=state.mode==='print'?'建议正文140字以内，短笺更显从容':'建议正文220字以内，适合手机阅读';savePanel.hidden=true;
    }
    async function render(){const ticket=++renderCounter;const mode=state.mode;const draft=Object.assign({},currentDraft());const template=Object.assign({},currentTemplate());const logo=await logoPromise;if(destroyed||ticket!==renderCounter)return null;result=renderCard(canvas,draft,mode,template,logo);const n=characters(draft.body).length;count.textContent=n+'字';countRow.classList.toggle('gcm-long',n>(mode==='print'?140:220));png.disabled=pdf.disabled=mobileSave.disabled=busy||!result.ok;if(!result.ok)say(result.problems.join('；')+'。完整输入会为你保留。','error');else if(!busy)say(mode==='print'?'你的线下贺卡已就绪，可下载高清图片或A6打印PDF。':'电子贺卡已就绪，确认称呼与内容后即可下载。');return result;}
    function schedule(){if(animation)global.cancelAnimationFrame(animation);animation=global.requestAnimationFrame(()=>{animation=0;render().catch(()=>say('预览暂时未完成，请稍后重试。','error'));});}
    function updateDraft(){const d=currentDraft();d.recipient=recipientInput.value;d.body=bodyInput.value;d.signature=signatureInput.value;savePanel.hidden=true;save();schedule();}
    [recipientInput,bodyInput,signatureInput].forEach(input=>on(input,'input',updateDraft));
    on(templateSelect,'change',()=>selectTemplate(templateSelect.value));
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
  if(typeof module!=='undefined'&&module.exports)module.exports={buildPdf,wrapText,fitText,normalizeCards,characters,renderCard,PALETTES,THEMES};
})(typeof window!=='undefined'?window:globalThis);
