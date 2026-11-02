const base = Deno.env.get('SUPABASE_URL') || '';
const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const headers = {apikey: service, Authorization: 'Bearer ' + service, 'Content-Type': 'application/json'};
const cors = {
  'Access-Control-Allow-Origin': 'https://liya123156.github.io',
  'Access-Control-Allow-Headers': 'apikey, content-type, x-feedback-key, x-admin-session',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', Vary: 'Origin'
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: {...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store'}
});
const columns = 'id,category,author,message,created_at';
const view = (row: any) => ({id: row.id, category: row.category, author: row.author, message: row.message, createdAt: row.created_at});
const categories = new Set(['使用问题', '物料需求', '优化建议', '其他']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function readRows(query: string, count = false) {
  const response = await fetch(base + '/rest/v1/gratitude_feedback?' + query, {
    headers: {...headers, ...(count ? {Prefer: 'count=exact'} : {})}
  });
  if (!response.ok) throw new Error('storage');
  const rows = await response.json();
  return {rows, total: Number(response.headers.get('content-range')?.split('/')[1]) || 0};
}
async function ownerHash(req: Request) {
  const key = req.headers.get('X-Feedback-Key') || '';
  if (!/^[0-9a-f]{64}$/.test(key)) return null;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
async function isAdmin(req: Request) {
  const token = req.headers.get('X-Admin-Session') || '';
  if (!/^[0-9a-f]{64}$/.test(token)) return false;
  const response = await fetch(base + '/rest/v1/rpc/gratitude_admin_pin_session', {
    method: 'POST', headers, body: JSON.stringify({p_token: token, p_logout: false})
  });
  if (!response.ok) throw new Error('auth');
  return (await response.json()) === true;
}
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
  if (!base || !service) return reply({error: '反馈通道暂未接通，请稍后再试'}, 503);
  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/gratitude-feedback/, '') || '/';
  if (!['/', '/admin'].includes(path)) return reply({error: '接口不存在'}, 404);
  try {
    const rawOffset = url.searchParams.get('offset') || '0';
    if (!/^\d{1,5}$/.test(rawOffset) || Number(rawOffset) > 10000) return reply({error: '分页参数有误'}, 400);
    const offset = Number(rawOffset);
    if (path === '/admin') {
      if (req.method !== 'GET') return reply({error: '操作不支持'}, 405);
      if (!(await isAdmin(req))) return reply({error: '请先登录管理员账号'}, 401);
      const result = await readRows(`select=${columns}&order=created_at.desc,id.desc&offset=${offset}&limit=50`, true);
      return reply({feedbacks: result.rows.map(view), total: result.total, hasMore: offset + result.rows.length < result.total});
    }
    if (!['GET', 'POST'].includes(req.method)) return reply({error: '操作不支持'}, 405);
    const hash = await ownerHash(req);
    if (!hash) return reply({error: '个人留言身份无效，请刷新页面后再试'}, 401);
    if (req.method === 'GET') {
      const result = await readRows(`select=${columns}&owner_hash=eq.${hash}&order=created_at.desc,id.desc&offset=${offset}&limit=50`, true);
      return reply({feedbacks: result.rows.map(view), hasMore: offset + result.rows.length < result.total});
    }
    if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply({error: '提交格式有误'}, 415);
    if (Number(req.headers.get('content-length') || 0) > 24000) return reply({error: '留言内容过长'}, 413);
    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > 24000) return reply({error: '留言内容过长'}, 413);
    let body;
    try {body = JSON.parse(raw);} catch {return reply({error: '提交格式有误'}, 400);}
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({error: '提交格式有误'}, 400);
    const id = typeof body.id === 'string' ? body.id : '';
    const category = body.category;
    const author = typeof body.author === 'string' ? body.author.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!uuid.test(id) || !categories.has(category) || author.length > 80 || message.length < 5 || message.length > 2000) return reply({error: '请填写5—2000字的留言，并确认反馈类型与姓名长度'}, 400);
    const existing = await readRows(`select=${columns}&owner_hash=eq.${hash}&id=eq.${id}&limit=1`);
    if (existing.rows.length) return reply({ok: true, feedback: view(existing.rows[0])});
    const since = encodeURIComponent(new Date(Date.now() - 3600000).toISOString());
    const recent = await readRows(`select=id&owner_hash=eq.${hash}&created_at=gte.${since}&limit=1`, true);
    if (recent.total >= 20) return reply({error: '本小时留言较多，请稍后再补充'}, 429);
    const response = await fetch(base + '/rest/v1/gratitude_feedback?select=' + columns, {
      method: 'POST', headers: {...headers, Prefer: 'return=representation'},
      body: JSON.stringify({id, owner_hash: hash, category, author, message})
    });
    if (response.status === 409) return reply({error: '本次提交编号已使用，请刷新页面后重新提交'}, 409);
    if (!response.ok) throw new Error('storage');
    return reply({ok: true, feedback: view((await response.json())[0])}, 201);
  } catch {
    return reply({error: '留言暂未完成，请稍后重试；已填写的内容会保留在本页'}, 503);
  }
});
