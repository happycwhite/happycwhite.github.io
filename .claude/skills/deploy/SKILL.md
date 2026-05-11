Push 目前的變更到 GitHub，並監看 GitHub Pages 的 deploy 狀態。

步驟：
1. 執行 `git push`
2. 執行 `gh run list --repo happycwhite/happycwhite.github.io --limit 1` 取得最新的 run ID
3. 執行 `gh run watch <run_id> --repo happycwhite/happycwhite.github.io` 監看結果
4. 回報 deploy 成功或失敗
