const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'app.db');
const SESSION_DAYS = 7;

fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA journal_mode = WAL');

const productsSeed = [
  { id: '1', name: '皮卡丘 (Pikachu) VMAX', price: 1500, stock: 10, image: 'image/c_img8.jpg', category: 'card', page: 'card1.html' },
  { id: '2', name: '噴火龍 (Charizard) ex', price: 1200, stock: 8, image: 'image/c_img7.jpg', category: 'card', page: 'card2.html' },
  { id: '3', name: '超夢 (Mewtwo) V', price: 1300, stock: 15, image: 'image/c_img6.png', category: 'card', page: 'card3.html' },
  { id: '4', name: '夢幻 (Mew) ex', price: 1400, stock: 12, image: 'image/c_img5.jpg', category: 'card', page: 'card4.html' },
  { id: '5', name: '烈空坐 (Rayquaza) VMAX', price: 1800, stock: 6, image: 'image/c_img4.webp', category: 'card', page: 'card5.html' },
  { id: '6', name: '耿鬼 (Gengar) V', price: 1100, stock: 20, image: 'image/c_img1.png', category: 'card', page: 'card6.html' },
  { id: '7', name: '路卡利歐 (Lucario) ex', price: 1600, stock: 9, image: 'image/c_img3.png', category: 'card', page: 'card7.html' },
  { id: '8', name: '伊布 (Eevee) 英雄', price: 2000, stock: 5, image: 'image/c_img2.jpg', category: 'card', page: 'card8.html' },
  { id: 'cb1', name: '劍盾 蒼響卡盒', price: 3500, stock: 15, image: 'image/cb_img1.jpg', category: 'cardbox', page: 'cb1.html' },
  { id: 'cb2', name: '朱紫 擴充包盒', price: 4200, stock: 12, image: 'image/cb_img2.png', category: 'cardbox', page: 'cb2.html' },
  { id: 'cb3', name: '天地萬物 頂級卡盒', price: 3800, stock: 8, image: 'image/cb_img3.png', category: 'cardbox', page: 'cb3.html' },
  { id: 'cb4', name: 'WPTCG卡盒', price: 2800, stock: 20, image: 'image/cb_img4.webp', category: 'cardbox', page: 'cb4.html' },
  { id: 'cb5', name: '伊布英雄 強化擴充包', price: 5500, stock: 6, image: 'image/cb_img5.jpg', category: 'cardbox', page: 'cb5.html' },
  { id: 'cb6', name: '雙璧戰士 卡盒', price: 3200, stock: 10, image: 'image/cb_img6.webp', category: 'cardbox', page: 'cb6.html' },
  { id: 'cb7', name: 'VMAX 絕頂卡盒', price: 4800, stock: 7, image: 'image/cb_img7.webp', category: 'cardbox', page: 'cb7.html' },
  { id: 'cb8', name: 'PTCG 25週年黃金盒', price: 6000, stock: 5, image: 'image/cb_img8.jpg', category: 'cardbox', page: 'cb8.html' },
  { id: 'cp1', name: '卡片保護套', price: 150, stock: 50, image: 'image/cp_img1.jpg', category: 'periphery', page: 'cp1.html' },
  { id: 'cp2', name: '卡片收納盒', price: 450, stock: 25, image: 'image/cp_img2.jpg', category: 'periphery', page: 'cp2.html' },
  { id: 'cp3', name: '卡片展示架', price: 450, stock: 15, image: 'image/cp_img3.jpg', category: 'periphery', page: 'cp3.html' },
  { id: 'cp4', name: '卡片收納本', price: 600, stock: 30, image: 'image/cp_img4.jpg', category: 'periphery', page: 'cp4.html' },
  { id: 'cp5', name: '清潔套件', price: 350, stock: 40, image: 'image/cp_img5_real.jpg', category: 'periphery', page: 'cp5.html' },
  { id: 'cs1', name: 'PSA10分銀包帽子莉莉艾', price: 33000, stock: 3, image: 'image/s1.jpg', category: 'special', page: 'cs1.html' },
  { id: 'cs2', name: 'BGS 10 Black Label Shiny Charizard Gx', price: 14999, stock: 2, image: 'image/s2.jpg', category: 'special', page: 'cs2.html' },
  { id: 'cs3', name: '日版BGS 黑10 寶可夢鑑定卡大黑噴噴火龍Vmax ssr', price: 21370, stock: 1, image: 'image/s3.jpg', category: 'special', page: 'cs3.html' },
  { id: 'cs4', name: '寶可夢PTCG日文版PSA10分 CGC黑10橫濱皮卡丘 鑑定卡', price: 27000, stock: 1, image: 'image/s4.jpg', category: 'special', page: 'cs4.html' },
  { id: 'cs5', name: 'BGS 稀有鑑定卡 萊希拉姆 & 噴火龍GX Tag Team HR 彩虹卡 中文版 雙倍爆擊 10分', price: 30000, stock: 1, image: 'image/s5.jpg', category: 'special', page: 'cs5.html' }
];

const couponDiscounts = new Map([
  ['WELCOME10', 100],
  ['SAVE200', 200],
  ['PTCG2024', 150],
  ['FIRST', 300],
  ['VIP50', 50],
  ['CARD100', 100]
]);

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      birthday TEXT,
      address TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      avatar TEXT,
      agree_newsletter INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      stock INTEGER NOT NULL CHECK (stock >= 0),
      image TEXT,
      category TEXT NOT NULL,
      page TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      delivery TEXT NOT NULL,
      payment TEXT NOT NULL,
      coupon TEXT,
      note TEXT,
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER NOT NULL,
      discount_amount INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT '處理中',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      image TEXT,
      unit_price INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      subtotal INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS site_stats (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

function seedData() {
  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, price, stock, image, category, page)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      price = excluded.price,
      image = excluded.image,
      category = excluded.category,
      page = excluded.page
  `);
  for (const product of productsSeed) {
    insertProduct.run(product.id, product.name, product.price, product.stock, product.image, product.category, product.page);
  }

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, avatar, phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const adminHash = bcrypt.hashSync('admin123', 12);
  const userHash = bcrypt.hashSync('user123', 12);
  insertUser.run('系統管理員', 'admin@ptcg.com', adminHash, 'admin', 'image/admin-avatar.png', '0900000000', '後台管理');
  insertUser.run('PTCG玩家', 'user@ptcg.com', userHash, 'user', 'image/user-avatar.png', '0912345678', '台北市信義區');

  const messageCount = db.prepare('SELECT COUNT(*) AS count FROM messages').get().count;
  if (messageCount === 0) {
    const insertMessage = db.prepare('INSERT INTO messages (user_name, content, created_at) VALUES (?, ?, ?)');
    insertMessage.run('小明', '這個網站的卡片質量很好！', '2024-01-15T10:00:00.000Z');
    insertMessage.run('小華', '配送速度很快，包裝也很仔細', '2024-01-14T10:00:00.000Z');
    insertMessage.run('小李', '客服態度很好，解決問題很快', '2024-01-13T10:00:00.000Z');
  }

  db.prepare('INSERT OR IGNORE INTO site_stats (key, value) VALUES (?, ?)').run('visit_count', '0');
  db.prepare('INSERT OR IGNORE INTO site_stats (key, value) VALUES (?, ?)').run('last_visit', '');
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    birthday: user.birthday || '',
    address: user.address || '',
    role: user.role,
    avatar: user.avatar || 'image/default-avatar.png',
    joinDate: user.created_at,
    username: user.name
  };
}

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map((part) => {
    const [rawKey, ...rawValue] = part.trim().split('=');
    if (!rawKey) return null;
    return [rawKey, decodeURIComponent(rawValue.join('='))];
  }).filter(Boolean));
}

function setSessionCookie(res, sessionId, expiresAt) {
  const expires = new Date(expiresAt).toUTCString();
  res.setHeader('Set-Cookie', [
    `ptcg_session=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expires}`
  ]);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'ptcg_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

function getSessionUser(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionId = cookies.ptcg_session;
  if (!sessionId) return null;

  const row = db.prepare(`
    SELECT u.*
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND datetime(s.expires_at) > datetime('now')
  `).get(sessionId);

  if (!row) return null;
  return row;
}

function requireAuth(req, res, next) {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: '請先登入' });
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = getSessionUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理員權限' });
  }
  req.user = user;
  next();
}

function normalizeOrder(row) {
  const items = db.prepare(`
    SELECT product_id AS productId, product_id AS id, product_name AS name, image, unit_price AS price, quantity, subtotal
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
  `).all(row.id);

  return {
    id: row.id,
    userId: row.user_id || 'guest',
    customerName: row.customer_name,
    customerInfo: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.customer_address
    },
    delivery: row.delivery,
    payment: row.payment,
    coupon: row.coupon || '',
    note: row.note || '',
    subtotal: row.subtotal,
    shippingFee: row.shipping_fee,
    discountAmount: row.discount_amount,
    totalAmount: row.total_amount,
    totalAmountText: `NT$ ${Number(row.total_amount).toLocaleString()}`,
    status: row.status,
    orderDate: row.created_at,
    items
  };
}

function buildOrderId() {
  const suffix = Date.now().toString().slice(-8);
  const random = crypto.randomInt(100, 999);
  return `PTCG${suffix}${random}`;
}

function getShippingFee(delivery) {
  if (delivery === 'store') return 60;
  if (delivery === 'self') return 0;
  return 100;
}

function getDiscount(coupon) {
  if (!coupon) return 0;
  return couponDiscounts.get(String(coupon).trim().toUpperCase()) || 0;
}

initSchema();
seedData();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: DB_PATH });
});

app.get('/api/stats', (req, res) => {
  const visitRow = db.prepare('SELECT value FROM site_stats WHERE key = ?').get('visit_count');
  const nextVisitCount = Number(visitRow?.value || 0) + 1;
  const lastVisit = new Date().toISOString();
  db.prepare('UPDATE site_stats SET value = ? WHERE key = ?').run(String(nextVisitCount), 'visit_count');
  db.prepare('UPDATE site_stats SET value = ? WHERE key = ?').run(lastVisit, 'last_visit');

  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  const memberCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const messageCount = db.prepare('SELECT COUNT(*) AS count FROM messages').get().count;

  res.json({ visitCount: nextVisitCount, lastVisit, productCount, memberCount, messageCount });
});

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT id, name, price, stock, image, category, page FROM products';
  const where = [];
  const params = [];

  if (category) {
    where.push('category = ?');
    params.push(String(category));
  }
  if (search) {
    where.push('name LIKE ?');
    params.push(`%${String(search).trim()}%`);
  }
  if (where.length) sql += ` WHERE ${where.join(' AND ')}`;
  sql += ' ORDER BY category, id';

  res.json({ products: db.prepare(sql).all(...params) });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT id, name, price, stock, image, category, page FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: '找不到商品' });
  res.json({ product });
});

app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, name, email, password, phone, birthday, address, agreeNewsletter } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanName = String(name || `${firstName || ''} ${lastName || ''}`).trim();

  if (!cleanName || !cleanEmail || !password) {
    return res.status(400).json({ error: '姓名、電子郵件與密碼皆為必填' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: '電子郵件格式不正確' });
  }
  if (String(password).length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({ error: '密碼至少8個字元，且需包含英文字母與數字' });
  }

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (exists) return res.status(409).json({ error: '此電子郵件已被註冊' });

  const passwordHash = await bcrypt.hash(String(password), 12);
  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, phone, birthday, address, role, avatar, agree_newsletter)
    VALUES (?, ?, ?, ?, ?, ?, 'user', 'image/default-avatar.png', ?)
  `).run(cleanName, cleanEmail, passwordHash, phone || '', birthday || '', address || '', agreeNewsletter ? 1 : 0);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ user: publicUser(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: '電子郵件或密碼錯誤' });
  }

  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(sessionId, user.id, expiresAt);
  setSessionCookie(res, sessionId, expiresAt);
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = parseCookies(req.headers.cookie || '').ptcg_session;
  if (sessionId) db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const user = getSessionUser(req);
  res.json({ user: publicUser(user) });
});

app.get('/api/messages', (req, res) => {
  const messages = db.prepare(`
    SELECT id, user_name AS user, content, created_at AS date
    FROM messages
    ORDER BY datetime(created_at) DESC
  `).all();
  res.json({ messages });
});

app.post('/api/messages', (req, res) => {
  const userName = String(req.body.userName || req.body.user || '').trim();
  const content = String(req.body.content || '').trim();
  if (!userName || !content) return res.status(400).json({ error: '姓名與留言內容皆為必填' });
  if (userName.length > 50) return res.status(400).json({ error: '姓名不可超過50字' });
  if (content.length > 500) return res.status(400).json({ error: '留言內容不可超過500字' });

  const result = db.prepare('INSERT INTO messages (user_name, content) VALUES (?, ?)').run(userName, content);
  const message = db.prepare('SELECT id, user_name AS user, content, created_at AS date FROM messages WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ message });
});

app.post('/api/orders', (req, res) => {
  const user = getSessionUser(req);
  const { customerInfo = {}, delivery = 'home', payment = 'credit', coupon = '', note = '', items = [] } = req.body;
  const customerName = String(customerInfo.name || '').trim();
  const customerPhone = String(customerInfo.phone || '').trim();
  const customerEmail = String(customerInfo.email || '').trim();
  const customerAddress = String(customerInfo.address || '').trim();

  if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
    return res.status(400).json({ error: '收件資訊不完整' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '購物車是空的' });
  }

  try {
    db.exec('BEGIN IMMEDIATE');

    const normalizedItems = items.map((item) => {
      const productId = String(item.id || item.productId || '');
      const quantity = Number.parseInt(item.quantity, 10);
      const product = db.prepare('SELECT id, name, price, stock, image FROM products WHERE id = ?').get(productId);
      if (!product) throw new Error(`找不到商品：${productId}`);
      if (!Number.isInteger(quantity) || quantity <= 0) throw new Error(`商品數量不正確：${product.name}`);
      if (product.stock < quantity) throw new Error(`${product.name} 庫存不足，目前剩 ${product.stock}`);
      return { ...product, quantity, subtotal: product.price * quantity };
    });

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingFee = getShippingFee(delivery);
    const discountAmount = Math.min(getDiscount(coupon), subtotal + shippingFee);
    const totalAmount = subtotal + shippingFee - discountAmount;
    const orderId = buildOrderId();

    db.prepare(`
      INSERT INTO orders (
        id, user_id, customer_name, customer_phone, customer_email, customer_address,
        delivery, payment, coupon, note, subtotal, shipping_fee, discount_amount, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      user?.id || null,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      delivery,
      payment,
      String(coupon || '').trim().toUpperCase(),
      String(note || '').trim(),
      subtotal,
      shippingFee,
      discountAmount,
      totalAmount
    );

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, image, unit_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
    for (const item of normalizedItems) {
      insertItem.run(orderId, item.id, item.name, item.image, item.price, item.quantity, item.subtotal);
      updateStock.run(item.quantity, item.id);
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const savedOrder = normalizeOrder(order);
    db.exec('COMMIT');
    res.status(201).json({ order: savedOrder });
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch (_) {
      // Ignore rollback errors when the transaction never started.
    }
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/orders/me', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY datetime(created_at) DESC').all(req.user.id);
  res.json({ orders: rows.map(normalizeOrder) });
});

app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT id, name, email, phone, birthday, address, role, avatar, created_at AS joinDate
    FROM users
    ORDER BY datetime(created_at) DESC
  `).all();
  res.json({ users });
});

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY datetime(created_at) DESC').all();
  res.json({ orders: rows.map(normalizeOrder) });
});

app.get('/api/admin/summary', requireAdmin, (req, res) => {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const totalOrders = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders').get().total;
  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  res.json({ userCount, totalOrders, totalRevenue, productCount });
});

app.use(express.static(__dirname, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API 不存在' });
  }
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PTCG backend running at http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
});
