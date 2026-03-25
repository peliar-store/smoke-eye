const ALLOWED = new Set(['B', 'STRONG', 'MARK', 'BR']);

export function sanitizeHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  (function walk(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 1) {
        if (!ALLOWED.has(child.tagName)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          node.removeChild(child);
        } else {
          for (const a of [...child.attributes]) child.removeAttribute(a.name);
          walk(child);
        }
      }
    }
  })(tmp);
  return tmp.innerHTML;
}

export function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
