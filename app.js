// Replace demo records with titles and links you are authorized to publish.
const movies = [
  {id:1,title:"বাংলা সিনেমা",year:"2025",type:"bangla",label:"বাংলা",emoji:"🎬",c1:"#8e254b",c2:"#f2a33a",description:"এখানে অনুমোদিত বাংলা সিনেমার বিবরণ যোগ করুন।",watchUrl:"https://www.youtube.com/@YouTubeMovies"},
  {id:2,title:"হিন্দি সিনেমা",year:"2025",type:"hindi",label:"হিন্দি",emoji:"🎥",c1:"#4a246f",c2:"#e64f70",description:"এখানে অনুমোদিত হিন্দি সিনেমার বিবরণ যোগ করুন।",watchUrl:"https://www.youtube.com"},
  {id:3,title:"ওয়েব সিরিজ",year:"2025",type:"series",label:"সিরিজ",emoji:"📺",c1:"#134e70",c2:"#20c5b4",description:"অফিসিয়াল সিরিজ পেজ বা অনুমোদিত স্ট্রিমিং লিংক যোগ করুন।",watchUrl:"https://www.youtube.com"},
  {id:4,title:"নতুন রিলিজ",year:"2026",type:"bangla",label:"নতুন",emoji:"✨",c1:"#7b3427",c2:"#e9b84b",description:"নতুন রিলিজের তথ্য ও অফিসিয়াল ট্রেলার যোগ করুন।",watchUrl:"https://www.youtube.com"},
  {id:5,title:"অ্যাকশন মুভি",year:"2024",type:"hindi",label:"ট্রেন্ডিং",emoji:"⚡",c1:"#27345f",c2:"#dc463c",description:"এই ডেমো কার্ডে নিজের বৈধ কনটেন্টের তথ্য বসান।",watchUrl:"https://www.youtube.com"},
  {id:6,title:"ড্রামা সিরিজ",year:"2025",type:"series",label:"সিরিজ",emoji:"🎭",c1:"#512c65",c2:"#dd6e99",description:"এখানে সিরিজের সারাংশ ও অফিসিয়াল দেখার লিংক যোগ করুন।",watchUrl:"https://www.youtube.com"}
];
const saved = new Set();
let activeFilter = "all";
let activeTab = "movies";
let searchMode = false;
let searchInput = null;
const $ = (id) => document.getElementById(id);

function filteredMovies() {
  let list = movies.filter(m => {
    if (activeTab === "series" && m.type !== "series") return false;
    if (activeTab === "trending" && m.label !== "ট্রেন্ডিং") return false;
    if (activeTab === "saved" && !saved.has(m.id)) return false;
    if (activeFilter !== "all" && activeFilter !== "new" && activeFilter !== "trending" && m.type !== activeFilter) return false;
    if (activeFilter === "trending" && m.label !== "ট্রেন্ডিং") return false;
    if (activeFilter === "new" && m.year !== "2026") return false;
    if (searchInput && !m.title.toLowerCase().includes(searchInput.toLowerCase())) return false;
    return true;
  });
  return list;
}
function render() {
  const list = filteredMovies();
  $("movieCount").textContent = list.length;
  $("movieGrid").innerHTML = list.map(m => `
    <article class="movie-card">
      <div class="poster" style="--c1:${m.c1};--c2:${m.c2}">
        <span class="poster-symbol">${m.emoji}</span>
        <span class="poster-title">${escapeHtml(m.title)}</span>
      </div>
      <div class="movie-info">
        <h3>${escapeHtml(m.title)}</h3>
        <div class="meta">${escapeHtml(m.label)} · ${escapeHtml(m.year)}</div>
        <div class="card-actions">
          <button class="small-btn primary" data-open="${m.id}">বিস্তারিত</button>
          <button class="small-btn" data-save="${m.id}">${saved.has(m.id) ? "♥ সেভড" : "♡ সেভ"}</button>
        </div>
      </div>
    </article>`).join("");
  $("emptyState").classList.toggle("hidden", list.length > 0);
  $("resultLabel").textContent = `${list.length}টি টাইটেল`;
  document.querySelectorAll(".chip").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.tab === activeTab));
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function openDetails(id) {
  const m = movies.find(x => x.id === Number(id));
  if (!m) return;
  $("detailContent").innerHTML = `
    <div class="detail-poster" style="background:linear-gradient(130deg,${m.c1},${m.c2})">${m.emoji} &nbsp; ${escapeHtml(m.title)}</div>
    <span class="eyebrow">${escapeHtml(m.label)} · ${escapeHtml(m.year)}</span>
    <h2>${escapeHtml(m.title)}</h2>
    <p>${escapeHtml(m.description)}</p>
    <a class="external-link" href="${safeUrl(m.watchUrl)}" target="_blank" rel="noopener noreferrer">▶ বৈধভাবে দেখুন / অফিসিয়াল পেজ</a>`;
  $("detailDialog").showModal();
}
function safeUrl(url) {
  try { const u = new URL(url); return ["https:","http:"].includes(u.protocol) ? u.href : "#"; }
  catch { return "#"; }
}
document.addEventListener("click", e => {
  const open = e.target.closest("[data-open]");
  const save = e.target.closest("[data-save]");
  const filter = e.target.closest("[data-filter]");
  const tab = e.target.closest("[data-tab]");
  if (open) openDetails(open.dataset.open);
  if (save) { const id = Number(save.dataset.save); saved.has(id) ? saved.delete(id) : saved.add(id); render(); }
  if (filter) { activeFilter = filter.dataset.filter; activeTab = "movies"; render(); }
  if (tab) { activeTab = tab.dataset.tab; activeFilter = "all"; render(); }
});
$("closeDialog").addEventListener("click", () => $("detailDialog").close());
$("guideBtn").addEventListener("click", () => $("guideDialog").showModal());
$("closeGuide").addEventListener("click", () => $("guideDialog").close());
$("searchBtn").addEventListener("click", () => {
  const value = prompt("মুভি বা সিরিজের নাম লিখুন:");
  searchInput = value && value.trim() ? value.trim() : null;
  render();
});
$("menuBtn").addEventListener("click", () => {
  if (window.Telegram?.WebApp) window.Telegram.WebApp.showAlert("Prime Scene মেনু: ক্যাটাগরি থেকে কনটেন্ট বেছে নিন।");
  else alert("Prime Scene মেনু: ক্যাটাগরি থেকে কনটেন্ট বেছে নিন।");
});
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  try { tg.setHeaderColor("#0b0c1b"); tg.setBackgroundColor("#080a17"); } catch {}
}
render();
