const APP_CONFIG = {
  spreadsheetName: 'лист «Плоская_таблица»',
  defaultPage: 'dashboard',
  pages: {
    dashboard: { key: 'dashboard', title: 'Финансовый дашборд', menuTitle: 'Дэшборд', file: 'dashboard', description: 'Сводная оценка финансового состояния компании' },
    money: { key: 'money', title: 'Деньги', menuTitle: 'Деньги', file: 'money', description: 'Денежные потоки и обязательные платежи' },
    capital: { key: 'capital', title: 'Капитал', menuTitle: 'Капитал', file: 'capital', description: 'Активы, обязательства и долговая нагрузка' },
    profit: { key: 'profit', title: 'Прибыль', menuTitle: 'Прибыль', file: 'profit', description: 'Выручка, прибыль и динамика результатов' },
    risks: { key: 'risks', title: 'Риски и связи', menuTitle: 'Риски', file: 'risks', description: 'Налоговые, судебные и контрагентские риски' },
    rating: { key: 'rating', title: 'Кредитный рейтинг', menuTitle: 'Рейтинг', file: 'rating', description: 'Предварительная банковская оценка клиента' },
    flight: { key: 'flight', title: 'Флот и налёт', menuTitle: 'Флот', file: 'flight', description: 'Налёт и покрытие кредитных и лизинговых платежей' }
  }
};

function doGet(e) {
  const pageKey = normalizePageKey_(e && e.parameter ? e.parameter.page : '');
  const page = APP_CONFIG.pages[pageKey];
  const params = e && e.parameter ? e.parameter : {};
  const template = HtmlService.createTemplateFromFile('template');
  template.pageKey = page.key;
  template.pageTitle = page.title;
  template.pageDescription = page.description;
  template.contentFile = page.file;
  template.navItems = getNavigationItems_();
  template.appConfig = { spreadsheetName: APP_CONFIG.spreadsheetName };
  template.appUrl = getScriptUrl();
  template.initialPeriod = {
    periodType: String(params.periodType || '').toLowerCase() === 'quarter' ? 'quarter' : 'year',
    year: Math.max(2021, Math.min(2040, Number(params.year) || 2024)),
    quarter: Math.max(1, Math.min(4, Number(params.quarter) || 1))
  };
  return template.evaluate()
    .setTitle(page.title + ' - Финансовое состояние авиакомпании')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(String(fileName || '').trim()).getContent();
}

function getScriptUrl() { return ScriptApp.getService().getUrl(); }

function getPageUrl(pageKey) {
  const key = normalizePageKey_(pageKey);
  return getScriptUrl() + '?page=' + encodeURIComponent(key);
}

function getAppShellState() {
  return { ok: true, data: { spreadsheetName: APP_CONFIG.spreadsheetName, pages: getNavigationItems_() }, warnings: [], updatedAt: new Date().toISOString() };
}

function normalizePageKey_(pageKey) {
  const key = String(pageKey || APP_CONFIG.defaultPage).trim().toLowerCase();
  return APP_CONFIG.pages[key] ? key : APP_CONFIG.defaultPage;
}

function getNavigationItems_() {
  return Object.keys(APP_CONFIG.pages).map(function(key) {
    const page = APP_CONFIG.pages[key];
    return { key: page.key, title: page.menuTitle, fullTitle: page.title, url: getPageUrl(page.key) };
  });
}
