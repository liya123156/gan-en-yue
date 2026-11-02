'use strict';
(() => {
  let instanceNumber = 0;
  const CATEGORIES = ['使用问题', '物料需求', '优化建议', '其他'];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function recordId() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  function displayDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    }).format(date);
  }
  async function api(url, options = {}) {
    let response;
    try {
      response = await fetch(url, {cache: 'no-store', ...options, headers: {Accept: 'application/json', ...(options.headers || {})}});
    } catch {
      throw new Error('留言服务暂时无法连接，请稍后重试');
    }
    let result;
    try { result = await response.json(); } catch { result = {}; }
    if (!response.ok) {
      const error = new Error(result.error || (response.status === 401 ? '请先登录管理员账号，再查看留言' : '留言暂未读取，请稍后重试'));
      error.status = response.status;
      throw error;
    }
    return result;
  }
  function feedbackCard(item, isAdmin) {
    const card = element('article', 'pf-message');
    const meta = element('div', 'pf-message-meta');
    meta.append(element('span', 'pf-category', item.category || '其他'));
    const time = element('time', 'pf-message-time', displayDate(item.createdAt));
    if (item.createdAt) time.dateTime = String(item.createdAt);
    meta.append(time);
    card.append(meta);
    if (item.author) card.append(element('p', 'pf-message-author', item.author));
    else if (isAdmin) card.append(element('p', 'pf-message-author pf-muted', '未填写门店与姓名'));
    card.append(element('p', 'pf-message-body', item.message || ''));
    return card;
  }

  function mount(root, isAdmin) {
    if (!root) return null;
    if (root.__privateFeedbackController) return root.__privateFeedbackController;
    const prefix = `private-feedback-${++instanceNumber}`;
    const endpoint = isAdmin ? '/api/admin/feedback' : '/api/feedback';
    let busy = false;
    let loadedCount = 0;
    let hasMore = false;
    let loadGeneration = 0;
    let pendingId = null;
    let pendingPayload = '';
    let form, category, author, message, counter, submit;
    root.classList.add('private-feedback');
    if (isAdmin) root.classList.add('pf-admin');
    root.replaceChildren();

    const topStatus = element('p', 'pf-status');
    topStatus.setAttribute('role', 'status');
    topStatus.setAttribute('aria-live', 'polite');

    if (!isAdmin) {
      const intro = element('div', 'pf-intro');
      intro.append(element('h3', '', '给项目组留言'));
      intro.append(element('p', '', '使用中遇到问题，或希望补充哪些物料？欢迎告诉项目组，我们一起把这份支持做得更好'));
      intro.append(element('p', 'pf-privacy', '留言仅您本人和管理员可见；本人留言可在当前设备及浏览器查看'));
      root.append(intro);

      form = element('form', 'pf-form');
      const fields = element('div', 'pf-fields');
      const categoryField = element('div', 'pf-field');
      const categoryLabel = element('label', '', '反馈类型');
      categoryLabel.htmlFor = `${prefix}-category`;
      category = element('select');
      category.id = `${prefix}-category`;
      category.name = 'category';
      for (const name of CATEGORIES) {
        const option = element('option', '', name);
        option.value = name;
        category.append(option);
      }
      categoryField.append(categoryLabel, category);
      const authorField = element('div', 'pf-field');
      const authorLabel = element('label', '', '门店与姓名（选填）');
      authorLabel.htmlFor = `${prefix}-author`;
      author = element('input');
      author.id = `${prefix}-author`;
      author.name = 'author';
      author.type = 'text';
      author.maxLength = 80;
      author.autocomplete = 'off';
      author.placeholder = '方便项目组了解您的使用场景';
      authorField.append(authorLabel, author);
      fields.append(categoryField, authorField);

      const messageField = element('div', 'pf-field');
      const messageLabel = element('label', '', '您的反馈与建议');
      messageLabel.htmlFor = `${prefix}-message`;
      message = element('textarea');
      message.id = `${prefix}-message`;
      message.name = 'message';
      message.required = true;
      message.minLength = 5;
      message.maxLength = 2000;
      message.rows = 5;
      message.placeholder = '例如：希望增加哪类顾客场景的感谢文案，或哪一步操作需要优化';
      const hint = element('div', 'pf-input-hint');
      const lengthNote = element('span', '', '请写下具体情况，5—2000字');
      counter = element('span', '', '0 / 2000');
      counter.id = `${prefix}-count`;
      message.setAttribute('aria-describedby', counter.id);
      hint.append(lengthNote, counter);
      messageField.append(messageLabel, message, hint);

      const actions = element('div', 'pf-actions');
      submit = element('button', 'btn primary', '提交留言');
      submit.type = 'submit';
      actions.append(submit);
      form.append(fields, messageField, actions, topStatus);
      root.append(form);
      root.append(element('p', 'pf-storage-note', '清除网站数据或更换设备后，将无法查看原留言'));
      message.addEventListener('input', () => { counter.textContent = `${message.value.length} / 2000`; });
    }

    const history = element('section', 'pf-history');
    history.setAttribute('aria-label', isAdmin ? '伙伴反馈与建议' : '我的留言');
    const historyHead = element('div', 'pf-history-head');
    const historyTitle = element('h3', '', isAdmin ? '伙伴反馈与建议' : '我的留言');
    const refresh = element('button', 'pf-text-button', '刷新留言');
    refresh.type = 'button';
    historyHead.append(historyTitle, refresh);
    history.append(historyHead);
    if (isAdmin) {
      history.append(element('p', 'pf-admin-note', '仅管理员可查看全部留言，用于跟进使用问题和补充行动支持'));
      history.append(topStatus);
    }
    const historyStatus = element('p', 'pf-history-status');
    historyStatus.setAttribute('role', 'status');
    historyStatus.setAttribute('aria-live', 'polite');
    const list = element('div', 'pf-message-list');
    const more = element('button', 'btn pf-more', '查看更多留言');
    more.type = 'button';
    more.hidden = true;
    history.append(historyStatus, list, more);
    root.append(history);

    function status(text = '', state = '') {
      topStatus.textContent = text;
      topStatus.dataset.state = state;
    }
    function setBusy(value) {
      busy = value;
      root.setAttribute('aria-busy', String(value));
      root.querySelectorAll('button,input,select,textarea').forEach(control => { control.disabled = value; });
      if (submit) submit.textContent = value ? '请稍候…' : '提交留言';
    }
    async function loadPage(reset) {
      const generation = ++loadGeneration;
      historyStatus.textContent = '正在读取留言…';
      historyStatus.dataset.state = '';
      try {
        const result = await api(`${endpoint}?offset=${reset ? 0 : loadedCount}`);
        if (generation !== loadGeneration) return false;
        const feedbacks = Array.isArray(result.feedbacks) ? result.feedbacks : [];
        if (reset) { list.replaceChildren(); loadedCount = 0; }
        const existingIds = new Set([...list.children].map(node => node.dataset.feedbackId));
        for (const item of feedbacks) {
          if (existingIds.has(String(item.id))) continue;
          const card = feedbackCard(item, isAdmin);
          card.dataset.feedbackId = String(item.id || '');
          list.append(card);
          existingIds.add(String(item.id));
        }
        loadedCount += feedbacks.length;
        hasMore = result.hasMore === true;
        more.hidden = !hasMore;
        historyStatus.textContent = loadedCount ? (isAdmin && Number.isFinite(result.total) ? `已显示${list.children.length}条，共${result.total}条` : '') : (isAdmin ? '暂未收到伙伴留言' : '您还没有留言，欢迎告诉我们您的想法');
        return true;
      } catch (error) {
        if (generation !== loadGeneration) return false;
        historyStatus.textContent = error.message;
        historyStatus.dataset.state = 'error';
        if (error.status === 401) {
          list.replaceChildren();
          loadedCount = 0;
          more.hidden = true;
        }
        return false;
      }
    }
    async function refreshHistory() {
      if (busy) return false;
      setBusy(true);
      try { return await loadPage(true); }
      finally { setBusy(false); }
    }
    refresh.addEventListener('click', refreshHistory);
    more.addEventListener('click', async () => {
      if (busy || !hasMore) return;
      setBusy(true);
      try { await loadPage(false); }
      finally { setBusy(false); }
    });

    if (form) form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      const payload = {category: category.value, author: author.value.trim(), message: message.value.trim()};
      if (!CATEGORIES.includes(payload.category)) { status('请选择反馈类型', 'error'); category.focus(); return; }
      if (payload.message.length < 5 || payload.message.length > 2000) {
        status('请填写5—2000字的具体反馈', 'error'); message.focus(); return;
      }
      if (payload.author.length > 80) { status('门店与姓名请控制在80字以内', 'error'); author.focus(); return; }
      const serialized = JSON.stringify(payload);
      if (!pendingId || serialized !== pendingPayload) {
        try { pendingId = recordId(); }
        catch { status('当前浏览器暂不支持安全留言，请换用常用浏览器打开', 'error'); return; }
        pendingPayload = serialized;
      }
      setBusy(true);
      status('正在提交，请稍候…');
      try {
        await api(endpoint, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: pendingId, ...payload})});
        pendingId = null;
        pendingPayload = '';
        form.reset();
        counter.textContent = '0 / 2000';
        const refreshed = await loadPage(true);
        status(refreshed ? '留言已收到，谢谢您的建议，项目组会认真查看' : '留言已提交，列表暂未刷新，您可以稍后点击“刷新留言”查看', 'success');
      } catch (error) {
        status(error.message, 'error');
      } finally {
        setBusy(false);
      }
    });

    function clearHistory() {
      loadGeneration++;
      list.replaceChildren();
      loadedCount = 0;
      hasMore = false;
      more.hidden = true;
      historyStatus.textContent = '';
      historyStatus.dataset.state = '';
      status();
    }
    const controller = {refresh: refreshHistory, clear: clearHistory};
    root.__privateFeedbackController = controller;
    refreshHistory();
    return controller;
  }
  window.mountPrivateFeedback = root => mount(root, false);
  window.mountAdminFeedback = root => mount(root, true);
})();
