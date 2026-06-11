# PTCG 卡包商城期末專案

這是一個 PTCG 卡片商城網站，已加入真正的 Node.js/Express 後端與 SQLite 資料庫。前端保留原本的 HTML/CSS/JavaScript 頁面，會員註冊、登入、留言、訂單、管理員後台都會透過 API 寫入後端資料庫。

## 功能

- 商品瀏覽：單卡、卡盒、周邊、特別商品
- 商品搜尋與購物車
- 會員註冊、登入、登出
- 密碼使用 bcrypt 雜湊保存
- httpOnly Cookie Session 登入狀態
- 留言板資料寫入 SQLite
- 結帳訂單寫入 SQLite，後端重新計算金額與扣庫存
- 會員專區查詢自己的訂單
- 管理員後台查詢會員、訂單、總營收

## 啟動方式

請先確認 Node.js 版本為 22 以上。

```bash
npm install
npm start
```

啟動後開啟：

```text
http://localhost:3000/index.html
```

開發模式可使用：

```bash
npm run dev
```

## 測試帳號

管理員：

```text
admin@ptcg.com
admin123
```

一般會員：

```text
user@ptcg.com
user123
```

## 資料庫

專案啟動時會自動建立：

```text
data/app.db
```

主要資料表：

- `users`：會員資料與密碼雜湊
- `sessions`：登入 session
- `products`：商品資料與庫存
- `messages`：留言板
- `orders`：訂單主檔
- `order_items`：訂單明細
- `site_stats`：網站統計

## API 摘要

- `GET /api/health`：健康檢查
- `GET /api/stats`：網站統計
- `GET /api/products`：商品列表，可帶 `category` 或 `search`
- `POST /api/auth/register`：會員註冊
- `POST /api/auth/login`：會員登入
- `POST /api/auth/logout`：登出
- `GET /api/auth/me`：取得目前登入者
- `GET /api/messages`：留言列表
- `POST /api/messages`：新增留言
- `POST /api/orders`：建立訂單
- `GET /api/orders/me`：會員自己的訂單
- `GET /api/admin/users`：管理員會員列表
- `GET /api/admin/orders`：管理員訂單列表
- `GET /api/admin/summary`：管理員統計

## 檢查指令

```bash
npm run check
```

這會檢查主要 JavaScript 檔案的語法。
