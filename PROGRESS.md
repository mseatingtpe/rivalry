# PROGRESS

> 規格看 [SPEC.md](./SPEC.md)。**每個 Phase 做完停下來給 Sunny 看**，不要一路做到底。
> Phase 2 / 3 內另設視覺與動態確認點（★），Sunny 點頭才繼續。

## Phase 0 — 骨架與規格

**狀態：完成待驗收**

- [x] `~/dev/personal/rivalry` + `git init`（main，author `Sunny Cheng <ms.eatingtpe@gmail.com>`）
- [x] SPEC.md / PROGRESS.md / CLAUDE.md / README.md
- [x] `.gitignore`
- [x] **Sunny 已拍板**：這專案是《對手》互動卡牌網頁（SPEC 已填完整規格與逐字卡片內容）
- [x] **Sunny 已拍板**：技術選型（單一 HTML + vanilla JS／Source Han Mono TC 內嵌／GitHub Pages public）
- [ ] GitHub public repo `mseatingtpe/rivalry` + `git remote add origin`（移到 Phase 5 一起做）

## Phase 1 — 牌組邏輯 + 排序驗證

**狀態：完成待驗收**

- [x] `src/deck.js`：24 張卡片逐字內容 + `buildDeck('acts'|'shuffle')` + `blankActOf()`
- [x] `tools/verify-deck.mjs`：SPEC 驗收條件跑 1000 次 × 兩模式
- [x] 驗收：`node tools/verify-deck.mjs` 全綠（留白 1000 次落遍 24/24 個空隙）
- [x] 加驗：deck.js 25 句卡文與 SPEC.md 逐字比對一致

## Phase 2 — 靜態版面與卡片視覺

**狀態：未開始**

- [ ] 開場畫面（標題→署名→細線→題詞→兩顆按鈕，依序淡入上浮）
- [ ] 卡片 2:3 直式、雙層框、紙紋、單色調（先用系統 mono 頂著）
- [ ] ★ **確認點 A**：LAN preview 給 Sunny 看開場 + 靜態卡視覺，過了才進 Phase 3

## Phase 3 — 揭幕互動

**狀態：未開始**

- [ ] ★ **確認點 B**：攤弧／抽牌／離場三個動態 demo 先給 Sunny 定調
- [ ] 完整狀態機：三疊亮起→攤弧→儀式性抽牌→補位→換幕→終卡→再洗一次
- [ ] 亂序模式（一次攤成長弧）
- [ ] 前進四路、380ms 節流、reduced-motion、iOS 細節
- [ ] ★ **確認點 C**：手機完整跑完兩模式各一局，Sunny 驗收

## Phase 4 — 字型子集內嵌 + build

**狀態：未開始**

- [ ] `tools/subset-font.sh`：下載 Source Han Mono TC → pyftsubset → woff2
- [ ] `tools/build.mjs`：注入字型 base64 + deck.js → root `index.html`
- [ ] 驗收：`file://` 開啟單檔，Network 零外部請求

## Phase 5 — 上線

**狀態：未開始**

- [ ] `gh repo create mseatingtpe/rivalry --public` + push
- [ ] Pages：Deploy from a branch（`main` / root）
- [ ] 驗收：Pages URL 手機跑完整一局

## 決策日誌

| 日期 | 決定 | 原因 |
|------|------|------|
| 2026-08-16 | 專案落在 `~/dev/personal/`，走個人 GitHub 帳號 `mseatingtpe` | 個人專案，與公務身份（`taiccasunny`）分流 |
| 2026-08-16 | 專案定為《對手》互動卡牌網頁，完整規格入 SPEC | Sunny 提供完整重建 prompt |
| 2026-08-16 | 技術棧：單一 HTML + vanilla JS，不用 React | 零依賴零外部請求，25 張牌的狀態機不需要 framework；產物單檔可丟任何靜態空間 |
| 2026-08-16 | 字型改 Source Han Mono TC（推翻原稿 Noto Serif TC） | Sunny 拍板要 mono、電腦感。OFL 可內嵌；系統 Songti 是 Apple 授權字型不可嵌公開網頁 |
| 2026-08-16 | Repo 改 public（推翻原本 private） | GitHub Pages 免費版只能從 public repo 發佈 |
| 2026-08-16 | Pages 用 Deploy from a branch，不走 GitHub Actions | `mseatingtpe` 的 gh token 沒有 `workflow` scope，推 workflow 檔會被擋 |
| 2026-08-16 | 留白牌實作：在 23 張題目的 24 個空隙均勻隨機插入，歸屬看其後第一張題目的幕 | 規格「洗入任意位置」與「幕不被切斷」並存的合理詮釋——歸幕規則本就為留白落在幕中間而設 |
| 2026-08-16 | 牌組邏輯抽成 `src/deck.js`，build 時 inline 回單檔 | 驗證腳本要能 import；卡片文字只留一份實作端 SSOT |
| 2026-08-16 | 色彩定調深色夜晚墨底（推翻原稿米白紙底） | Sunny 看過暖米白四變體後不喜歡，拍板深色；像素方向也否決 |
| 2026-08-16 | 動態維持 vanilla JS，用 spring 曲線做出 framer-motion 手感 | Sunny 要「react 動態那種」；要的是手感不是框架，單檔零依賴不變 |
| 2026-08-16 | 加棄牌堆回顧（唯讀）；隨時洗牌不做 | Sunny 拍板。翻閱唯讀不違背「只能往前」精神（桌遊本來看得到已翻開的牌）；零新增介面文字 |
| 2026-08-16 | 視覺定稿走 Ma:Sonic 參照：冷灰白紙底＋近黑墨＋Klein blue 唯一 accent（推翻深色夜晚底與「不引入第二色」） | Sunny 丟四張 Ma:Sonic 參照圖拍板。blue 只用在：幕別標籤、亮起的疊標、進度圓點、細線、按鈕按下、再洗一次底線 |
| 2026-08-16 | 加手指滑弧 graze：指下牌背浮起、放開抽那張、逐張輕震＋紙聲 | Sunny 要「手指劃過卡牌的感覺、先浮出哪一張」。仍維持儀式性抽牌（拿到的是牌堆下一張） |
| 2026-08-16 | 留白卡改「乾杯！」（原「跳過這輪…」） | Sunny 拍板，原文案讀起來怪 |
| 2026-08-16 | 題目卡加英文並列（終卡與介面維持純中文）；英譯由 Claude 起草、Sunny 校對 | Sunny 拍板範圍「只有題目卡」 |
| 2026-08-16 | 加 `tools/rebuild.sh`：改卡後一鍵 subset+build+verify | 之後加牌的最短工作流 |
| 2026-08-16 | 中文斷行改「clause 原子化」：依全形標點切段，段內不可拆 | 修「時/空」「你/會」詞內斷行。零授權成本，加新牌自動適用 |
| 2026-08-16 | 開場改不對稱構圖＋漂浮藍點；標題拿掉《》改「對手＋藍線＋RIVALRY」（方案 C） | Sunny 選 C。《》移除後兩字太輕，需重新給份量；藍線呼應參照圖的藍色塊 |
| 2026-08-16 | 題詞刪後半句，改「所有答案只代表今天的你」（無句點） | Sunny：原句「有點矯情」。「明天可以翻案」的替讀者總結感移除 |
| 2026-08-16 | 署名連到 2025H2 信念清單那篇；**不做 GitHub star 引導** | 這副牌的受眾是電子報讀者不是工程師；終卡餘韻後放 star 請求會破壞情緒 |
