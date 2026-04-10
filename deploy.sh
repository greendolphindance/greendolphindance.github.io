#!/usr/bin/env bash
set -euo pipefail

# === 配置 ===
REMOTE="git@github.com:greendolphindance/greendolphindance.github.io.git"
BRANCH="master"
PUBLIC_DIR="public"
CNAME_FILE="source/CNAME"   # 确保这里有你的域名

# 1) 生成静态文件（顺序执行，避免并行冲突）
hexo clean
rm -f db.json .cache 2>/dev/null || true
hexo generate

# 2) 基本校验
test -f "${PUBLIC_DIR}/index.html" || { echo "ERROR: 未生成 ${PUBLIC_DIR}/index.html"; exit 1; }
test -f "${CNAME_FILE}" || { echo "ERROR: 缺少 ${CNAME_FILE}（自定义域名）"; exit 1; }
# 确保 CNAME 被拷贝进 public（Hexo 正常会自动拷贝；双保险）
cp -f "${CNAME_FILE}" "${PUBLIC_DIR}/CNAME"

# 3) 初始化/校正 public 仓库
cd "${PUBLIC_DIR}"
if [ ! -d .git ]; then
  git init
  git remote add origin "${REMOTE}"
fi
git remote set-url origin "${REMOTE}"
git branch -M "${BRANCH}"

# 4) 提交并强推
git add -A
git commit -m "Publish $(date '+%F %T')" || true
git push -f origin "${BRANCH}"

# 5) 验证这次提交确实包含关键文件
git ls-tree --name-only -r HEAD | grep -E '^(index\.html|CNAME)$' > /dev/null \
  || { echo "WARN: 提交中未检测到 CNAME 或 index.html，请检查 .gitignore"; exit 1; }

echo "✅ Deployed to ${REMOTE} (${BRANCH})"