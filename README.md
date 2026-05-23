# DB996 Blog

本项目基于 XinghuisamaBlogs 进行二次魔改，仅用于个人学习与非商业用途。

## 原项目

- 原项目名称：XinghuisamaBlogs
- 原作者：heiehiehi
- 原项目地址：https://github.com/heiehiehi/XinghuisamaBlogs
- 原站参考：https://www.xinghuisama.top/

## 魔改说明

本项目在原项目基础上进行了以下修改：

1. 删除顶部菜单“杂谈”
2. 在“项目”后新增“资源”菜单
3. 新增“资源”页面，用于展示常用网站、工具站、资源站、AI 工具、设计工具和开发工具
4. 新增资源管理功能，可添加、编辑、删除资源，并维护分类、排序、简介和 Logo
5. 支持资源网站 Logo 自动获取：优先使用手动 Logo，其次使用网站 favicon，最后使用默认图标
6. 在首页底部加入基于 XinghuisamaBlogs 二次魔改的署名与非商业说明
7. 保留原项目 Next.js 技术栈、整体结构、本地控制台和 Vercel 部署方式
8. 音乐模块支持网易云歌单 ID / 链接批量导入
9. 新增前台登录入口、游客登录与登录后评论，评论数据保存在浏览器 localStorage
10. 预留 GitHub 登录入口与环境变量说明

## 目录说明

- `XHBlogs/`：前台博客项目，用于 Vercel 部署
- `my-blog-manager/`：本地控制台项目，用于管理文章、配置、图库、友链、项目和资源
- `my-blog-manager/cms_core/`：本地 Python API，用于把控制台修改写入本地文件

## 使用说明

### 安装依赖

前台博客：

```bash
cd XHBlogs
npm install
```

本地控制台：

```bash
cd my-blog-manager
npm install
```

### 启动本地项目

前台博客：

```bash
cd XHBlogs
npm run dev
```

本地控制台：

```bash
cd my-blog-manager
npm run dev
```

如果使用原项目的桌面控制台启动方式，也可以运行：

```bash
cd my-blog-manager
Start.bat
```

### 使用控制台添加资源

1. 打开本地控制台
2. 进入顶部菜单“资源”
3. 点击“添加资源”
4. 填写网站名称、网站链接、简介、分类、Logo 和排序
5. Logo 可留空，系统会按网站链接自动尝试获取 favicon
6. 保存后点击右上角队列按钮，再点击“更新本地”
7. 如需同步到前台项目，继续使用控制台原有“同步 Blog”功能

### 导入网易云歌单

1. 打开本地控制台
2. 进入“设置”中的“音乐播放设置”
3. 在“网易云歌单批量导入”处输入歌单 ID 或歌单链接
4. 点击“导入歌单歌曲”
5. 控制台会显示成功数量、重复数量和失败数量
6. 确认列表无误后点击“暂存音乐修改”，再点击右上角队列的“更新本地”

### 游客登录与评论

前台导航栏和评论区都提供登录入口。评论区未登录时会显示“请先登录后再评论”。游客只需要输入昵称即可登录，身份信息保存在浏览器 localStorage 中，刷新页面后仍会保持登录状态。

游客评论会显示：

- 昵称
- 默认头像
- 登录类型：游客
- 评论内容
- 评论时间

评论内容按纯文本渲染，并过滤危险 HTML 字符，避免插入脚本。

### GitHub 登录配置

当前已预留 GitHub 登录入口。后续接入 OAuth 时需要准备以下环境变量：

```text
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_REDIRECT_URI=
```

### 部署到 Vercel

保持原项目部署方式不变：

1. 将 `XHBlogs/` 作为 Vercel 项目根目录
2. 安装命令使用 `npm install`
3. 构建命令使用 `npm run build`
4. 输出目录沿用 Next.js 默认配置

## 开发过程记录

- 2026-05-23：拉取 XinghuisamaBlogs 原项目源码
- 2026-05-23：新增 `data/resources.ts` 资源数据文件
- 2026-05-23：新增前台 `/resources` 资源页面
- 2026-05-23：新增控制台 `/resources` 资源管理页面
- 2026-05-23：新增资源同步 API `/api/resources/sync`
- 2026-05-23：更新顶部导航，删除“杂谈”，新增“资源”
- 2026-05-23：更新同步白名单，使资源数据可从控制台同步到前台
- 2026-05-23：添加网站底部魔改声明
- 2026-05-23：新增网易云歌单批量导入
- 2026-05-23：新增游客登录与 localStorage 评论
- 2026-05-23：预留 GitHub 登录入口与配置说明

## 后续计划

1. GitHub OAuth 登录回调与用户信息获取
2. 将评论从 localStorage 升级为可选的远程存储
3. 继续优化移动端资源卡片交互
4. 增强网易云歌单接口的容错与备用解析源

## 非商业声明

本站基于 XinghuisamaBlogs 进行二次魔改，仅用于个人学习、研究和非商业用途。

原项目作者：heiehiehi

原项目地址：https://github.com/heiehiehi/XinghuisamaBlogs
