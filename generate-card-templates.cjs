const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {createCanvas,GlobalFonts,loadImage}=require('@napi-rs/canvas');
async function main(){
  const font=process.env.GRATITUDE_QA_FONT||path.resolve(__dirname,'../../work/nov_campaign_v2/fonts/NotoSansCJKsc-Regular.otf');
  assert.ok(fs.existsSync(font),'中文字体缺失');GlobalFonts.registerFromPath(font,'Noto Sans CJK SC');
  const sandbox={module:{exports:{}},Blob,TextEncoder,atob,Intl};sandbox.globalThis=sandbox;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'card-maker.js'),'utf8'),sandbox);
  const {renderCard,normalizeCards,buildPdf}=sandbox.module.exports;
  const data=JSON.parse(fs.readFileSync(path.join(__dirname,'content.json'),'utf8'));
  const cards=normalizeCards(data.action.cards);
  assert.equal(cards.online.length,5);assert.equal(cards.print.length,5);
  const assetSandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'assets.js'),'utf8'),assetSandbox);
  const logo=await loadImage(assetSandbox.window.GRATITUDE_ASSETS.logoDataUrl);
  const directory=path.join(__dirname,'templates');fs.mkdirSync(directory,{recursive:true});
  const manifest={title:'丽兹行感恩连接行动包｜五款商务贺卡',version:'2026-11-v2',updatedAt:'2026-10-30',logoSource:'用户提供的原始LANDZ标识，保持原样缩放呈现。',notes:['五款设计均提供线上电子版与A6横版，称呼、正文和署名可自行定制。','以下为排版样张；下载使用前请在贺卡工具中填写真实内容。','线上PNG适合线上渠道发送；线下PNG及PDF为148×105mm（A6横版），打印选择实际大小100%。','批量印刷前请先打样确认纸张与效果。'],items:[]};
  const previews=[];
  for(const mode of ['online','print'])for(const card of cards[mode]){
    const canvas=createCanvas(1,1),draft={recipient:'王先生',body:card.body,signature:'您的丽兹行顾问'};
    const result=renderCard(canvas,draft,mode,card,logo);assert.ok(result.ok,card.id+': '+result.problems.join('；'));
    const pngName=card.id+'.png';fs.writeFileSync(path.join(directory,pngName),canvas.toBuffer('image/png'));
    const files={png:'templates/'+pngName};
    if(mode==='print'){const pdfName=card.id+'.pdf';const pdf=buildPdf(canvas.toDataURL('image/jpeg',.97),canvas.width,canvas.height);fs.writeFileSync(path.join(directory,pdfName),Buffer.from(await pdf.arrayBuffer()));files.pdf='templates/'+pdfName;}
    manifest.items.push({id:card.id,title:card.label,heading:card.title,theme:card.theme,channel:mode==='print'?'offline':'online',dimensions:mode==='print'?'1748×1240px；148×105mm（A6横版）':'1080×1440px',files,previewNote:'样张展示通用称呼与参考内容；请在定制工具中修改后使用。',bodyFontSize:result.bodyFontSize});
    previews.push({canvas,label:(mode==='print'?'线下 · ':'线上 · ')+card.label,mode});
  }
  fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify(manifest,null,2));
  const qa=path.resolve(__dirname,'../qa/card');fs.mkdirSync(qa,{recursive:true});
  for(const mode of ['online','print']){
    const list=previews.filter(x=>x.mode===mode),cellW=432,cellH=mode==='online'?635:365;
    const sheet=createCanvas(cellW*5,cellH),ctx=sheet.getContext('2d');ctx.fillStyle='#fff7eb';ctx.fillRect(0,0,sheet.width,sheet.height);ctx.font='20px "Noto Sans CJK SC"';ctx.textBaseline='top';
    list.forEach((item,i)=>{const x=i*cellW;ctx.fillStyle='#775641';ctx.fillText(item.label,x+18,16);const width=mode==='online'?410:414,height=width*item.canvas.height/item.canvas.width;ctx.drawImage(item.canvas,x+(cellW-width)/2,54,width,height);});
    fs.writeFileSync(path.join(qa,mode+'-five-designs.png'),sheet.toBuffer('image/png'));
  }
  process.stdout.write(JSON.stringify({passed:true,directory,templates:manifest.items.length,generatedFiles:15,contactSheets:[path.join(qa,'online-five-designs.png'),path.join(qa,'print-five-designs.png')]})+'\n');
}
main().catch(e=>{process.stderr.write(e.stack+'\n');process.exitCode=1;});
