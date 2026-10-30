'use strict';
(() => {
 const cfg=window.GRATITUDE_BACKEND;
 if(!cfg||cfg.provider!=='supabase'||!cfg.publishableKey)return;
 const origin=String(cfg.url).replace(/\/$/,''),bucket=cfg.bucket||'gratitude-materials',nativeFetch=window.fetch.bind(window);
 const SESSION_KEY='landz-gratitude-pin-session';
 let session=null;
 try{sessionStorage.removeItem('landz-gratitude-admin-session');session=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');}catch{}
 const result=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
 const saveSession=value=>{session=value?{token:value.token,expiresAt:value.expiresAt}:null;try{session?sessionStorage.setItem(SESSION_KEY,JSON.stringify(session)):sessionStorage.removeItem(SESSION_KEY);}catch{}};
 const material=row=>({id:row.id,title:row.title,category:row.category,fileName:row.file_name,size:row.size,mime:row.mime,source:row.source||'项目组',date:row.document_date,updatedAt:row.updated_at,active:row.active,url:origin+'/storage/v1/object/public/'+encodeURIComponent(bucket)+'/'+row.storage_path.split('/').map(encodeURIComponent).join('/')+'?download='+encodeURIComponent(row.file_name)});
 async function read(response){const raw=await response.text();try{return raw?JSON.parse(raw):{};}catch{return {error:'管理服务暂时无法连接，请稍后重试。'};}}
 window.fetch=async(input,options={})=>{
  const raw=typeof input==='string'?input:input.url,u=new URL(raw,location.href);
  if(u.origin!==location.origin||!u.pathname.startsWith('/api/'))return nativeFetch(input,options);
  const p=u.pathname,method=(options.method||'GET').toUpperCase();
  try{
   if(p==='/api/materials'&&method==='GET'){
    const response=await nativeFetch(origin+'/rest/v1/gratitude_materials?select=*&active=eq.true&order=updated_at.desc',{headers:{apikey:cfg.publishableKey}});
    const body=await read(response);if(!response.ok)return result({error:body.message||body.error||'资料暂时无法读取'},response.status);
    return result({materials:Array.isArray(body)?body.map(material):[]});
   }
   if(!p.startsWith('/api/admin/'))return result({error:'接口不存在'},404);
   const route=p.slice('/api/admin'.length);
   const allowed=(route==='/session'&&method==='GET')||(route==='/login'&&method==='POST')||(route==='/logout'&&method==='POST')||(route==='/materials'&&['GET','POST'].includes(method))||(/^\/materials\/[0-9a-f-]{36}$/.test(route)&&method==='PATCH');
   if(!allowed)return result({error:'接口不存在'},404);
   if(route==='/materials'&&method==='POST'){
    const file=options.body?.get?.('file');if(!file||file.size<=0||file.size>20*1024*1024)return result({error:'请选择20MB以内的非空文件'},400);
    if(!String(options.body.get('source')||'').trim())options.body.set('source','项目组');
   }
   const response=await nativeFetch(origin+'/functions/v1/gratitude-admin'+route,{...options,method,headers:{apikey:cfg.publishableKey,...(session?.token?{'X-Admin-Session':session.token}:{}),...(options.headers||{})}});
   const body=await read(response);
   if(response.status===401)saveSession(null);
   if(route==='/login'&&response.ok){if(typeof body.token!=='string'||!body.token)return result({error:'登录尚未完成，请稍后重试。'},503);saveSession(body);return result({ok:true});}
   if(route==='/session'&&response.ok&&!body.authenticated)saveSession(null);
   if(route==='/logout')saveSession(null);
   return result(body,response.status);
  }catch{if(p==='/api/admin/logout')saveSession(null);return result({error:'管理服务暂时无法连接，请稍后重试。'},503);}
 };
 window.GRATITUDE_SUPABASE_ENABLED=true;
})();
