const BUCKET='gratitude-materials';
const MIME:Record<string,string>={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation'};
const base=Deno.env.get('SUPABASE_URL')||'';
const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const headers={apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'};
const cors={'Access-Control-Allow-Origin':'https://liya123156.github.io','Access-Control-Allow-Headers':'apikey, content-type, x-admin-session','Access-Control-Allow-Methods':'GET, POST, PATCH, OPTIONS',Vary:'Origin'};
const reply=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
async function rpc(name:string,body:unknown){const r=await fetch(base+'/rest/v1/rpc/'+name,{method:'POST',headers,body:JSON.stringify(body)});if(!r.ok)throw Error('管理服务暂时不可用');return r.json();}
function material(row:any){return {id:row.id,title:row.title,category:row.category,fileName:row.file_name,size:row.size,mime:row.mime,source:row.source,date:row.document_date,active:row.active,updatedAt:row.updated_at,url:base+'/storage/v1/object/public/'+BUCKET+'/'+row.storage_path+'?download='+encodeURIComponent(row.file_name)};}
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(!base||!service)return reply({error:'管理服务尚未接通'},503);
 const path=new URL(req.url).pathname.replace(/^.*\/gratitude-admin/,'')||'/';
 try{
  if(path==='/login'&&req.method==='POST'){
   const body=await req.json();const result=await rpc('gratitude_admin_pin_login',{p_password:typeof body.password==='string'?body.password:''});
   if(!result.configured)return reply({error:'管理员登录尚未配置'},503);
   if(result.locked)return reply({error:'尝试次数较多，请15分钟后再试'},429);
   if(!result.authenticated)return reply({error:'管理密码不正确'},401);
   return reply({ok:true,token:result.token,expiresAt:result.expiresAt});
  }
  const token=req.headers.get('X-Admin-Session')||'';
  if(path==='/logout'&&req.method==='POST'){await rpc('gratitude_admin_pin_session',{p_token:token,p_logout:true});return reply({ok:true});}
  const authenticated=await rpc('gratitude_admin_pin_session',{p_token:token,p_logout:false});
  if(path==='/session'&&req.method==='GET')return reply({authenticated,configured:true,provider:'pin'});
  if(!authenticated)return reply({error:'请先输入管理密码'},401);
  if(path==='/materials'&&req.method==='GET'){
   const r=await fetch(base+'/rest/v1/gratitude_materials?select=*&order=updated_at.desc',{headers});if(!r.ok)throw Error('资料暂时无法读取');
   return reply({materials:(await r.json()).map(material)});
  }
  if(path==='/materials'&&req.method==='POST'){
   const form=await req.formData(),file=form.get('file'),title=String(form.get('title')||'').trim(),category=String(form.get('category')||'other');
   if(!(file instanceof File)||file.size<=0||file.size>20971520)return reply({error:'请选择20MB以内的非空文件'},400);
   const ext=file.name.split('.').pop()?.toLowerCase()||'';
   if(!Object.hasOwn(MIME,ext)||file.name.length>255)return reply({error:'文件格式暂不支持，请选择PDF、图片或办公文件'},400);
   if(!title||title.length>80||!['hmall','market','other'].includes(category))return reply({error:'请完善资料标题与分类'},400);
   const id=crypto.randomUUID(),storagePath=id+'.'+ext,mime=MIME[ext];
   const uploaded=await fetch(base+'/storage/v1/object/'+BUCKET+'/'+storagePath,{method:'POST',headers:{...headers,'Content-Type':mime,'x-upsert':'false'},body:file});
   if(!uploaded.ok)throw Error('文件上传未完成，请稍后重试');
   const row={id,title,category,file_name:file.name,size:file.size,mime,storage_path:storagePath,source:String(form.get('source')||'项目组').slice(0,120),document_date:String(form.get('date')||new Date().toISOString().slice(0,10)),active:true};
   const saved=await fetch(base+'/rest/v1/gratitude_materials',{method:'POST',headers,body:JSON.stringify(row)});
   if(!saved.ok){await fetch(base+'/storage/v1/object/'+BUCKET,{method:'DELETE',headers,body:JSON.stringify({prefixes:[storagePath]})});throw Error('资料信息未保存，请检查日期后重试');}
   return reply({ok:true,material:material(row)},201);
  }
  const match=path.match(/^\/materials\/([0-9a-f-]{36})$/);
  if(match&&req.method==='PATCH'){
   const body=await req.json();const r=await fetch(base+'/rest/v1/gratitude_materials?id=eq.'+match[1],{method:'PATCH',headers,body:JSON.stringify({active:!!body.active,updated_at:new Date().toISOString()})});
   if(!r.ok)throw Error('资料状态未保存，请稍后重试');return reply({ok:true});
  }
  return reply({error:'接口不存在'},404);
 }catch{return reply({error:'管理服务暂时不可用，请稍后重试'},503);}
});
