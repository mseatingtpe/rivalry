# rivalry

**《對手》— 一副給兩個人面對面玩的問答卡牌網頁，沒有輸贏。** 單一 HTML 檔、零外部請求，部署在 GitHub Pages。作者署名為電子報《無用之用 Master of None》。

## 文件

| 檔案 | 內容 |
|------|------|
| [SPEC.md](./SPEC.md) | 產品規格的 single source of truth |
| [PROGRESS.md](./PROGRESS.md) | 目前進度、Phase 切分、決策日誌 |
| [CLAUDE.md](./CLAUDE.md) | 接手鐵則與環境設定 |

## 開發

```
node tools/verify-deck.mjs   # 排序約束驗證（1000 次）
node tools/build.mjs         # src/ → root index.html（單檔產物）
python3 -m http.server 8000  # LAN preview（手機開 http://<mini-ip>:8000/）
```

技術棧：單一 HTML + vanilla JS；字型 Source Han Mono TC 子集化 base64 內嵌；GitHub Pages（Deploy from a branch）。
