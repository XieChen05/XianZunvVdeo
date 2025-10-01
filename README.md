# 🎬 追剧网站

一个基于HTML/CSS/JavaScript开发的在线追剧网站，使用妖狐API提供的影视资源。

## 📋 功能特点

- 🔍 智能搜索：输入剧名快速查找
- 📺 在线播放：支持m3u8格式视频流
- 🎨 精美界面：现代化渐变设计
- 📱 响应式布局：完美适配手机、平板、电脑
- ⚡ 流畅体验：加载动画、自动播放

## 🚀 使用方法

### ⚠️ 重要提示
**不能直接双击打开 `index.html`！** 必须通过HTTP服务器访问，否则会出现CORS跨域错误。

### 方法一：使用启动脚本（推荐）

1. 双击运行 `启动服务器.bat`（需要安装Python）
2. 浏览器会自动打开，或手动访问 `http://localhost:8000`
3. 开始使用！

### 方法二：使用Python命令行

```bash
# 在项目目录下运行
python -m http.server 8000

# 然后访问 http://localhost:8000
```

### 方法三：使用VSCode的Live Server

1. 安装VSCode扩展：Live Server
2. 右键点击 `index.html`
3. 选择"Open with Live Server"

### 方法四：使用Node.js

```bash
# 安装http-server
npm install -g http-server

# 在项目目录运行
http-server -p 8000

# 访问 http://localhost:8000
```

## 📁 文件结构

```
├── index.html          # 网页结构
├── style.css           # 样式文件
├── script.js           # 功能脚本
├── 启动服务器.bat      # Windows启动脚本
└── README.md           # 说明文档
```

## 🎯 使用说明

1. **搜索影视**
   - 在搜索框输入剧名（如"子夜归"、"二龙湖"）
   - 点击搜索或按回车键

2. **查看详情**
   - 点击搜索结果中的任意卡片
   - 查看详细信息、演员阵容等

3. **在线播放**
   - 在详情页选择想看的集数
   - 点击即可开始播放

4. **返回搜索**
   - 点击"返回搜索"按钮返回搜索结果

## 🛠️ 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **视频播放**: HLS.js（支持m3u8格式）
- **API**: 妖狐API (https://api.yaohud.cn)
- **CDN**: HLS.js CDN

## ⚠️ 常见问题

### Q: 视频无法播放？
A: 确保通过HTTP服务器访问，不要直接打开HTML文件。

### Q: 搜索无结果？
A: 尝试换个关键词，或检查网络连接。

### Q: API返回错误？
A: 可能是API密钥失效或请求限制，请联系API提供方。

### Q: Chrome打开显示CORS错误？
A: 必须使用本地服务器！参考上面的使用方法。

## 📞 支持

- API提供：妖狐API
- 交流群：1101215018

## 📝 License

仅供学习交流使用，请勿用于商业用途。

---

**Enjoy! 🎉**

