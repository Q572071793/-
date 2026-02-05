# GitHub上传脚本
# 请按照以下步骤操作：

# 1. 首先在GitHub创建仓库，获取仓库URL
# 2. 替换下面的 YOUR_USERNAME 为您的GitHub用户名
# 3. 替换 PickerBot 为您想要的仓库名（如果不同）

# 设置远程仓库（请替换为您的实际仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/PickerBot.git

# 推送到GitHub
git push -u origin master

# 如果GitHub现在使用main分支作为主分支，请使用：
# git push -u origin main

echo "✅ 推送完成！请在GitHub查看您的仓库。"