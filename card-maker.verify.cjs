const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const cjkFont=process.env.GRATITUDE_QA_FONT || path.join(__dirname,'../../work/nov_campaign_v2/fonts/NotoSansCJKsc-Regular.otf');
if(fs.existsSync(cjkFont))GlobalFonts.registerFromPath(cjkFont,'Noto Sans CJK SC');
const sandbox={module:{exports:{}},Blob,TextEncoder,atob,Intl};
sandbox.globalThis=sandbox;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'card-maker.js'),'utf8'),sandbox);
const { buildPdf, wrapText, fitText, normalizeCards, characters, renderCard } = sandbox.module.exports;

function makePage() {
  class Element {
    constructor(tag) { this.tagName=tag;this.children=[];this.value='';this.dataset={};this.classList={toggle(){}};this.events={};this.style={};if(tag==='canvas')this.native=createCanvas(300,150); }
    append(...nodes){this.children.push(...nodes);}
    replaceChildren(...nodes){this.children=[...nodes];}
    setAttribute(key,value){this[key]=value;}
    addEventListener(key,fn){this.events[key]=fn;}
    removeEventListener(key){delete this.events[key];}
    remove(){}
    focus(){}
    scrollIntoView(){}
    click(){this.events.click?.({});}
    set width(value){this.native.width=value;}
    get width(){return this.native.width;}
    set height(value){this.native.height=value;}
    get height(){return this.native.height;}
    getContext(...args){return this.native.getContext(...args);}
    toDataURL(...args){return this.native.toDataURL(...args);}
  }
  const head=new Element('head'),body=new Element('body'),store=new Map();
  const document={head,body,createElement:tag=>new Element(tag),getElementById:id=>head.children.find(n=>n.id===id)||null};
  const page={document,sessionStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)},Blob,TextEncoder,atob,Intl,Math,setTimeout,requestAnimationFrame:fn=>setTimeout(fn,0),cancelAnimationFrame:clearTimeout};
  page.window=page;page.globalThis=page;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'card-maker.js'),'utf8'),page);
  return {page,container:new Element('div'),store};
}

async function main() {
  const out=path.join(__dirname,'card-maker-qa');fs.mkdirSync(out,{recursive:true});
  const cards=normalizeCards(null);
  assert.equal(cards.online.length,5);assert.equal(cards.print.length,5);
  assert.equal(characters('王先生🌷').length,4);
  const checks=[];
  for(const mode of ['online','print']) {
    for(const template of cards[mode]) {
      const canvas=createCanvas(1,1);
      const result=renderCard(canvas,{recipient:'王先生与家人',body:template.body,signature:'您的丽兹行顾问\n张晓'},mode,template,null);
      assert.equal(result.ok,true,template.id+': '+result.problems.join(','));
      assert.equal(canvas.width,mode==='print'?1748:1080);
      assert.equal(canvas.height,mode==='print'?1240:1440);
      const png=canvas.toBuffer('image/png');assert.ok(png.length>1000);
      fs.writeFileSync(path.join(out,template.id+'.png'),png);
      if(mode==='print') {
        const pdf=buildPdf(canvas.toDataURL('image/jpeg',.97),canvas.width,canvas.height);
        const bytes=Buffer.from(await pdf.arrayBuffer());
        assert.equal(bytes.subarray(0,8).toString(),'%PDF-1.4');
        assert.ok(bytes.includes(Buffer.from('/MediaBox [0 0 419.527559 297.637795]')));
        fs.writeFileSync(path.join(out,template.id+'.pdf'),bytes);
      }
      checks.push({template:template.id,mode,pngBytes:png.length,bodyFont:result.bodyFontSize});
    }
  }
  const canvas=createCanvas(1,1);
  let result=renderCard(canvas,{recipient:'王先生',body:'感谢您的信任。'.repeat(1000),signature:'张晓'},'online',cards.online[0],null);
  assert.equal(result.ok,false);assert.ok(result.problems.some(s=>s.includes('正文')));
  result=renderCard(canvas,{recipient:'王先生',body:'',signature:'张晓'},'print',cards.print[0],null);
  assert.equal(result.ok,false);assert.ok(result.problems.some(s=>s.includes('填写')));
  const ctx=canvas.getContext('2d');ctx.font='20px sans-serif';
  const raw='第一句。\n第二句，谢谢您的信任！';const lines=wrapText(ctx,raw,100);
  assert.equal(lines.join(''),raw.replaceAll('\n',''));
  assert.ok(lines.every(s=>!s||! /^[，。！？；：、）》」』】]/.test(s)));
  const fit=fitText(ctx,'感谢您的信任',200,100,24,20,400,1.5);assert.ok(fit.fits);
  const custom=normalizeCards({online:[{id:'my',title:'感谢',text:'在线文案'}],offline:[{id:'my-print',title:'谢谢',text:'线下文案'}]});
  assert.equal(custom.online[0].id,'my');assert.equal(custom.print[0].id,'my-print');
  const visitorA=makePage(),visitorB=makePage();
  const makerA=visitorA.page.mountCardMaker(visitorA.container,{}),makerB=visitorB.page.mountCardMaker(visitorB.container,{});
  await Promise.all([makerA.setDraft({recipient:'李先生',body:'李先生，感谢您给予我的信任。',signature:'顾问小王'},'online'),makerB.setDraft({recipient:'陈女士',body:'陈女士，期待持续为您提供细致的服务。',signature:'顾问小张'},'online')]);
  assert.equal(makerA.getDraft().drafts.online.recipient,'李先生');
  assert.equal(makerB.getDraft().drafts.online.recipient,'陈女士');
  await makerA.setDraft({body:'这是小王自己的后续修改。'},'online');
  assert.equal(makerB.getDraft().drafts.online.body,'陈女士，期待持续为您提供细致的服务。');
  assert.notEqual(visitorA.store.get('landz-gratitude-card-2026-11'),visitorB.store.get('landz-gratitude-card-2026-11'));
  makerA.destroy();makerB.destroy();
  fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({passed:true,checks,checksCovered:['十套模板中文排版','两种导出尺寸','五份真实A6 PDF','超长文案阻止导出而保留输入','空正文校验','中文标点换行','第三方内容结构适配','两个独立页面同时修改互不影响']},null,2));
  process.stdout.write(JSON.stringify({passed:true,output:out,templates:checks.length})+'\n');
}
main().catch(error=>{process.stderr.write(error.stack+'\n');process.exitCode=1;});
