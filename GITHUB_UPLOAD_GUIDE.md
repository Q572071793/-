# 🚀 GitHub上传完整指南

## 📋 步骤说明

### 1️⃣ 创建GitHub仓库

1. **访问GitHub** → https://github.com
2. **登录您的账户**
3. **点击右上角 "+" 按钮** → 选择 "New repository"
4. **填写仓库信息：**
   - **Repository name**: `PickerBot` (或您喜欢的名称)
   - **Description**: `功能完整的纯前端年会抽奖系统`
   - **Public/Private**: 根据需求选择
   - **Initialize this repository with**: ❌ 不要勾选任何选项
5. **点击 "Create repository"**

### 2️⃣ 获取仓库URL

创建完成后，您会看到类似这样的URL：
```
https://github.com/您的用户名/PickerBot.git
```

### 3️⃣ 配置远程仓库并推送

在您的项目目录中执行以下命令：

```bash
# 添加远程仓库（替换为您的实际仓库URL）
git remote add origin https://github.com/YOUR_USERNAME/PickerBot.git

# 推送到GitHub
git push -u origin master
```

### 4️⃣ 如果遇到问题

#### ❌ 如果远程仓库已存在
```bash
# 先删除旧的远程仓库配置
git remote remove origin

# 然后重新添加
git remote add origin https://github.com/YOUR_USERNAME/PickerBot.git
```

#### ❌ 如果分支名称不匹配
```bash
# 查看当前分支
git branch

# 如果显示的是main而不是master
git push -u origin main
```

#### ❌ 如果需要强制推送（谨慎使用）
```bash
git push -f origin master
```

## 🎯 一键执行脚本

我已经为您创建了推送脚本，只需要：

1. **编辑 `push_to_github.bat` 文件**
2. **替换 `YOUR_USERNAME` 为您的GitHub用户名**
3. **双击运行脚本**

## 📊 项目文件说明

```
PickerBot/
├── 📄 index.html          # 主页面文件
├── 📄 script.js           # JavaScript逻辑
├── 📄 styles.css          # CSS样式文件
├── 📄 README.md           # 项目说明文档
└── 📄 push_to_github.bat  # GitHub推送脚本
```

## ✨ 项目亮点

- **🎲 智能抽奖** - 支持逐个和批量抽奖
- **👥 人员管理** - 灵活导入和管理参与者
- **🏆 奖项设置** - 自定义奖项和数量
- **📊 记录导出** - 支持CSV/JSON/TXT格式
- **🎨 现代化界面** - 渐变色彩和动画效果
- **📱 响应式设计** - 适配各种设备

## 🌟 上传后的效果

上传成功后，您的GitHub仓库将包含：
- ✅ 完整的源代码文件
- ✅ 详细的项目说明文档
- ✅ 清晰的提交历史记录
- ✅ 专业的README介绍

## 🤝 后续建议

1. **添加许可证文件** - 考虑添加MIT许可证
2. **创建发布版本** - 使用GitHub Releases功能
3. **添加Issues模板** - 方便用户反馈问题
4. **设置GitHub Pages** - 可以直接在线演示
5. **推广您的项目** - 分享到相关社区

## 📞 需要帮助？

如果在上传过程中遇到任何问题：
1. 检查GitHub账户是否正常
2. 确认网络连接稳定
3. 验证仓库URL是否正确
4. 查看Git错误提示信息

---

**🎉 恭喜！您的年会抽奖系统即将上线GitHub！**