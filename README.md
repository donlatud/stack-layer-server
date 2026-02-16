# Stack Layer Server

Backend API สำหรับแพลตฟอร์มบล็อก **Stack Layer** — REST API ที่ให้บริการบทความ, ผู้ใช้, ความคิดเห็น, likes และ notifications

---

## ภาพรวม

| รายการ | รายละเอียด |
|--------|-------------|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express 5 |
| **Database** | PostgreSQL |
| **Auth** | Supabase (JWT) |
| **Storage** | Supabase Storage (รูปภาพ) |

---

## โครงสร้างโปรเจกต์

```
src/
├── app.mjs                 # Entry point, กำหนด routes
├── controllers/            # Request handlers
├── middleware/             # protectUser, protectAdmin, upload, validation
├── models/                 # กำหนด schema (posts, users, comments, likes, categories)
├── repositories/           # Database queries
├── routes/                 # Express routes
├── services/               # Business logic
└── utils/                  # db (Pool), supabase
```

---

## API Endpoints

### Public
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/posts` | รายการบทความ (pagination, filter) |
| GET | `/posts/:postId` | รายละเอียดบทความ |
| GET | `/categories` | รายการหมวดหมู่ |
| GET | `/posts/:postId/comments` | ความคิดเห็นของบทความ |

### Auth
| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/auth/register` | สมัครสมาชิก |
| POST | `/auth/login` | ล็อกอิน |
| GET | `/auth/get-user` | ดึงข้อมูล user (Bearer token) |
| PATCH | `/auth/profile` | อัปเดตโปรไฟล์ (รูป, ชื่อ) |
| PUT | `/auth/reset-password` | เปลี่ยนรหัสผ่าน |

### Protected (ต้อง Bearer token)
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/notifications` | รายการ notifications (comments, likes, published) |
| POST | `/posts/:postId/comments` | สร้าง comment |
| DELETE | `/comments/:commentId` | ลบ comment |
| POST | `/posts/:postId/like` | กด Like |
| DELETE | `/posts/:postId/like` | ยกเลิก Like |

### Admin only (role = admin)
| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/posts` | สร้างบทความ |
| PUT | `/posts/:postId` | แก้ไขบทความ |
| DELETE | `/posts/:postId` | ลบบทความ |

---

## การเริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env`:

```env
PORT=4000
CONNECTION_STRING=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. รัน Server

```bash
npm start
```

Server จะรันที่ `http://localhost:4000`

---

## Database Tables

- **users** — ผู้ใช้ (id, username, name, profile_pic, role)
- **posts** — บทความ (id, title, image, category_id, description, content, status_id)
- **categories** — หมวดหมู่
- **comments** — ความคิดเห็น (post_id, user_id, comment_text)
- **likes** — การกด Like (post_id, user_id)

---

## การเชื่อมต่อกับ Frontend

Frontend (`stack-layer`) ใช้ `VITE_API_BASE_URL` ชี้ไปที่ backend เช่น:

```
VITE_API_BASE_URL=http://localhost:4000
```
