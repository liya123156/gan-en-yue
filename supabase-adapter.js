'use strict';
(() => {
 const cfg=window.GRATITUDE_BACKEND;
 if(!cfg||cfg.provider!=='supabase'||!cfg.publishableKey)return;
 const origin=String(cfg.url).replace(/\/$/,''), bucket=cfg.bucket||'gratitude-materials',nativeFetch=window.fetch.bind(window);
 const SESSION_KEY='landz-gratitude-admin-session';
 let session;try{session=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');}catch{session=null;}
 const result=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
 const authHeaders=()=>({'apikey':cfg.publishableKey,...(session?.access_token?{Authorization:'Bearer '+session.access_token}:{})});
 const saveSession=value=>{session=value;try{value?sessionStorage.setItem(SESSION_KEY,JSON.stringify(value)):sessionStorage.removeItem(SESSION_KEY);}catch{}};
 async function supa(route,options={}){const response=await nativeFetch(origin+route,{...options,headers:{...authHeaders(),...(options.headers||{})}});const raw=await response.text();let value;try{value=raw?JSON.parse(raw):null;}catch{value={message:raw};}if(!response.ok)throw Object.assign(Error(value?.msg||value?.message||value?.error_description||value?.error||'操作未完成'),{status:response.status});return value;}
 async function refresh(){if(!session?.refresh_token)return;if((session.expires_at||0)*1000>Date.now()+60000)return;try{const next=await supa('/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});saveSession(next);}catch{saveSession(null);}}
 async function admin(){if(!session)return false;await refresh();if(!session)return false;const rows=await supa('/rest/v1/gratitude_admins?select=user_id&limit=1');return Array.isArray(rows)&&rows.length===1;}
 const material=row=>({id:row.id,title:row.title,category:row.category,fileName:row.file_name,size:row.size,mime:row.mime,source:row.source,date:row.document_date,updatedAt:row.updated_at,active:row.active,url:origin+'/storage/v1/object/public/'+encodeURIComponent(bucket)+'/'+row.storage_path.split('/').map(encodeURIComponent).join('/')});
 window.fetch=async(input,options={})=>{
  const raw=typeof input==='string'?input:input.url, u=new URL(raw,location.href);
  if(u.origin!==location.origin||!u.pathname.startsWith('/api/'))return nativeFetch(input,options);
  const p=u.pathname,method=(options.method||'GET').toUpperCase();
  try{
   if(p==='/api/materials')return result({materials:(await supa('/rest/v1/gratitude_materials?select=*&active=eq.true&order=updated_at.desc')).map(material)});
   if(p==='/api/admin/session')return result({authenticated:await admin(),configured:true,provider:'supabase'});
   if(p==='/api/admin/login'&&method==='POST'){
    const body=JSON.parse(options.body||'{}');if(!body.email)return result({error:'请填写管理员邮箱'},400);
    const next=await supa('/auth/v1/token?grant_type=password',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:body.email,password:body.password})});saveSession(next);
    if(!await admin()){saveSession(null);return result({error:'这个账号尚未被设置为行动包管理员。'},403);}return result({ok:true});
   }
   if(p==='/api/admin/logout'){if(session)await supa('/auth/v1/logout',{method:'POST'}).catch(()=>{});saveSession(null);return result({ok:true});}
   if(!await admin())return result({error:'请先登录管理员账号'},401);
   if(p==='/api/admin/materials'&&method==='GET')return result({materials:(await supa('/rest/v1/gratitude_materials?select=*&order=updated_at.desc')).map(material)});
   if(p==='/api/admin/materials'&&method==='POST'){
    const form=options.body,file=form.get('file'), category=String(form.get('category')||'other'),title=String(form.get('title')||'').trim();
    const ext=(file?.name||'').match(/\.[^.]+$/)?.[0].toLowerCase();if(!file||!['.png','.jpg','.jpeg','.webp','.pdf','.xlsx','.docx','.pptx'].includes(ext)||file.size>20*1024*1024)return result({error:'请选择20MB以内的图片、PDF或办公文件。'},400);
    if(!title||title.length>80||!['hmall','market','other'].includes(category))return result({error:'请完善标题与分类'},400);
    const id=crypto.randomUUID(),storagePath=id+ext;
    await supa('/storage/v1/object/'+encodeURIComponent(bucket)+'/'+storagePath,{method:'POST',headers:{'content-type':file.type||'application/octet-stream','x-upsert':'false'},body:file});
    const row={id,title,category,file_name:file.name,size:file.size,mime:file.type||'application/octet-stream',storage_path:storagePath,source:String(form.get('source')||'').slice(0,120),document_date:String(form.get('date')||new Date().toISOString().slice(0,10)),active:true};
    try{await supa('/rest/v1/gratitude_materials',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(row)});}catch(e){await supa('/storage/v1/object/'+encodeURIComponent(bucket),{method:'DELETE',headers:{'content-type':'application/json'},body:JSON.stringify({prefixes:[storagePath]})}).catch(()=>{});throw e;}
    return result({ok:true,material:material(row)},201);
   }
   const match=p.match(/^\/api\/admin\/materials\/([a-z0-9-]+)$/);
   if(match&&method==='PATCH'){const body=JSON.parse(options.body||'{}');await supa('/rest/v1/gratitude_materials?id=eq.'+encodeURIComponent(match[1]),{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({active:!!body.active,updated_at:new Date().toISOString()})});return result({ok:true});}
   return result({error:'接口不存在'},404);
  }catch(e){return result({error:e.message},e.status||500);}
 };
 window.GRATITUDE_SUPABASE_ENABLED=true;
})();
