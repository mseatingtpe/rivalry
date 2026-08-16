# 接手這個專案

**先讀 [SPEC.md](./SPEC.md)，再讀 [PROGRESS.md](./PROGRESS.md)。** SPEC 裡「已確定的決策」要改必須先問 Sunny，不要在實作中順手優化掉。

## 鐵則

- 每個 Phase 做完**停下來給 Sunny 看**，不要一路做到底。
- 回覆用繁體中文（技術術語保留英文），**程式碼註解用英文**。
- **不直接 push main。**
- commit message 用 conventional commits（`feat:` / `fix:` / `docs:` …）。
- 動手前先 `git pull --rebase`；commit 前先給 `git diff --staged` 摘要。
- 做了決定就寫進 PROGRESS.md 的決策日誌，**連理由一起寫**——三個月後看不懂的決定等於沒做。

## 環境

- 這台是 Mac mini（Dev Server），Sunny 從 MacBook SSH 進來操作。
- git remote 走 SSH alias `github.com-personal`，author `Sunny Cheng <ms.eatingtpe@gmail.com>`。
  remote URL 格式：`git@github.com-personal:mseatingtpe/rivalry.git`
- 這台機器有雙 gh 帳號，**個人專案要用 `mseatingtpe`**（`gh` 預設可能是公務的 `taiccasunny`，查不到 repo 多半是切錯帳號）。
- 本機 Node 是 25.x（非 LTS）。若要部署到 Vercel，`.nvmrc` 與 `engines.node` 記得釘 24.x。

## Remote Control

這個專案預期會從手機端用 Remote Control 接手。啟動方式（**包在 tmux 裡**，SSH 一斷才不會連 session 一起死）：

```
tmux new -s rivalry 'cd ~/dev/personal/rivalry && claude --remote-control rivalry'
```

## 已驗證的事實（不用再查）

- （還沒有。踩到坑、查證過的事實寫這裡，讓下一個接手的人不用重查。）
