'use strict';
(() => {
  let instanceNumber = 0;
  const MAX_BYTES = 20 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp']);

  function shanghaiDate() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const get = type => parts.find(part => part.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  window.mountHmallUpload = function mountHmallUpload(root, options = {}) {
    if (!root) return null;
    if (root.__hmallUploadController) return root.__hmallUploadController;
    const prefix = `hmall-inline-${++instanceNumber}`;
    let authenticated = false;
    let expanded = false;
    let busy = false;
    let sessionProbe = null;

    root.classList.add('hmall-uploader');
    root.innerHTML = `
      <button type="button" class="hmall-upload-toggle" aria-expanded="false" aria-controls="${prefix}-panel">项目组上传</button>
      <section id="${prefix}-panel" class="hmall-upload-panel" aria-label="hmall图项目组上传" hidden>
        <div class="hmall-upload-heading"><h4>上传hmall图</h4><button type="button" class="hmall-upload-close">收起</button></div>
        <p class="hmall-upload-status" role="status" aria-live="polite"></p>
        <form class="hmall-login-form">
          <p class="hmall-upload-note">仅供项目组管理员使用，登录后可在这里选择本地文件上传</p>
          <label for="${prefix}-password">管理密码</label>
          <input id="${prefix}-password" name="password" type="password" autocomplete="current-password" required>
          <div class="hmall-upload-actions"><button class="btn primary" type="submit">登录并上传</button></div>
        </form>
        <form class="hmall-upload-form" hidden>
          <input type="hidden" name="category" value="hmall">
          <input type="hidden" name="source" value="项目组">
          <label for="${prefix}-title">资料标题</label>
          <input id="${prefix}-title" name="title" type="text" maxlength="80" required>
          <label for="${prefix}-date">资料日期</label>
          <input id="${prefix}-date" name="date" type="date" required>
          <label for="${prefix}-file">选择本地文件</label>
          <input id="${prefix}-file" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp" required>
          <p class="hmall-upload-note">支持PDF和图片，单个文件不超过20MB<br>新版本发布后，伙伴将在这里下载最新hmall图</p>
          <div class="hmall-upload-actions"><button class="btn primary" type="submit">上传并发布</button><button class="hmall-upload-logout" type="button">退出管理</button></div>
        </form>
      </section>`;

    const toggle = root.querySelector('.hmall-upload-toggle');
    const panel = root.querySelector('.hmall-upload-panel');
    const loginForm = root.querySelector('.hmall-login-form');
    const uploadForm = root.querySelector('.hmall-upload-form');
    const status = root.querySelector('.hmall-upload-status');
    const password = loginForm.elements.namedItem('password');
    const title = uploadForm.elements.namedItem('title');
    const date = uploadForm.elements.namedItem('date');
    const fileInput = uploadForm.elements.namedItem('file');

    function setDefaults() {
      const today = shanghaiDate();
      title.value = `${Number(today.slice(5, 7))}月hmall图`;
      date.value = today;
    }
    function message(text = '', state = '') {
      status.textContent = text;
      status.dataset.state = state;
    }
    function paint() {
      panel.hidden = !expanded;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = authenticated ? '上传hmall图' : '项目组上传';
      loginForm.hidden = authenticated;
      uploadForm.hidden = !authenticated;
    }
    function setBusy(value) {
      busy = value;
      root.setAttribute('aria-busy', String(value));
      root.querySelectorAll('button,input').forEach(element => { element.disabled = value; });
    }
    function close() {
      if (busy) return;
      expanded = false;
      password.value = '';
      paint();
      toggle.focus({preventScroll: true});
    }
    async function api(url, request) {
      let response;
      try { response = await fetch(url, request); }
      catch { throw new Error('上传入口暂时无法连接，请稍后重试'); }
      let result;
      try { result = await response.json(); }
      catch { result = {}; }
      if (!response.ok) {
        if (response.status === 401) {
          authenticated = false;
          paint();
        }
        const error = new Error(result.error || (response.status === 401 ? '请重新输入管理密码后继续' : '操作暂未完成，请稍后重试'));
        error.status = response.status;
        throw error;
      }
      return result;
    }
    async function refreshSession() {
      if (!sessionProbe) {
        sessionProbe = api('/api/admin/session').then(result => {
          authenticated = result.authenticated === true;
          paint();
          return result;
        }).finally(() => { sessionProbe = null; });
      }
      return sessionProbe;
    }

    toggle.addEventListener('click', async () => {
      if (busy) return;
      if (expanded) { close(); return; }
      expanded = true;
      message();
      paint();
      setBusy(true);
      try {
        const result = await refreshSession();
        if (result.configured === false) message('上传入口暂时无法连接，请稍后重试', 'error');
      } catch (error) {
        message(error.message, 'error');
      } finally {
        setBusy(false);
        (authenticated ? fileInput : password).focus({preventScroll: true});
      }
    });
    root.querySelector('.hmall-upload-close').addEventListener('click', close);

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      if (!password.value) { message('请输入管理密码', 'error'); password.focus(); return; }
      const requestBody = JSON.stringify({password: password.value});
      setBusy(true);
      message('正在验证管理身份…');
      try {
        await api('/api/admin/login', {method: 'POST', headers: {'content-type': 'application/json'}, body: requestBody});
        const result = await refreshSession();
        if (!result.authenticated) throw new Error('登录尚未完成，请重新输入管理密码');
        message('已进入管理，可选择本地hmall文件上传');
      } catch (error) {
        authenticated = false;
        paint();
        message(error.message, 'error');
      } finally {
        password.value = '';
        setBusy(false);
        (authenticated ? fileInput : password).focus({preventScroll: true});
      }
    });

    uploadForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      const file = fileInput.files?.[0];
      const extension = String(file?.name || '').split('.').pop().toLowerCase();
      if (!file || file.size <= 0) { message('请选择需要上传的非空文件', 'error'); fileInput.focus(); return; }
      if (file.size > MAX_BYTES) { message('文件超过20MB，请选择20MB以内的版本', 'error'); return; }
      if (!ALLOWED_EXTENSIONS.has(extension)) { message('请选择PDF、PNG、JPG或WebP文件', 'error'); return; }
      const materialTitle = title.value.trim();
      if (!materialTitle) { message('请填写资料标题', 'error'); title.focus(); return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value)) { message('请选择资料日期', 'error'); date.focus(); return; }
      const body = new FormData();
      body.set('category', 'hmall');
      body.set('source', '项目组');
      body.set('title', materialTitle);
      body.set('date', date.value);
      body.set('file', file);
      setBusy(true);
      message('正在上传，请保持页面打开…');
      try {
        await api('/api/admin/materials', {method: 'POST', body});
        uploadForm.reset();
        setDefaults();
        try {
          if (typeof options.onPublished === 'function') await options.onPublished();
          message('上传成功，伙伴现在可以在本卡片下载最新hmall图', 'success');
        } catch {
          message('文件已上传，请刷新页面查看最新hmall图', 'success');
        }
      } catch (error) {
        message(error.message, 'error');
      } finally {
        setBusy(false);
      }
    });

    root.querySelector('.hmall-upload-logout').addEventListener('click', async () => {
      if (busy) return;
      setBusy(true);
      try {
        await api('/api/admin/logout', {method: 'POST'});
        authenticated = false;
        uploadForm.reset();
        setDefaults();
        message('已退出管理');
        paint();
      } catch (error) {
        message(error.message, 'error');
      } finally {
        setBusy(false);
      }
    });

    setDefaults();
    paint();
    refreshSession().catch(() => {});
    const controller = {refreshSession, close};
    root.__hmallUploadController = controller;
    return controller;
  };
})();
