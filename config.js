/**
 * CMO Dashboard - Analytics URL Router
 * GitHub Pages上で動作する際、../analytics/ へのfetchをトンネルURLへリダイレクト
 * config.json で管理するためURLが変わっても config.json 1ファイルの更新だけで済む
 */
(function () {
  // ローカル（localhost）では何もしない
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;

  try {
    // 同期XHRでconfig.jsonを読む（fetchオーバーライド前に完了させる必要があるため）
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/cmo-dashboard/config.json', false);
    xhr.send();
    var cfg = JSON.parse(xhr.responseText);
    var analyticsBase = cfg.analytics_base;
    if (!analyticsBase) return;

    // window.fetch をオーバーライドして ../analytics/ を tunnel URL に差し替え
    var _orig = window.fetch.bind(window);
    window.fetch = function (url, opts) {
      if (typeof url === 'string' && url.indexOf('../analytics/') !== -1) {
        url = url.replace(/\.\.\/analytics\//, analyticsBase + '/');
      }
      return _orig(url, opts);
    };
  } catch (e) {
    // config.json 未取得時はそのまま（ローカル動作）
  }
})();
