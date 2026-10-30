// Runs only after Auth verifies the caller AND the owner enrolls that user.
// Service credentials stay in the Supabase Edge environment, never the client.
const MIME_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
const BUCKET = 'gratitude-materials';
const ALLOWED_ORIGIN = 'https://liya123156.github.io';
Deno.serve(async (req: Request) => {
  const cors = {'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin'};
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body),
    {status, headers: {...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store'}});
  if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors});
  if (req.method !== 'POST') return reply({error: 'Method not allowed'}, 405);
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return reply({error: '请先登录行动包管理员账号'}, 401);
  const base = Deno.env.get('SUPABASE_URL');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!base || !service) return reply({error: '管理服务配置未完成'}, 503);
  try {
    // Validate the JWT with Auth, then check owner-maintained membership.
    const who = await fetch(base + '/auth/v1/user', {headers: {apikey: service, Authorization: auth}});
    if (!who.ok) return reply({error: '管理员登录已失效，请重新登录'}, 401);
    const user = await who.json();
    if (!user?.id || !user.email_confirmed_at) return reply({error: '请先完成管理员邮箱验证'}, 403);
    const headers = {apikey: service, Authorization: 'Bearer ' + service, 'Content-Type': 'application/json'};
    const membership = await fetch(base + '/rest/v1/gratitude_admins?select=user_id&user_id=eq.' + encodeURIComponent(user.id), {headers});
    if (!membership.ok) return reply({error: '管理员资格暂时无法验证'}, 503);
    const members = await membership.json();
    if (!Array.isArray(members) || members.length !== 1) return reply({error: '该账号没有物料维护权限'}, 403);
    const endpoint = base + '/storage/v1/bucket/' + BUCKET;
    const existing = await fetch(endpoint, {headers});
    const config = {public: true, file_size_limit: 20971520, allowed_mime_types: MIME_TYPES};
    let response: Response;
    if (existing.ok) {
      response = await fetch(endpoint, {method: 'PUT', headers, body: JSON.stringify(config)});
    } else if (existing.status === 404 || existing.status === 400) {
      response = await fetch(base + '/storage/v1/bucket', {method: 'POST', headers,
        body: JSON.stringify({id: BUCKET, name: BUCKET, ...config})});
      if (!response.ok) {
        // A second simultaneous first upload may have created the same bucket.
        const check = await fetch(endpoint, {headers});
        if (check.ok) return reply({ok: true});
      }
    } else return reply({error: '共享文件区暂时无法连接'}, 503);
    if (!response.ok) return reply({error: '共享文件区初始化未完成，请稍后重试'}, 503);
    return reply({ok: true});
  } catch {
    return reply({error: '共享文件区暂时无法连接，请稍后重试'}, 503);
  }
});
