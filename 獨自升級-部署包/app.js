/* ═══════════ 獨自升級系統 — 核心邏輯 ═══════════ */
"use strict";

/* ───── 動作庫（已依玩家舊傷篩選：右膝 ACL 重建 / 阿基里斯腱修補 / 網球肘復健中） ───── */
const EXERCISES = [
  // 力量 STR
  { id: "goblet",   name: "高腳杯深蹲 3×10",                 attr: "str", exp: 35, note: "ACL 注意：全程控制速度、不彈跳；不適時改「箱上深蹲」",
    video: "https://www.youtube.com/watch?v=62bDZajYJm0", vsrc: "Girls Gone Strong 女力教練" },
  { id: "hipthrust",name: "臀橋 / 臀推 3×12",                attr: "str", exp: 30, note: "膝關節低壓力，強化後鏈、保護 ACL",
    video: "https://www.youtube.com/watch?v=FMyg_gsA0mI", vsrc: "Girls Gone Strong 女力教練" },
  { id: "rdl",      name: "啞鈴羅馬尼亞硬舉 3×10",            attr: "str", exp: 35, note: "中輕重量、慢速離心，對膝蓋與跟腱友善",
    video: "https://www.youtube.com/watch?v=RYV6Zq_8Z0w", vsrc: "Girls Gone Strong 女力教練" },
  { id: "row",      name: "啞鈴單臂划船（中性握）3×10",        attr: "str", exp: 30, note: "網球肘注意：中性握、輕負荷，有疼痛立即停止",
    video: "https://www.youtube.com/watch?v=SIuz8kZNn48", vsrc: "Holly Perkins 女力教練" },
  { id: "ecc_wrist",name: "離心腕伸肌訓練 3×15",              attr: "str", exp: 25, note: "網球肘復健核心動作：舉起後慢放 4 秒",
    video: "https://www.youtube.com/watch?v=BXAzcjxIHMg", vsrc: "Doctor Jo 女物理治療師" },
  { id: "legpress", name: "腿推機（淺角度、慢速）3×12",        attr: "str", exp: 30, note: "ACL 替代深蹲選項：角度勿過深、不鎖死膝蓋",
    video: "https://www.youtube.com/watch?v=jeB1xTlT1LM", vsrc: "Jayd Harrison 女教練" },
  // 敏捷 AGI
  { id: "stepup",   name: "低箱登階（慢速）3×10／邊",          attr: "agi", exp: 30, note: "取代跳箱／深跳：專注控制下降階段",
    video: "https://www.youtube.com/watch?v=nmuC472g9rE", vsrc: "Joanna Soh 女教練" },
  { id: "lateral",  name: "側向滑步（慢速、無急停）3×30 秒",    attr: "agi", exp: 25, note: "取代急停變向訓練，速度放慢、步幅縮小",
    video: "https://www.youtube.com/watch?v=iBmvPEWt5og", vsrc: "MedStar Health（ACL 專用）" },
  { id: "balance",  name: "單腳平衡站立 3×45 秒／邊",          attr: "agi", exp: 25, note: "ACL／跟腱本體感覺重建，可閉眼進階",
    video: "https://www.youtube.com/watch?v=Dtgh2_LFkBQ", vsrc: "Doctor Jo 女物理治療師" },
  { id: "hipmob",   name: "髖關節靈活度操 10 分鐘",            attr: "agi", exp: 20, note: "",
    video: "https://www.youtube.com/watch?v=HzXkMnvqojE", vsrc: "Mady Morrison 女瑜伽教練（跟練）" },
  { id: "calfraise",name: "慢速提踵（雙腳→單腳漸進）3×15",     attr: "agi", exp: 25, note: "跟腱漸進負荷重建：慢上慢下，不做彈跳式",
    video: "https://www.youtube.com/watch?v=_uCUCmVpU88", vsrc: "Doctor Jo 女物理治療師（跟腱專門）" },
  // 體力 VIT
  { id: "walk",     name: "快走 30 分鐘",                     attr: "vit", exp: 35, note: "取代衝刺／跳繩的低衝擊有氧",
    video: "https://www.youtube.com/watch?v=wQrV75N2BrI", vsrc: "Walk at Home — Leslie Sansone（跟走）" },
  { id: "bike",     name: "固定式腳踏車 20 分鐘",              attr: "vit", exp: 35, note: "膝蓋／跟腱零衝擊有氧首選",
    video: "https://www.youtube.com/watch?v=EQuzN-2wmyE", vsrc: "Kirsten Allen 女飛輪教練（座椅設定）" },
  { id: "rower",    name: "划船機 15 分鐘（輕阻力）",           attr: "vit", exp: 30, note: "網球肘注意：輕阻力、握把放鬆勿緊抓",
    video: "https://www.youtube.com/watch?v=XF_3ppHjQLI", vsrc: "Laura Tanley 女划船教練" },
  { id: "incline",  name: "坡度走路 20 分鐘",                  attr: "vit", exp: 30, note: "安全強化跟腱耐受度，坡度由低漸增",
    video: "https://www.youtube.com/watch?v=u2GwfCmfUrY", vsrc: "Lauren Giraldo 12-3-30（跟練）" },
  { id: "swim",     name: "游泳 / 水中行走 20 分鐘",           attr: "vit", exp: 35, note: "全關節零衝擊，避免高強度自由式划手",
    video: "https://www.youtube.com/watch?v=6_vXycbD2TM", vsrc: "Global Triathlon Network" },
  // 意志 WIL
  { id: "plank",    name: "棒式 3×45 秒",                     attr: "wil", exp: 25, note: "前臂支撐，不壓迫腕伸肌",
    video: "https://www.youtube.com/watch?v=Oi9pmH45W7A", vsrc: "Joanna Soh 女教練" },
  { id: "deadbug",  name: "死蟲式 3×12",                      attr: "wil", exp: 25, note: "",
    video: "https://www.youtube.com/watch?v=nWNhYxQQyO8", vsrc: "Meghan Callaway 女力教練" },
  { id: "stretch",  name: "全身伸展 15 分鐘",                  attr: "wil", exp: 20, note: "",
    video: "https://www.youtube.com/watch?v=g_tea8ZNk5A", vsrc: "Mady Morrison 女瑜伽教練（4600萬觀看）" },
  { id: "breath",   name: "呼吸訓練 / 冥想 10 分鐘",           attr: "wil", exp: 20, note: "",
    video: "https://www.youtube.com/watch?v=217ensSqsTM", vsrc: "The Mindful Movement — Sara 引導冥想" },
];

const FORBIDDEN = [
  { name: "深跳 / 跳箱 / 跳深蹲",       reason: "右膝 ACL 重建史",   alt: "低箱登階（慢速）、箱上深蹲" },
  { name: "急停變向 / 折返跑",          reason: "右膝 ACL 重建史",   alt: "側向滑步（慢速、無急停）" },
  { name: "高強度跳繩",                reason: "阿基里斯腱修補史",  alt: "固定式腳踏車、快走" },
  { name: "衝刺",                      reason: "阿基里斯腱修補史",  alt: "坡度走路、划船機（輕阻力）" },
  { name: "高負荷臥推 / 槓鈴握推",      reason: "網球肘復健中",      alt: "離心腕伸肌訓練、輕負荷中性握動作" },
  { name: "引體向上",                  reason: "網球肘復健中",      alt: "彈力帶下拉（輕）、離心腕伸肌訓練" },
];

const ATTR_NAMES = { str: "力量", agi: "敏捷", vit: "體力", wil: "意志" };
const DAILY_BONUS = 30;   // 全任務完成額外 EXP
const ATTR_MAX = 100;     // 屬性條滿值（顯示用）

/* ───── 隱藏副本（全部避開玩家舊傷） ───── */
const DUNGEONS = [
  { id: "corridor", rank: "C", name: "無盡迴廊", attr: "wil", exp: 100,
    desc: "棒式累計撐滿 3 分鐘（可分段，每段至少 30 秒）。",
    note: "前臂支撐，不壓迫腕伸肌。腰部下塌即休息。" },
  { id: "stairs",   rank: "C", name: "深淵階梯", attr: "agi", exp: 100,
    desc: "低箱登階連續 5 分鐘不間斷（慢速、控制下降）。",
    note: "ACL 安全：禁止跳step、全程慢速。" },
  { id: "lake",     rank: "B", name: "冰霜湖面", attr: "agi", exp: 120,
    desc: "閉眼單腳平衡 3×30 秒／每邊（睜眼完成才可進階閉眼）。",
    note: "ACL／跟腱本體感覺終極試煉。請站在牆邊以策安全。" },
  { id: "storm",    rank: "B", name: "魔力風暴", attr: "vit", exp: 120,
    desc: "固定式腳踏車間歇：30 秒加速＋90 秒慢騎，共 8 輪。",
    note: "零衝擊間歇，對膝蓋與跟腱安全。加速段保持坐姿。" },
  { id: "throne",   rank: "A", name: "王座之間", attr: "str", exp: 150,
    desc: "連續循環 3 輪：死蟲式 12 下 → 臀橋 12 下 → 鳥狗式 12 下，輪間休 60 秒。",
    note: "全程地板動作，膝、跟腱、手肘零風險。" },
  { id: "library",  rank: "B", name: "賢者書庫", attr: "wil", exp: 120,
    desc: "箱式呼吸 5 分鐘 ＋ 全身伸展 10 分鐘，途中不可碰手機。",
    note: "恢復系副本：心率全程保持低檔。" },
];

const TITLES = [
  "影之獵人", "不屈者", "深淵行者", "斷鋼之意", "迴廊征服者",
  "風暴騎士", "王座挑戰者", "冰湖舞者", "賢者之徒", "暗夜君主",
];

/* ───── 道具掉落 ───── */
const ITEMS = [
  { name: "治癒藥水",   rarity: "普通", icon: "🧪" },
  { name: "體力恢復劑", rarity: "普通", icon: "⚗️" },
  { name: "鐵之意志膏", rarity: "普通", icon: "🫙" },
  { name: "魔力結晶",   rarity: "稀有", icon: "💎" },
  { name: "強化石",     rarity: "稀有", icon: "🔮" },
  { name: "獵人的徽記", rarity: "稀有", icon: "🜲" },
  { name: "暗影碎片",   rarity: "史詩", icon: "🌑" },
  { name: "支配者之眼", rarity: "史詩", icon: "👁" },
  { name: "君主的印記", rarity: "傳說", icon: "👑" },
];
const RARITY_ORDER = ["普通", "稀有", "史詩", "傳說"];

function rollItem(luck = 0) { // luck 0=一般 1=副本(提升稀有率)
  const r = Math.random();
  let rarity;
  if (luck > 0)  rarity = r < 0.40 ? "普通" : r < 0.75 ? "稀有" : r < 0.95 ? "史詩" : "傳說";
  else           rarity = r < 0.60 ? "普通" : r < 0.90 ? "稀有" : r < 0.98 ? "史詩" : "傳說";
  const pool = ITEMS.filter(i => i.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}
function addItem(it) {
  player.items[it.name] = (player.items[it.name] || 0) + 1;
}

/* ───── 存檔 ───── */
const store = {
  load(key, fallback) {
    try { const v = localStorage.getItem("sl_" + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  save(key, val) { localStorage.setItem("sl_" + key, JSON.stringify(val)); },
};

let player  = store.load("player",  { level: 1, exp: 0, attrs: { str: 10, agi: 10, vit: 10, wil: 10 } });
if (!player.titles) player.titles = [];
if (!player.title) player.title = "陰影君主候補";
if (player.gold === undefined) player.gold = 0;
if (!player.items) player.items = {};
let dungeon = store.load("dungeon", null);           // { date, dungeonId, cleared }
let cards   = store.load("cards", []);               // 討伐圖卡 [{date, name, rank, attr, exp, title}]
let daily   = store.load("daily",   null);            // { date, quests:[{id,done}], bonusGiven }
let streak  = store.load("streak",  { count: 0, lastDate: null });
let bossRec = store.load("boss",    []);              // [{month, weight, pushups, squat, win, exp, date}]
let logs    = store.load("logs",    []);              // [{date, exp, name}]
let weights = store.load("weights", []);              // [{date, kg}]

function saveAll() {
  store.save("player", player); store.save("daily", daily); store.save("streak", streak);
  store.save("boss", bossRec); store.save("logs", logs); store.save("weights", weights);
  store.save("dungeon", dungeon);
  store.save("cards", cards);
}

/* ───── 日期工具 ───── */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function monthStr() { return todayStr().slice(0, 7); }
function dayDiff(a, b) { // b - a 天數
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/* ───── 等級曲線 ───── */
function expNeed(level) { return 100 + (level - 1) * 50; }

/* ───── 系統通知 ───── */
function notify(msg, opts = {}) {
  const box = document.createElement("div");
  box.className = "sys-notify" + (opts.warn ? " warn" : "");
  box.innerHTML = `<span class="n-head">【系統${opts.warn ? "警告" : ""}】</span> ${msg}`;
  document.getElementById("notify-container").appendChild(box);
  setTimeout(() => { box.classList.add("fadeout"); setTimeout(() => box.remove(), 450); }, opts.ms || 3200);
}

const modalQueue = [];
function showModal(title, body, cls = "") {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay.classList.contains("hidden")) { // 已有視窗 → 排隊
    modalQueue.push([title, body, cls]);
    return;
  }
  const win = document.getElementById("modal-window");
  win.className = "sys-window " + cls;
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-body").textContent = body;
  overlay.classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
  if (modalQueue.length > 0) {
    const [t, b, c] = modalQueue.shift();
    setTimeout(() => showModal(t, b, c), 150);
  }
}

function floatExp(x, y, text) {
  const el = document.createElement("div");
  el.className = "float-exp";
  el.textContent = text;
  el.style.left = (x - 20) + "px";
  el.style.top = (y - 30) + "px";
  document.getElementById("float-container").appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

/* ───── EXP / 升級 ───── */
function gainExp(amount, attr) {
  player.exp += amount;
  if (attr && player.attrs[attr] !== undefined) player.attrs[attr] += 1;
  let leveled = 0;
  while (player.exp >= expNeed(player.level)) {
    player.exp -= expNeed(player.level);
    player.level += 1;
    leveled += 1;
  }
  if (leveled > 0) {
    showModal("【系統】LEVEL UP", `偵測到玩家能力大幅成長。\n\n等級提升 → LV.${player.level}\n\n「變強的不是世界，是你。」`, "levelup");
  }
  saveAll();
  renderStatus();
}

/* ───── 每日任務 ───── */
function seededShuffle(arr, seed) {
  let s = 0;
  for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  const rand = () => { s = (s * 1103515245 + 12345) >>> 0; return s / 4294967296; };
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ensureDaily() {
  const today = todayStr();
  if (daily && daily.date === today) return;
  // 從動作庫抽 3 個，優先涵蓋不同屬性
  const shuffled = seededShuffle(EXERCISES, today + "abyss");
  const picked = [];
  const usedAttrs = new Set();
  for (const ex of shuffled) {
    if (picked.length >= 3) break;
    if (!usedAttrs.has(ex.attr)) { picked.push(ex); usedAttrs.add(ex.attr); }
  }
  for (const ex of shuffled) { // 補滿（理論上不會用到）
    if (picked.length >= 3) break;
    if (!picked.includes(ex)) picked.push(ex);
  }
  daily = { date: today, quests: picked.map(ex => ({ id: ex.id, done: false })), bonusGiven: false };
  saveAll();
}

function checkStreakBreak() {
  const today = todayStr();
  if (streak.lastDate && streak.count > 0 && dayDiff(streak.lastDate, today) > 1) {
    const lost = streak.count;
    streak.count = 0;
    saveAll();
    showModal("【系統警告】", `偵測到玩家中斷每日任務。\n\n連續打卡紀錄（${lost} 天）已被系統清除。\n\n「懲罰不會殺死你，但怠惰會。」\n即刻重新開始累積。`, "warn");
  }
}

function completeQuest(idx, ev) {
  const q = daily.quests[idx];
  if (q.done) return;
  const ex = EXERCISES.find(e => e.id === q.id);
  q.done = true;
  logs.push({ date: daily.date, exp: ex.exp, name: ex.name });
  floatExp(ev.clientX, ev.clientY, `+${ex.exp} EXP`);

  // 任務獎勵：金幣＋機率道具掉落
  const gold = 5 + Math.floor(Math.random() * 11);
  player.gold += gold;
  setTimeout(() => floatExp(ev.clientX + 46, ev.clientY + 10, `+${gold} G`), 250);
  let dropTxt = `<b>+${gold} G</b>`;
  if (Math.random() < 0.25) {
    const it = rollItem();
    addItem(it);
    dropTxt += `，掉落 ${it.icon}「${it.name}」(${it.rarity})`;
  }
  notify(`偵測到玩家完成訓練「${ex.name}」。獲得 <b>${ex.exp} EXP</b>（${ATTR_NAMES[ex.attr]} +1）、${dropTxt}`);
  gainExp(ex.exp, ex.attr);
  renderCollection();

  // 全部完成 → streak + bonus
  if (daily.quests.every(x => x.done) && !daily.bonusGiven) {
    daily.bonusGiven = true;
    const today = todayStr();
    if (streak.lastDate && dayDiff(streak.lastDate, today) === 1) streak.count += 1;
    else if (streak.lastDate !== today) streak.count = 1;
    streak.lastDate = today;
    logs.push({ date: today, exp: DAILY_BONUS, name: "每日任務全數完成獎勵" });
    setTimeout(() => {
      // 全任務達成 → 開啟獎勵寶箱（保底道具＋金幣）
      const chestGold = 20 + Math.floor(Math.random() * 21);
      const chestItem = rollItem();
      player.gold += chestGold;
      addItem(chestItem);
      notify(`偵測到玩家完成每日任務。連續打卡 <b>${streak.count}</b> 天`, { ms: 4200 });
      showModal("【系統】每日任務 ALL CLEAR",
        `任務獎勵寶箱已開啟。\n\n獲得 ${DAILY_BONUS} EXP\n獲得 ${chestGold} G\n${chestItem.icon} 獲得「${chestItem.name}」(${chestItem.rarity})\n\n連續打卡：${streak.count} 天`, "levelup");
      gainExp(DAILY_BONUS, null);
      renderQuests();
      renderCollection();
      unlockDungeonFlow();
    }, 600);
  }
  saveAll();
  renderQuests();
}

function renderQuests() {
  document.getElementById("quest-date").textContent =
    `任務日期：${daily.date}　｜　每日 00:00 由系統重新生成`;
  const list = document.getElementById("quest-list");
  list.innerHTML = "";
  daily.quests.forEach((q, i) => {
    const ex = EXERCISES.find(e => e.id === q.id);
    const item = document.createElement("div");
    item.className = "quest-item" + (q.done ? " done" : "");
    item.innerHTML = `
      <button class="quest-check ${q.done ? "checked" : ""}">${q.done ? "✓" : ""}</button>
      <div class="quest-info">
        <div class="quest-name">${ex.name}</div>
        ${ex.note ? `<div class="quest-note">🛡 ${ex.note}</div>` : ""}
        <span class="attr-chip chip-${ex.attr}">${ATTR_NAMES[ex.attr]} +1</span>
        ${ex.video ? `<a class="demo-btn" href="${ex.video}" target="_blank" rel="noopener" title="示範來源：${ex.vsrc}">▶ 示範</a>` : ""}
      </div>
      <div class="quest-reward">+${ex.exp} EXP</div>`;
    item.querySelector(".quest-check").addEventListener("click", ev => completeQuest(i, ev));
    list.appendChild(item);
  });
  if (daily.quests.every(x => x.done)) {
    const clear = document.createElement("div");
    clear.className = "quest-allclear";
    clear.textContent = "⚔ DAILY QUEST — ALL CLEAR ⚔";
    list.appendChild(clear);
  }
}

/* ───── 隱藏副本 ───── */
function allQuestsDone() { return daily && daily.quests.every(q => q.done); }

function ensureDungeon() {
  if (!allQuestsDone()) return;
  const today = todayStr();
  if (dungeon && dungeon.date === today) return;
  // 以日期種子抽副本，避免重新整理換圖
  let s = 0;
  for (const c of (today + "gate")) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  dungeon = { date: today, dungeonId: DUNGEONS[s % DUNGEONS.length].id, cleared: false };
  saveAll();
}

function unlockDungeonFlow() {
  ensureDungeon();
  if (!dungeon || dungeon.cleared) { renderDungeon(); return; }
  setTimeout(() => {
    notify(`偵測到符合條件的玩家……隱藏副本之門已開啟。`, { ms: 4500 });
    renderDungeon();
  }, 1400);
}

function renderDungeon() {
  const panel = document.getElementById("dungeon-panel");
  const body = document.getElementById("dungeon-body");
  if (!allQuestsDone() || !dungeon || dungeon.date !== todayStr()) {
    panel.classList.add("hidden");
    return;
  }
  panel.classList.remove("hidden");
  const d = DUNGEONS.find(x => x.id === dungeon.dungeonId);
  if (dungeon.cleared) {
    body.innerHTML = `<div class="dungeon-cleared">✦ 隱藏副本「${d.name}」已討伐 ✦<br>
      <span style="font-size:12px;color:var(--text-dim)">下一道門將於明日全任務完成後開啟</span></div>`;
    return;
  }
  body.innerHTML = `
    <div class="dungeon-name">⌈ ${d.name} ⌋</div>
    <div class="dungeon-rank">威脅等級：${d.rank} 級　｜　屬性試煉：${ATTR_NAMES[d.attr]}</div>
    <div class="dungeon-desc">${d.desc}</div>
    <div class="dungeon-note">🛡 ${d.note}</div>
    <div class="dungeon-reward">討伐獎勵：${d.exp} EXP ＋ ${ATTR_NAMES[d.attr]} +2 ＋ 機率掉落稱號</div>
    <button class="sys-btn dungeon-btn" id="dungeon-clear-btn">⚔ 完成討伐</button>`;
  document.getElementById("dungeon-clear-btn").addEventListener("click", clearDungeon);
}

function clearDungeon(ev) {
  if (!dungeon || dungeon.cleared) return;
  const d = DUNGEONS.find(x => x.id === dungeon.dungeonId);
  dungeon.cleared = true;
  player.attrs[d.attr] += 1; // gainExp 內再 +1，共 +2
  logs.push({ date: todayStr(), exp: d.exp, name: `隱藏副本「${d.name}」` });
  floatExp(ev.clientX, ev.clientY, `+${d.exp} EXP`);

  // 副本獎勵：金幣＋保底道具（稀有率提升）
  const gold = 30 + Math.floor(Math.random() * 31);
  player.gold += gold;
  const it = rollItem(1);
  addItem(it);

  // 稱號掉落（60% 機率，未持有者中隨機）
  let droppedTitle = null;
  let dropMsg = "";
  const pool = TITLES.filter(t => !player.titles.includes(t));
  if (pool.length > 0 && Math.random() < 0.6) {
    droppedTitle = pool[Math.floor(Math.random() * pool.length)];
    player.titles.push(droppedTitle);
    player.title = droppedTitle;
    dropMsg = `\n☆ 獲得稱號「${droppedTitle}」`;
  }

  // 生成討伐圖卡
  cards.push({ date: todayStr(), name: d.name, rank: d.rank, attr: d.attr, exp: d.exp, title: droppedTitle });

  showModal("【系統】副本討伐完成",
    `隱藏副本「${d.name}」已被淨化。\n\n獲得 ${d.exp} EXP　${ATTR_NAMES[d.attr]} +2\n獲得 ${gold} G\n${it.icon} 獲得「${it.name}」(${it.rarity})${dropMsg}\n\n◈ 討伐圖卡已生成，收錄於「收藏」圖卡冊 ◈`, "dungeon");
  gainExp(d.exp, d.attr);
  saveAll();
  renderDungeon();
  renderHeaderTitle();
  renderCharts();
  renderCollection();
}

function renderHeaderTitle() {
  document.querySelector(".ptitle").textContent = "稱號：" + player.title;
}

/* ───── 討伐圖卡（SVG 生成＋PNG 下載） ───── */
const RANK_COLORS = { C: "#3dc8ff", B: "#9b5cff", A: "#ff4d6a", S: "#ffd766" };

function makeCardSVG(c) {
  const rc = RANK_COLORS[c.rank] || "#9b5cff";
  const titleLine = c.title
    ? `<text x="180" y="356" text-anchor="middle" fill="#ffd766" font-size="15" letter-spacing="2">☆ 稱號掉落「${c.title}」 ☆</text>`
    : `<text x="180" y="356" text-anchor="middle" fill="#5b7a94" font-size="13" letter-spacing="2">— 無稱號掉落 —</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480" font-family="'Microsoft JhengHei','PingFang TC',sans-serif">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#141b33"/><stop offset="100%" stop-color="#05070f"/>
    </radialGradient>
    <linearGradient id="gateG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${rc}" stop-opacity="0.85"/><stop offset="100%" stop-color="${rc}" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <rect width="360" height="480" fill="url(#bgGlow)"/>
  <rect x="8" y="8" width="344" height="464" fill="none" stroke="${rc}" stroke-opacity="0.45" stroke-width="1"/>
  <path d="M8 8 h26 M8 8 v26" stroke="${rc}" stroke-width="3" fill="none"/>
  <path d="M352 8 h-26 M352 8 v26" stroke="${rc}" stroke-width="3" fill="none"/>
  <path d="M8 472 h26 M8 472 v-26" stroke="${rc}" stroke-width="3" fill="none"/>
  <path d="M352 472 h-26 M352 472 v-26" stroke="${rc}" stroke-width="3" fill="none"/>
  <text x="180" y="44" text-anchor="middle" fill="#7fa8c9" font-size="12" letter-spacing="6">HIDDEN DUNGEON CLEARED</text>
  <line x1="60" y1="56" x2="300" y2="56" stroke="${rc}" stroke-opacity="0.4"/>
  <!-- 副本之門 -->
  <g transform="translate(180,150)">
    <path d="M-58 70 L-58 -20 Q-58 -70 0 -70 Q58 -70 58 -20 L58 70 Z" fill="url(#gateG)" stroke="${rc}" stroke-width="2.5"/>
    <path d="M-38 70 L-38 -12 Q-38 -48 0 -48 Q38 -48 38 -12 L38 70 Z" fill="#04060d" stroke="${rc}" stroke-opacity="0.7" stroke-width="1.5"/>
    <path d="M0 -38 L7 -10 L28 -4 L7 4 L0 34 L-7 4 L-28 -4 L-7 -10 Z" fill="${rc}" opacity="0.9"/>
  </g>
  <!-- 威脅等級徽章 -->
  <g transform="translate(312,84)">
    <circle r="24" fill="none" stroke="${rc}" stroke-width="2"/>
    <circle r="19" fill="none" stroke="${rc}" stroke-opacity="0.4"/>
    <text y="9" text-anchor="middle" fill="${rc}" font-size="26" font-weight="bold">${c.rank}</text>
  </g>
  <text x="180" y="268" text-anchor="middle" fill="#eaf2ff" font-size="34" font-weight="bold" letter-spacing="8">${c.name}</text>
  <text x="180" y="296" text-anchor="middle" fill="#7fa8c9" font-size="13" letter-spacing="3">威脅等級 ${c.rank}　·　${ATTR_NAMES[c.attr]}試煉</text>
  <line x1="80" y1="318" x2="280" y2="318" stroke="${rc}" stroke-opacity="0.4"/>
  <text x="180" y="340" text-anchor="middle" fill="#ffd766" font-size="16" letter-spacing="2">+${c.exp} EXP</text>
  ${titleLine}
  <line x1="80" y1="378" x2="280" y2="378" stroke="${rc}" stroke-opacity="0.4"/>
  <text x="180" y="406" text-anchor="middle" fill="#cfeaff" font-size="15" letter-spacing="4">討伐者：深淵主宰</text>
  <text x="180" y="430" text-anchor="middle" fill="#5b7a94" font-size="12" letter-spacing="2">${c.date}</text>
  <text x="180" y="460" text-anchor="middle" fill="#3d5a75" font-size="10" letter-spacing="4">SOLO LEVELING SYSTEM</text>
</svg>`;
}

function downloadCard(idx) {
  const c = cards[idx];
  const svg = makeCardSVG(c);
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    const cv = document.createElement("canvas");
    cv.width = 720; cv.height = 960;
    cv.getContext("2d").drawImage(img, 0, 0, 720, 960);
    URL.revokeObjectURL(url);
    cv.toBlob(b => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `討伐圖卡_${c.name}_${c.date}.png`;
      a.click();
    });
  };
  img.src = url;
}

/* ───── 收藏頁 ───── */
function renderCollection() {
  document.getElementById("col-gold").textContent = player.gold;

  // 道具背包
  const grid = document.getElementById("item-grid");
  const owned = Object.entries(player.items);
  if (owned.length === 0) {
    grid.innerHTML = `<div class="chart-empty">背包空空如也 — 完成訓練任務有機率掉落道具</div>`;
  } else {
    grid.innerHTML = owned.map(([name, count]) => {
      const it = ITEMS.find(i => i.name === name) || { icon: "❔", rarity: "普通" };
      return `<div class="item-chip rarity-${RARITY_ORDER.indexOf(it.rarity)}">
        <span class="item-icon">${it.icon}</span>
        <span>${name}</span><span class="item-count">×${count}</span>
        <span class="item-rarity">${it.rarity}</span></div>`;
    }).join("");
  }

  // 稱號
  const tl = document.getElementById("title-list");
  const allTitles = ["陰影君主候補", ...player.titles];
  tl.innerHTML = allTitles.map(t =>
    `<button class="title-chip ${t === player.title ? "equipped" : ""}" data-title="${t}">${t === player.title ? "✦ " : ""}${t}</button>`
  ).join("");
  tl.querySelectorAll(".title-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      player.title = btn.dataset.title;
      saveAll();
      renderHeaderTitle();
      renderCollection();
      notify(`稱號已變更為「${player.title}」`);
    });
  });

  // 圖卡冊
  const gal = document.getElementById("card-gallery");
  if (cards.length === 0) {
    gal.innerHTML = `<div class="chart-empty">尚無討伐圖卡 — 討伐隱藏副本後自動生成</div>`;
  } else {
    gal.innerHTML = cards.map((c, i) =>
      `<div class="card-slot">${makeCardSVG(c)}
        <button class="sys-btn card-dl-btn" data-idx="${i}">⬇ 下載 PNG</button></div>`
    ).join("");
    gal.querySelectorAll(".card-dl-btn").forEach(btn => {
      btn.addEventListener("click", () => downloadCard(parseInt(btn.dataset.idx, 10)));
    });
  }
}

// 補發：此功能上線前已討伐的副本，回溯生成圖卡
function migrateCards() {
  if (dungeon && dungeon.cleared && !cards.find(c => c.date === dungeon.date)) {
    const d = DUNGEONS.find(x => x.id === dungeon.dungeonId);
    if (d) {
      cards.push({ date: dungeon.date, name: d.name, rank: d.rank, attr: d.attr, exp: d.exp,
        title: player.titles.length > 0 ? player.titles[player.titles.length - 1] : null });
      saveAll();
    }
  }
}

/* ───── 狀態視窗 ───── */
function renderStatus() {
  const need = expNeed(player.level);
  const pct = Math.min(100, (player.exp / need) * 100);
  document.getElementById("hdr-level").textContent = player.level;
  document.getElementById("hdr-exp-fill").style.width = pct + "%";
  document.getElementById("st-level").textContent = player.level;
  document.getElementById("st-exp").textContent = player.exp;
  document.getElementById("st-exp-need").textContent = need;
  document.getElementById("st-exp-fill").style.width = pct + "%";
  document.getElementById("st-streak").textContent = streak.count;
  for (const a of ["str", "agi", "vit", "wil"]) {
    document.getElementById("val-" + a).textContent = player.attrs[a];
    document.getElementById("bar-" + a).style.width = Math.min(100, (player.attrs[a] / ATTR_MAX) * 100) + "%";
  }
  const doneCount = daily ? daily.quests.filter(q => q.done).length : 0;
  document.getElementById("st-today-summary").textContent =
    `今日任務進度：${doneCount} / 3　｜　累計訓練紀錄：${logs.length} 筆`;
}

/* ───── BOSS 戰 ───── */
function renderBoss() {
  const m = monthStr();
  const done = bossRec.find(r => r.month === m);
  const statusEl = document.getElementById("boss-status");
  const form = document.getElementById("boss-form");
  if (done) {
    statusEl.innerHTML = `<span class="boss-cleared">✦ 本月 BOSS 已${done.win ? "討伐" : "挑戰"}完畢。下一場 BOSS 戰將於下月開放。</span>`;
    form.classList.add("disabled");
  } else {
    statusEl.innerHTML = `<span class="boss-ready">⚠ 偵測到月度 BOSS「體測魔王」出現！（${m}）</span><br>
      填寫本月體測數據發起挑戰。較上月進步即判定勝利，獲得大量 EXP。`;
    form.classList.remove("disabled");
  }
  // 歷史表
  const tbl = document.getElementById("boss-history");
  if (bossRec.length === 0) { tbl.innerHTML = `<tr><td class="chart-empty">尚無挑戰紀錄</td></tr>`; return; }
  let html = `<tr><th>月份</th><th>體重</th><th>伏地挺身</th><th>深蹲</th><th>結果</th><th>EXP</th></tr>`;
  for (const r of bossRec.slice().reverse()) {
    html += `<tr><td>${r.month}</td><td>${r.weight} kg</td><td>${r.pushups} 次</td><td>${r.squat} kg</td>
      <td class="${r.win ? "win-tag" : "lose-tag"}">${r.win ? "✦ 勝利" : "挑戰完成"}</td><td>+${r.exp}</td></tr>`;
  }
  tbl.innerHTML = html;
}

document.getElementById("boss-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const m = monthStr();
  if (bossRec.find(r => r.month === m)) return;
  const weight = parseFloat(document.getElementById("boss-weight").value);
  const pushups = parseInt(document.getElementById("boss-pushups").value, 10);
  const squat = parseFloat(document.getElementById("boss-squat").value);
  const prev = bossRec[bossRec.length - 1];
  let win, exp;
  if (!prev) {
    win = true; exp = 300;
    showModal("【系統】BOSS 戰結果", `首次體測完成，基準數據已建立。\n\n判定：勝利 ✦\n獲得 ${exp} EXP\n\n「第一步，是成為怪物的開始。」`, "levelup");
  } else if (pushups > prev.pushups || squat > prev.squat) {
    win = true; exp = 400;
    showModal("【系統】BOSS 戰結果", `偵測到玩家體能較上月顯著成長。\n\n判定：勝利 ✦\n獲得 ${exp} EXP`, "levelup");
  } else {
    win = false; exp = 150;
    showModal("【系統】BOSS 戰結果", `本月數據未超越上月紀錄。\n\n判定：挑戰完成\n獲得參戰獎勵 ${exp} EXP\n\n「失敗的紀錄，也是紀錄。下個月再來。」`, "warn");
  }
  bossRec.push({ month: m, weight, pushups, squat, win, exp, date: todayStr() });
  weights.push({ date: todayStr(), kg: weight });
  logs.push({ date: todayStr(), exp, name: "月度 BOSS 戰" });
  gainExp(exp, "wil");
  ev.target.reset();
  saveAll();
  renderBoss(); renderCharts();
});

/* ───── 數據紀錄 ───── */
document.getElementById("weight-form").addEventListener("submit", ev => {
  ev.preventDefault();
  const kg = parseFloat(document.getElementById("weight-input").value);
  const today = todayStr();
  const existing = weights.find(w => w.date === today);
  if (existing) existing.kg = kg; else weights.push({ date: today, kg });
  weights.sort((a, b) => a.date.localeCompare(b.date));
  saveAll();
  notify(`體重數據已記錄：<b>${kg} kg</b>`);
  ev.target.reset();
  renderCharts();
});

/* SVG 折線圖 */
function lineChartSVG(points, unit) {
  if (points.length === 0) return `<div class="chart-empty">尚無數據 — 記錄第一筆後生成曲線</div>`;
  const W = 760, H = 260, P = 46;
  const vals = points.map(p => p.v);
  let min = Math.min(...vals), max = Math.max(...vals);
  if (min === max) { min -= 1; max += 1; }
  const pad = (max - min) * 0.15; min -= pad; max += pad;
  const x = i => points.length === 1 ? W / 2 : P + (i / (points.length - 1)) * (W - 2 * P);
  const y = v => H - P - ((v - min) / (max - min)) * (H - 2 * P);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">`;
  // 格線
  for (let g = 0; g <= 4; g++) {
    const gy = P + (g / 4) * (H - 2 * P);
    const gv = (max - (g / 4) * (max - min)).toFixed(1);
    s += `<line x1="${P}" y1="${gy}" x2="${W - P}" y2="${gy}" stroke="#14304a" stroke-width="1"/>`;
    s += `<text x="${P - 8}" y="${gy + 4}" fill="#6fa3c4" font-size="11" text-anchor="end">${gv}</text>`;
  }
  // 折線
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  s += `<path d="${path}" fill="none" stroke="#3dc8ff" stroke-width="2.5" style="filter:drop-shadow(0 0 6px rgba(61,200,255,.6))"/>`;
  points.forEach((p, i) => {
    s += `<circle cx="${x(i)}" cy="${y(p.v)}" r="4" fill="#04070f" stroke="#3dc8ff" stroke-width="2"/>`;
    s += `<text x="${x(i)}" y="${y(p.v) - 12}" fill="#ffd766" font-size="11" text-anchor="middle">${p.v}${unit}</text>`;
    // 稀疏顯示日期標籤
    if (points.length <= 8 || i % Math.ceil(points.length / 8) === 0 || i === points.length - 1) {
      s += `<text x="${x(i)}" y="${H - P + 18}" fill="#6fa3c4" font-size="10.5" text-anchor="middle">${p.label}</text>`;
    }
  });
  return s + `</svg>`;
}

/* SVG 長條圖 */
function barChartSVG(items, unit) {
  if (items.every(it => it.v === 0)) return `<div class="chart-empty">尚無訓練數據 — 完成每日任務後生成</div>`;
  const W = 760, H = 260, P = 46;
  const max = Math.max(...items.map(it => it.v), 1) * 1.15;
  const bw = (W - 2 * P) / items.length * 0.55;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px">`;
  for (let g = 0; g <= 4; g++) {
    const gy = P + (g / 4) * (H - 2 * P);
    s += `<line x1="${P}" y1="${gy}" x2="${W - P}" y2="${gy}" stroke="#14304a" stroke-width="1"/>`;
    s += `<text x="${P - 8}" y="${gy + 4}" fill="#6fa3c4" font-size="11" text-anchor="end">${Math.round(max - (g / 4) * max)}</text>`;
  }
  items.forEach((it, i) => {
    const cx = P + (i + 0.5) * ((W - 2 * P) / items.length);
    const h = (it.v / max) * (H - 2 * P);
    s += `<rect x="${cx - bw / 2}" y="${H - P - h}" width="${bw}" height="${Math.max(h, 1)}"
          fill="rgba(61,200,255,0.35)" stroke="#3dc8ff" stroke-width="1.5"
          style="filter:drop-shadow(0 0 5px rgba(61,200,255,.4))"/>`;
    if (it.v > 0) s += `<text x="${cx}" y="${H - P - h - 8}" fill="#ffd766" font-size="11" text-anchor="middle">${it.v}</text>`;
    s += `<text x="${cx}" y="${H - P + 18}" fill="#6fa3c4" font-size="10.5" text-anchor="middle">${it.label}</text>`;
  });
  return s + `</svg>`;
}

function weekStart(dateStr) { // 該週的星期一
  const d = new Date(dateStr);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function renderCharts() {
  // 體重曲線（最近 30 筆）
  const wp = weights.slice(-30).map(w => ({ v: w.kg, label: w.date.slice(5) }));
  document.getElementById("weight-chart").innerHTML = lineChartSVG(wp, "");
  // 每週訓練量（最近 8 週）
  const byWeek = {};
  for (const l of logs) {
    const wk = weekStart(l.date);
    byWeek[wk] = (byWeek[wk] || 0) + l.exp;
  }
  const items = [];
  const cur = weekStart(todayStr());
  for (let i = 7; i >= 0; i--) {
    const d = new Date(cur);
    d.setDate(d.getDate() - i * 7);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    items.push({ label: key.slice(5), v: byWeek[key] || 0 });
  }
  document.getElementById("volume-chart").innerHTML = barChartSVG(items, "EXP");
}

/* ───── 動作庫頁 ───── */
function renderLibrary() {
  let html = `<tr><th>禁止動作</th><th>原因</th><th>系統認可替代方案</th></tr>`;
  for (const f of FORBIDDEN) {
    html += `<tr><td style="color:var(--danger)">⛔ ${f.name}</td><td>${f.reason}</td><td style="color:var(--agi)">✓ ${f.alt}</td></tr>`;
  }
  document.getElementById("forbidden-table").innerHTML = html;

  const lib = document.getElementById("exercise-library");
  lib.innerHTML = "";
  for (const a of ["str", "agi", "vit", "wil"]) {
    const title = document.createElement("div");
    title.className = "lib-group-title";
    title.innerHTML = `── ${ATTR_NAMES[a]} ${a.toUpperCase()} ──`;
    lib.appendChild(title);
    for (const ex of EXERCISES.filter(e => e.attr === a)) {
      const item = document.createElement("div");
      item.className = "lib-item";
      item.innerHTML = `
        <div>
          <div class="lib-name">${ex.name}</div>
          ${ex.note ? `<div class="lib-note">🛡 ${ex.note}</div>` : ""}
          ${ex.video ? `<a class="demo-btn" href="${ex.video}" target="_blank" rel="noopener">▶ 示範</a><span class="vsrc">${ex.vsrc}</span>` : ""}
        </div>
        <div class="lib-exp">+${ex.exp} EXP<br><span class="attr-chip chip-${ex.attr}">${ATTR_NAMES[ex.attr]} +1</span></div>`;
      lib.appendChild(item);
    }
  }
}

/* ───── 分頁切換 ───── */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

/* ───── 啟動 ───── */
ensureDaily();
checkStreakBreak();
ensureDungeon();
migrateCards();
renderStatus();
renderQuests();
renderBoss();
renderCharts();
renderLibrary();
renderDungeon();
renderHeaderTitle();
renderCollection();

// PWA：離線快取（http/https 環境才註冊）
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

if (!localStorage.getItem("sl_welcomed")) {
  localStorage.setItem("sl_welcomed", "1");
  setTimeout(() => {
    showModal("【系統】", `偵測到符合資格的玩家。\n\n歡迎，玩家「深淵主宰」。\n每日任務系統已啟動。\n\n你的舊傷紀錄已登錄，\n所有高風險動作已從任務池中移除。`);
  }, 400);
} else {
  setTimeout(() => notify(`玩家「深淵主宰」已連線。今日任務已生成，請至「每日任務」確認。`), 300);
}
