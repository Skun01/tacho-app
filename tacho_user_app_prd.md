# Tacho — User App: Product Spec & API Contract

> **Phạm vi tài liệu:** Ứng dụng học tiếng Nhật (User App) tại `learning-app/`.  
> Đây là app dành cho **end-user** (role `user`, `editor`, `admin` đều dùng được).  
> Admin App (editor/admin-only features) được mô tả trong tài liệu riêng.

---

## Mục lục

1. [Kiến trúc tổng quan](#1-kiến-trúc-tổng-quan)
2. [User Roles](#2-user-roles)
3. [Authentication & Session](#3-authentication--session)
4. [Chức năng từng module](#4-chức-năng-từng-module)
5. [API Contract](#5-api-contract)
6. [Data Models (Frontend Types)](#6-data-models-frontend-types)
7. [SRS & Mastery System](#7-srs--mastery-system)
8. [Routing](#8-routing)
9. [Error Codes](#9-error-codes)

---

## 1. Kiến trúc tổng quan

```
┌─────────────────────────────────────┐    ┌──────────────────────────┐
│  User App  (learning-app)           │    │  Admin App  (tacho-admin) │
│  React + Vite + TypeScript          │    │  React + Vite + TypeScript│
│  Dành cho tất cả role               │    │  Chỉ dành cho editor/admin│
└────────────────┬────────────────────┘    └───────────┬──────────────┘
                 │                                     │
                 └──────────────┬──────────────────────┘
                                │  REST API  /api/*
                       ┌────────▼────────┐
                       │  Backend (NestJS │
                       │  / Express / ...)│
                       └────────┬────────┘
                                │
                       ┌────────▼────────┐
                       │  SQL DB   │
                       └─────────────────┘
```

### Luồng học tập chính

```
Login → Dashboard
  ├─ [Học mới]   → Study (xem thẻ) → Quiz → Kết quả
  └─ [Ôn tập]    → Quiz → Kết quả
```

---

## 2. User Roles

Ba role được lưu trong cột `users.role`. **User App không phân biệt quyền theo role** — tất cả trải nghiệm như nhau. Role chỉ ảnh hưởng đến Admin App.

| Role     | Mô tả                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------- |
| `user`   | Mặc định khi đăng ký. Toàn quyền dùng User App.                                                    |
| `editor` | Giống `user` trong User App. Thêm quyền quản lý nội dung (card, deck, example...) trong Admin App. |
| `admin`  | Giống `editor`. Thêm quyền quản lý user (ban, gán role, xem danh sách) trong Admin App.            |

> **Gán role:** Không tự đăng ký được role `editor`/`admin`. Chỉ admin gán qua Admin App.

### `role` trong JWT payload

Backend đính kèm `role` vào access token để frontend (cả 2 app) có thể đọc mà không cần gọi thêm API:

```jsonc
// JWT payload
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "user", // "user" | "editor" | "admin"
  "iat": 1700000000,
  "exp": 1700000900,
}
```

---

## 3. Authentication & Session

| Loại token    | Tên    | Nơi lưu                                                  | Thời hạn |
| ------------- | ------ | -------------------------------------------------------- | -------- |
| Access Token  | JWT    | **In-memory (Zustand)** — KHÔNG dùng localStorage        | 15 phút  |
| Refresh Token | opaque | **HttpOnly cookie** (`refreshToken`) — JS không đọc được | 30 ngày  |

### Auto-refresh flow

```
Request → 401 → interceptor gọi POST /api/auth/refresh
  ├─ Thành công → lưu token mới vào Zustand, retry tất cả queued requests
  └─ Thất bại   → logout, redirect /login
```

> Đã implement ở `src/services/setupInterceptors.ts`. Gọi `setupInterceptors()` trong `main.tsx` trước khi React render.

---

## 4. Chức năng từng module

### 4.1 Auth

| Chức năng       | Mô tả                                                |
| --------------- | ---------------------------------------------------- |
| Đăng ký         | Email + password (min 8 ký tự) + displayName         |
| Đăng nhập       | Email + password → accessToken + refreshToken cookie |
| Refresh token   | Tự động — dùng cookie, không cần thao tác thủ công   |
| Logout          | Xóa cookie phía server + clear Zustand               |
| Quên mật khẩu   | Gửi link reset qua email (token hết hạn sau 1 giờ)   |
| Reset mật khẩu  | Nhập password mới qua link email                     |
| Đổi mật khẩu    | Nhập mật khẩu cũ + mới (trong Settings)              |
| Đổi displayName | Cập nhật tên hiển thị (trong Settings)               |

---

### 4.2 Dashboard

**Hiển thị tổng quan tình trạng học tập hôm nay:**

| Thành phần          | Mô tả                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Learn card**      | Số thẻ mới cần học hôm nay (theo `dailyNewCards`), progress bar, danh sách deck có thẻ mới, nút `Cài đặt học` |
| **Review card**     | Tổng thẻ cần ôn (SRS due), phân breakdown vocab/grammar, nút expand từng deck                                 |
| **Forecast chart**  | Biểu đồ 7 ngày tới: số thẻ sẽ đến hạn ôn mỗi ngày                                                             |
| **Activity chart**  | Biểu đồ 30 ngày: số vocab/grammar đã review mỗi ngày                                                          |
| **Streak calendar** | 13 tuần gần nhất (91 ngày), đánh dấu ngày có hoạt động                                                        |
| **JLPT progress**   | Tiến trình N5–N1, tab: Từ vựng / Ngữ pháp / Cả hai                                                            |

**Navigation từ dashboard:**

- Nút "Học thẻ mới" → `/study` với `batchIds` từ `learn.batchIds`
- Nút "Ôn tập" → `/quiz` với `batchIds` từ `review.batchIds`
- Có thể navigate từng deck riêng lẻ

---

### 4.3 Library (Thư viện)

**4 tab:**

| Tab            | Source      | Điều kiện                                        |
| -------------- | ----------- | ------------------------------------------------ |
| Bộ thẻ của tôi | `user`      | `owner_id = current_user` HOẶC `is_saved = true` |
| Bộ thẻ của app | `app`       | `owner_id IS NULL`                               |
| Sách giáo khoa | `textbook`  | `textbook IS NOT NULL`                           |
| Cộng đồng      | `community` | `is_public = true`, không phải của mình          |

**Tính năng mỗi deck:**

| Tính năng                            | Điều kiện       |
| ------------------------------------ | --------------- |
| Xem danh sách thẻ                    | Tất cả          |
| Bookmark (`isBookmarked`)            | Tất cả (toggle) |
| Lưu vào thư viện (`isSaved`)         | Tất cả (toggle) |
| Thêm vào review queue (`isInReview`) | Tất cả (toggle) |
| Clone deck                           | Tất cả          |
| Sửa tên/mô tả/danh mục/ảnh bìa       | Chỉ owner       |
| Thêm/xóa thẻ (từ kho app)            | Chỉ owner       |
| Kéo thả sắp xếp thứ tự thẻ           | Chỉ owner       |
| Xóa deck                             | Chỉ owner       |

> Tối đa **1000 thẻ/deck** (enforce ở application layer).

---

### 4.4 Search (Tìm kiếm)

- Tìm theo từ khóa: `content`, `reading`, `meaning` (full-text, debounce 300ms)
- Lọc theo loại: Tất cả / Vocab / Grammar
- Lọc theo JLPT: N5, N4, N3, N2, N1 (multi-select)
- **Select mode:** chọn nhiều thẻ → thêm vào deck cụ thể hoặc bắt đầu Study ngay
- Thao tác từng thẻ: đánh dấu "thuộc", save, thêm vào deck, reset tiến trình, thêm vào review

---

### 4.5 Card Detail

Thông tin đầy đủ của 1 thẻ:

**Vocab card:**

- Pitch accent + furigana + audio phát âm
- Dictionary entries (loại từ → danh sách nghĩa)
- Câu ví dụ (có thể có audio)
- Tiến trình SRS của user (masteryStage, nextReviewAt...)
- Ghi chú cá nhân (CRUD)
- Bình luận (phân trang 5/page, like, reply)

**Grammar card:**

- Cấu trúc đầy đủ, biến thể trang trọng, văn phong
- Giải thích chi tiết (Markdown)
- Ví dụ trong phần "Về cấu trúc"
- Antonyms + Related structures
- Nguồn tham khảo
- Ghi chú, tiến trình, bình luận (giống vocab)

---

### 4.6 Study (Học thẻ)

- Nhận `batchIds` (từ Dashboard hoặc Search)
- Duyệt tuần tự prev/next, animation fade
- Có thể navigate bằng phím ← →
- Progress bar phía trên
- Nút "Bắt đầu bài tập" ở thẻ cuối → navigate sang `/quiz/config` với `batchIds` + `mode`
- Nút thoát → navigate về trang trước

---

### 4.7 Quiz

**4 dạng bài:**

| Type | Tên         | Mô tả                                         | Mastery range gợi ý |
| ---- | ----------- | --------------------------------------------- | ------------------- |
| D    | Thẻ ghi nhớ | Lật thẻ, tự đánh giá Đã nhớ / Chưa nhớ        | 0–2                 |
| A    | Điền từ     | Câu có `___`, gõ từ tiếng Nhật còn thiếu      | 3–5                 |
| C    | Trắc nghiệm | Nghe audio/đọc từ → chọn 1/4 nghĩa tiếng Việt | 6–9                 |
| B    | Nghe & điền | Nghe audio câu ví dụ → gõ lại toàn bộ         | 10+                 |

**Luồng quiz:**

```
POST /quiz/batch → nhận danh sách câu hỏi & masteryMap
  → Làm từng câu
    ├─ Đúng: masteryAfter = min(14, before + 1)
    └─ Sai: masteryAfter = max(0, before - 2), thêm lại vào cuối queue
  → Hết queue
    → POST /cards/progress/batch (commit tất cả thay đổi)
    → Navigate sang /quiz/result
```

**Controls trong quiz:**

- `Space` — lật thẻ (TypeD) / kiểm tra đáp án (A/B/C)
- `Enter` — câu tiếp theo
- Mũi tên — chọn đáp án (TypeC)
- `Z` — hoàn tác (chỉ A/B/C)
- `S` — xem đáp án
- Nút "Xem thông tin thẻ" — mở panel card detail inline

**Quiz Config** (`/quiz/config`): Chọn quiz type trước khi bắt đầu.

**Quiz Result** (`/quiz/result`):

- Accuracy %, số đúng / sai
- Grade: S / A / B / C / D
- Danh sách thẻ với mastery before → after
- Nút "Tiếp tục học" hoặc "Về trang chủ"

---

### 4.8 Profile

- Thông tin user (tên, email, ngày tham gia, avatar)
- Số ngày học, streak hiện tại, tổng vocab/grammar đã học
- Streak calendar (13 tuần)
- JLPT progress breakdown (N5 → N1)

---

### 4.9 Settings

| Cài đặt                                          | Mô tả                            | Backend                           |
| ------------------------------------------------ | -------------------------------- | --------------------------------- |
| Số thẻ mới mỗi ngày (`dailyNewCards`)            | Default 20, range 1–200          | `PATCH /api/users/me/settings`    |
| Số thẻ tối đa mỗi session (`maxCardsPerSession`) | Default 40, luôn ≤ dailyNewCards | `PATCH /api/users/me/settings`    |
| Đổi tên hiển thị                                 |                                  | `PATCH /api/auth/me/display-name` |
| Đổi mật khẩu                                     | Xác nhận mật khẩu cũ             | `PATCH /api/auth/me/password`     |
| Chủ đề giao diện                                 | Light / Dark / Theo thiết bị     | Client-only (Zustand + CSS var)   |

---

### 4.10 Notifications (Thông báo)

**UI:**
- **Bell icon** ở header với badge số chưa đọc (`unreadCount`)
- Click → dropdown panel hiển thị 20 thông báo gần nhất
- Click từng thông báo → navigate đến resource liên quan + đánh dấu đã đọc
- Nút "Đánh dấu tất cả đã đọc"
- Link "Xem tất cả" → `/notifications` (trang đầy đủ với phân trang)

**Delivery mechanism (MVP — Polling):**
```
Frontend poll GET /notifications/unread-count mỗi 60 giây
  → badge cập nhật nếu count thay đổi
  → khi mở dropdown: GET /notifications?page=1&pageSize=20
```
> *Future upgrade: thay bằng SSE (`GET /notifications/stream`) hoặc WebSocket để real-time.*

**Loại thông báo & điều hướng:**

| Type | Tiêu đề ví dụ | Navigate đến | Trigger |
| ---- | ------------- | ------------ | ------- |
| `review_reminder` | "Bạn có 34 thẻ cần ôn hôm nay" | `/dashboard` | Cron 08:00 hàng ngày |
| `streak_warning` | "Học ngay để giữ streak 7 ngày!" | `/dashboard` | Cron 20:00 nếu chưa học |
| `milestone` | "Bạn vừa học được 100 thẻ!" | `/profile` | Sau `POST /cards/progress/batch` |
| `card_burned` | "学校 vừa đạt Burned!" | `/card/:id` | Sau `POST /cards/progress/batch` |
| `comment_reply` | "Trần B đã trả lời bình luận của bạn" | `/card/:cardId` | Sau `POST /comments/:id/replies` |
| `comment_like` | "Nguyễn A đã thích bình luận của bạn" | `/card/:cardId` | Sau `POST /comments/:id/like` |
| `deck_cloned` | "Ai đó vừa clone deck N5 của bạn" | `/deck/:id` | Sau `POST /decks/:id/clone` |
| `system` | "Tacho vừa thêm 50 thẻ N3 mới" | `/library` | Admin tạo qua Admin App |

**Cài đặt thông báo** (trong Settings tab riêng):
- Nhắc ôn tập hàng ngày — bật/tắt `review_reminder`
- Cảnh báo streak — bật/tắt `streak_warning`
- Mốc & thành tích — bật/tắt `milestone` + `card_burned`
- Mạng xã hội — bật/tắt `comment_reply` + `comment_like` + `deck_cloned`
- Hệ thống — bật/tắt `system`

---

## 5. API Contract

> **Base URL:** `/api`  
> **Auth header:** `Authorization: Bearer <accessToken>`  
> **Chuẩn response:**
>
> ```json
> { "code": 200, "success": true, "message": null, "data": { ... }, "metaData": null }
> ```

---

### 5.1 Auth

| Method | Endpoint                | Auth            | Mô tả                                    |
| ------ | ----------------------- | --------------- | ---------------------------------------- |
| POST   | `/auth/register`        | Public          | Đăng ký → trả accessToken + set cookie   |
| POST   | `/auth/login`           | Public          | Đăng nhập → trả accessToken + set cookie |
| POST   | `/auth/refresh`         | Cookie          | Làm mới accessToken                      |
| POST   | `/auth/logout`          | Bearer + Cookie | Xóa refreshToken                         |
| POST   | `/auth/forgot-password` | Public          | Gửi email reset                          |
| POST   | `/auth/reset-password`  | Public          | Đặt mật khẩu mới qua token               |
| GET    | `/auth/me`              | Bearer          | Thông tin user hiện tại                  |
| PATCH  | `/auth/me/display-name` | Bearer          | Đổi displayName                          |
| PATCH  | `/auth/me/password`     | Bearer          | Đổi mật khẩu                             |

#### `POST /auth/register`

```jsonc
// Request
{ "email": "user@example.com", "password": "min8chars", "displayName": "Nguyễn A" }

// Response 201
{ "data": { "accessToken": "eyJ...", "user": { "id", "email", "displayName", "role", "createdAt" } } }

// Errors
"EMAIL_ALREADY_EXISTS"
```

#### `POST /auth/login`

```jsonc
// Request
{ "email": "...", "password": "..." }

// Response 200 — set-cookie: refreshToken (HttpOnly)
{ "data": { "accessToken": "eyJ...", "user": { "id", "email", "displayName", "role", "createdAt" } } }

// Errors
"INVALID_CREDENTIALS", "USER_BANNED"
```

#### `GET /auth/me`

```jsonc
// Response 200
{ "data": { "id", "email", "displayName", "avatarUrl", "role", "createdAt" } }
```

---

### 5.2 Dashboard

| Method | Endpoint                 | Auth   | Mô tả                     |
| ------ | ------------------------ | ------ | ------------------------- |
| GET    | `/dashboard/summary`     | Bearer | Toàn bộ dữ liệu dashboard |
| GET    | `/dashboard/study-batch` | Bearer | Lấy batch IDs học/ôn      |

#### `GET /dashboard/summary`

```jsonc
// Response 200
{
  "data": {
    "learn": {
      "totalTarget": 20,
      "completedCount": 8,
      "batchIds": ["c1","c2",...],
      "decks": [{ "id", "name", "due": 5, "batchIds": [...] }]
    },
    "review": {
      "totalDue": 34,
      "vocab": 20,
      "grammar": 14,
      "batchIds": ["c5","c6",...]
    },
    "progress": {
      "vocab": [12, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],   // mastery 0–14
      "grammar": [8, 3, 1, 0, ...]
    },
    "personal": {
      "activity": [{ "date": "2026-03-29", "vocab": 15, "grammar": 5 },...], // 30 ngày
      "streakDays": 7,
      "streakCalendar": [{ "label": "T2", "active": true },...]  // 91 ngày
    },
    "jlpt": {
      "Từ vựng":  [{ "level": "N5", "current": 30, "total": 45 }, ...],
      "Ngữ pháp": [{ "level": "N5", "current": 10, "total": 20 }, ...],
      "Cả hai":   [...]
    }
  }
}
```

#### `GET /dashboard/study-batch?mode=learn|review`

```jsonc
// Response 200
{ "data": ["cardId1", "cardId2", ...] }
```

---

### 5.3 Cards

| Method | Endpoint                | Auth     | Mô tả                                  |
| ------ | ----------------------- | -------- | -------------------------------------- |
| GET    | `/cards`                | Optional | Tìm kiếm / lấy nhiều thẻ               |
| GET    | `/cards/:id`            | Optional | Thông tin cơ bản 1 thẻ                 |
| GET    | `/cards/:id/detail`     | Optional | Full detail (dict, examples, pitch...) |
| PATCH  | `/cards/:id/progress`   | Bearer   | Cập nhật tiến trình 1 thẻ              |
| POST   | `/cards/progress/batch` | Bearer   | Commit kết quả quiz                    |
| PUT    | `/cards/:id/user-note`  | Bearer   | Lưu/xóa ghi chú cá nhân                |

#### `GET /cards?q=&type=&jlpt=&ids=&page=&pageSize=`

```jsonc
// Response 200
{
  "data": [{
    "id": "c1", "type": "vocab", "jlptLevel": "N5",
    "content": "学校", "reading": "がっこう", "meaning": "trường học",
    "exampleSentence": "学校に行く。", "exampleMeaning": "Đi học.",
    "progress": { "masteryLevel": 3, "isInReview": true, "isSaved": false,
                  "nextReviewAt": "...", "lastReviewedAt": "..." }
  },...],
  "metaData": { "total": 100, "page": 1, "pageSize": 20 }
}
```

> `progress` chỉ có khi authenticated.

#### `PATCH /cards/:id/progress`

```jsonc
// Request (tất cả optional, chỉ gửi field cần thay đổi)
{ "masteryLevel": 4, "isInReview": true, "isSaved": false,
  "nextReviewAt": "2026-04-01T00:00:00Z" }

// Response 200
{ "data": FlashCardWithProgress }
```

#### `POST /cards/progress/batch`

```jsonc
// Request
{ "changes": [{ "cardId": "c1", "before": 3, "after": 4 }, ...] }

// Backend tính lại nextReviewAt theo SRS table từ giá trị "after"
// Response 200
{ "data": null }
```

#### `PUT /cards/:id/user-note`

```jsonc
// Request
{ "note": "Hay nhầm từ này với..." }  // note = "" để xóa

// Response 200
{ "data": null }
```

---

### 5.4 Quiz

| Method | Endpoint      | Auth   | Mô tả                            |
| ------ | ------------- | ------ | -------------------------------- |
| POST   | `/quiz/batch` | Bearer | Tạo câu hỏi từ danh sách cardIds |

#### `POST /quiz/batch`

```jsonc
// Request
{ "cardIds": ["c1","c2","c3"], "forceType": "A" }  // forceType optional

// Response 200
{
  "data": {
    "questions": [
      {
        "id": "q1", "cardId": "c1", "type": "A", "isRetry": false,
        "jlptLevel": "N5", "cardContent": "学校", "cardMeaning": "trường học",
        "cardReading": "がっこう",
        // TypeA
        "promptSentence": "___に行く。", "promptMeaning": "Đi ___",
        "promptKeyword": "trường học", "promptLabel": "...",
        "correctAnswer": "学校", "acceptedAnswers": ["学校","がっこう","gakkou"],
        // TypeB
        "exampleSentence": "...", "exampleAudioUrl": "...", "audioUrl": "...",
        // TypeC
        "choices": [{ "id": "ch1", "text": "trường học", "isCorrect": true }, ...],
        // TypeD — chỉ cần cardContent/cardMeaning/cardReading
      },...
    ],
    "masteryMap": { "c1": 3, "c2": 0, "c3": 7 }
  }
}
```

> **Logic chọn type tự động (khi không có `forceType`):**
>
> - mastery 0–2 → D | 3–5 → A | 6–9 → C | 10–14 → B

---

### 5.5 Decks

| Method | Endpoint                       | Auth           | Mô tả                                          |
| ------ | ------------------------------ | -------------- | ---------------------------------------------- |
| GET    | `/decks`                       | Bearer         | Danh sách decks (filter theo source, owner...) |
| GET    | `/decks/:id`                   | Bearer         | Chi tiết deck + danh sách thẻ                  |
| POST   | `/decks`                       | Bearer         | Tạo deck mới                                   |
| PATCH  | `/decks/:id`                   | Bearer (owner) | Sửa thông tin deck                             |
| DELETE | `/decks/:id`                   | Bearer (owner) | Xóa deck                                       |
| POST   | `/decks/:id/clone`             | Bearer         | Clone về thư viện cá nhân                      |
| POST   | `/decks/:id/cards`             | Bearer (owner) | Thêm thẻ vào deck                              |
| DELETE | `/decks/:deckId/cards/:cardId` | Bearer (owner) | Xóa thẻ khỏi deck                              |
| PUT    | `/decks/:id/cards/order`       | Bearer (owner) | Sắp xếp lại thứ tự thẻ                         |
| POST   | `/decks/:id/bookmark`          | Bearer         | Toggle bookmark                                |
| POST   | `/decks/:id/review`            | Bearer         | Toggle review queue                            |
| POST   | `/decks/:id/save`              | Bearer         | Toggle lưu vào thư viện                        |

#### `GET /decks?source=&category=&isOwner=&isInReview=&isSaved=&search=&page=&pageSize=`

```jsonc
// Response 200
{
  "data": [DeckListItem, ...],   // Deck + DeckUserState
  "metaData": { "total": 50, "page": 1, "pageSize": 20 }
}
```

#### `POST /decks`

```jsonc
// Request
{ "name": "N5 từ vựng", "description": "...", "category": "tu_vung",
  "isPublic": false, "coverUrl": "https://..." }

// Response 201
{ "data": DeckDetailWithState }
```

#### `POST /decks/:id/review`

```jsonc
// Request
{ "inReview": true }
// Backend trigger: cập nhật hàng loạt card_progress.is_in_review
// Response 200
{ "data": null }
```

---

### 5.6 Comments

| Method | Endpoint                                     | Auth                  | Mô tả                                   |
| ------ | -------------------------------------------- | --------------------- | --------------------------------------- |
| GET    | `/cards/:cardId/comments`                    | Bearer                | Danh sách bình luận (phân trang 5/page) |
| POST   | `/cards/:cardId/comments`                    | Bearer                | Đăng bình luận                          |
| DELETE | `/comments/:commentId`                       | Bearer (author/admin) | Xóa bình luận                           |
| POST   | `/comments/:commentId/like`                  | Bearer                | Toggle like                             |
| POST   | `/comments/:commentId/replies`               | Bearer                | Đăng reply                              |
| DELETE | `/comments/:commentId/replies/:replyId`      | Bearer (author/admin) | Xóa reply                               |
| POST   | `/comments/:commentId/replies/:replyId/like` | Bearer                | Toggle like reply                       |

#### `GET /cards/:cardId/comments?page=1&pageSize=5`

```jsonc
// Response 200
{
  "data": [{
    "id": "cm1", "cardId": "c1", "authorId": "u1",
    "authorName": "Nguyễn A", "authorAvatar": "...",
    "text": "Từ này hay quá!",
    "createdAt": "...", "likeCount": 3, "likedByMe": false,
    "replyCount": 2,
    "replies": [{
      "id": "rp1", "commentId": "cm1", "authorId": "u2",
      "authorName": "Trần B", "text": "Đồng ý!",
      "createdAt": "...", "likeCount": 1, "likedByMe": false
    }]
  },...],
  "metaData": { "total": 23, "page": 1, "pageSize": 5 }
}
```

---

### 5.7 User Settings

| Method | Endpoint             | Auth   | Mô tả            |
| ------ | -------------------- | ------ | ---------------- |
| GET    | `/users/me/settings` | Bearer | Lấy cài đặt SRS  |
| PATCH  | `/users/me/settings` | Bearer | Cập nhật cài đặt |

#### `GET /users/me/settings`

```jsonc
// Response 200
{ "data": { "dailyNewCards": 20, "maxCardsPerSession": 40 } }
```

#### `PATCH /users/me/settings`

```jsonc
// Request
{ "dailyNewCards": 30, "maxCardsPerSession": 50 }
// Constraint: maxCardsPerSession <= dailyNewCards (validate cả FE + BE)
// Response 200
{ "data": null }
```

---

### 5.8 Notifications

| Method | Endpoint                        | Auth   | Mô tả                               |
| ------ | ------------------------------- | ------ | ----------------------------------- |
| GET    | `/notifications`                | Bearer | Danh sách thông báo (phân trang)    |
| GET    | `/notifications/unread-count`   | Bearer | Số thông báo chưa đọc (cho badge)   |
| POST   | `/notifications/:id/read`       | Bearer | Đánh dấu 1 thông báo đã đọc        |
| POST   | `/notifications/read-all`       | Bearer | Đánh dấu tất cả đã đọc             |
| DELETE | `/notifications/:id`            | Bearer | Xóa 1 thông báo                    |
| GET    | `/users/me/notification-settings` | Bearer | Lấy cài đặt thông báo             |
| PATCH  | `/users/me/notification-settings` | Bearer | Cập nhật cài đặt thông báo        |

#### `GET /notifications?page=1&pageSize=20&type=&isRead=`

```jsonc
// Response 200
{
  "data": [
    {
      "id": "n1",
      "type": "review_reminder",
      "title": "Bạn có 34 thẻ cần ôn hôm nay",
      "body": "Đừng bỏ lỡ — ôn tập ngay để giữ đà học!",
      "data": { "dueCount": 34 },
      "isRead": false,
      "createdAt": "2026-03-29T01:00:00Z"
    },
    {
      "id": "n2",
      "type": "comment_reply",
      "title": "Trần B đã trả lời bình luận của bạn",
      "body": "\"Đồng ý với bạn!\"",
      "data": { "cardId": "c1", "cardContent": "学校", "commentId": "cm1", "replyAuthor": "Trần B" },
      "isRead": true,
      "createdAt": "2026-03-28T15:32:00Z"
    }
  ],
  "metaData": { "total": 47, "page": 1, "pageSize": 20 }
}
```

#### `GET /notifications/unread-count`

```jsonc
// Response 200
{ "data": { "count": 5 } }
```

#### `GET /users/me/notification-settings`

```jsonc
// Response 200
{
  "data": {
    "reviewReminder": true,
    "streakWarning": true,
    "milestone": true,
    "social": true,
    "system": true
  }
}
```

#### `PATCH /users/me/notification-settings`

```jsonc
// Request (tất cả optional)
{ "reviewReminder": false, "social": true }

// Response 200
{ "data": null }
```

---

## 6. Data Models (Frontend Types)

```typescript
// ─── User ───
interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: "user" | "editor" | "admin";
  createdAt: string;
}

// ─── Card (list / search) ───
interface FlashCard {
  id: string;
  type: "vocab" | "grammar";
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
  content: string;
  reading?: string; // vocab only
  meaning: string;
  exampleSentence?: string;
  exampleMeaning?: string;
}

interface CardProgress {
  masteryLevel: number; // 0–14
  isInReview: boolean;
  isSaved: boolean;
  nextReviewAt?: string;
  lastReviewedAt?: string;
}

interface FlashCardWithProgress extends FlashCard {
  progress?: CardProgress;
}

// ─── CardDetail ───
interface VocabCardDetail extends FlashCard {
  type: "vocab";
  pitchAccent?: string;
  pitchPattern?: number[];
  audioUrl?: string;
  dictionaryEntries: DictEntry[];
  examples: CardExample[];
  userNote?: string;
  userProgress?: CardProgressDetail;
}

interface GrammarCardDetail extends FlashCard {
  type: "grammar";
  structure: string;
  formalVariant?: string;
  register: "casual" | "standard" | "polite" | "formal";
  aboutText: string;
  antonyms: LinkedCard[];
  relatedStructures: LinkedCard[];
  references: ReferenceLink[];
  examples: CardExample[];
  aboutExamples?: CardExample[];
  userNote?: string;
  userProgress?: CardProgressDetail;
}

type CardDetail = VocabCardDetail | GrammarCardDetail;

interface DictEntry {
  partOfSpeech: string;
  definitions: string[];
}

interface CardExample {
  id: string;
  japaneseSentence: string;
  vietnameseMeaning: string;
  jlptLevel: JlptLevel;
  audioUrl?: string;
}

interface CardProgressDetail {
  masteryStage: number;
  firstLearnedAt: string;
  lastReviewedAt: string;
  nextReviewAt: string;
  reviewCount: number;
}

interface LinkedCard {
  id: string;
  content: string;
  meaning: string;
}

interface ReferenceLink {
  title: string;
  url: string;
}

// ─── Deck ───
type DeckCategory =
  | "mac_dinh"
  | "tu_vung"
  | "ngu_phap"
  | "anime"
  | "manga"
  | "am_nhac"
  | "tv"
  | "novel"
  | "game"
  | "sach_giao_khoa"
  | "khac";

interface Deck {
  id: string;
  name: string;
  description: string;
  category: DeckCategory;
  source: "user" | "app" | "community" | "textbook";
  coverIndex: number;
  coverUrl?: string;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  totalCards: number;
  vocabCount: number;
  grammarCount: number;
  userCount: number;
  textbook?: string;
  createdAt: string;
  updatedAt: string;
}

interface DeckUserState {
  isOwner: boolean;
  isBookmarked: boolean;
  isSaved: boolean;
  isInReview: boolean;
  learnedCards: number;
  reviewDue: number;
}

type DeckListItem = Deck & DeckUserState;

interface DeckDetailWithState extends DeckListItem {
  cards: FlashCard[];
}

// ─── Quiz ───
type QuizType = "A" | "B" | "C" | "D";

interface QuizQuestion {
  id: string;
  cardId: string;
  type: QuizType;
  isRetry: boolean;
  jlptLevel: string;
  cardContent: string;
  cardMeaning: string;
  cardReading?: string;
  promptSentence?: string;
  promptMeaning?: string;
  promptKeyword?: string;
  promptLabel?: string;
  audioUrl?: string;
  exampleSentence?: string;
  exampleAudioUrl?: string;
  exampleMeaning?: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  choices?: QuizChoice[];
}

interface QuizChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

// ─── Notification ───
type NotificationType =
  | "review_reminder"
  | "streak_warning"
  | "milestone"
  | "card_burned"
  | "comment_reply"
  | "comment_like"
  | "deck_cloned"
  | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;  // cardId, commentId, deckId, dueCount...
  isRead: boolean;
  createdAt: string;
}

interface NotificationSettings {
  reviewReminder: boolean;
  streakWarning: boolean;
  milestone: boolean;
  social: boolean;    // comment_reply + comment_like + deck_cloned
  system: boolean;
}
```

---

## 7. SRS & Mastery System

### Mastery stages

| Stage | Nhãn           | Interval đến lần review tiếp |
| ----- | -------------- | ---------------------------- |
| 0     | New            | Học ngay (lần đầu)           |
| 1     | Apprentice I   | 4 giờ                        |
| 2     | Apprentice II  | 8 giờ                        |
| 3     | Apprentice III | 1 ngày                       |
| 4     | Apprentice IV  | 2 ngày                       |
| 5     | Guru I         | 4 ngày                       |
| 6     | Guru II        | 1 tuần                       |
| 7     | Master I       | 2 tuần                       |
| 8     | Master II      | 1 tháng                      |
| 9–12  | Enlightened    | 2–6 tháng                    |
| 13    | Burned I       | 8 tháng                      |
| 14    | Burned II      | 12 tháng                     |

### Quy tắc điều chỉnh

```
Đúng: masteryAfter = min(14, before + 1)
Sai:  masteryAfter = max(0, before - 2)
```

### Phân loại cho Quiz type

| Mastery | Type tự động        |
| ------- | ------------------- |
| 0–2     | D — Flashcard       |
| 3–5     | A — Fill-in         |
| 6–9     | C — Multiple choice |
| 10–14   | B — Listen & type   |

---

## 8. Routing

| Route              | Guard                 | Component          |
| ------------------ | --------------------- | ------------------ |
| `/`                | Public                | HomePage           |
| `/login`           | Guest only            | LoginPage          |
| `/register`        | Guest only            | RegisterPage       |
| `/forgot-password` | Guest only            | ForgotPasswordPage |
| `/reset-password`  | Guest only            | ResetPasswordPage  |
| `/dashboard`       | Auth required         | DashboardPage      |
| `/library`         | Auth required         | LibraryPage        |
| `/search`          | Auth required         | SearchPage         |
| `/card/:id`        | Auth required         | CardDetailPage     |
| `/study`           | Auth required         | StudyPage          |
| `/quiz/config`     | Auth required         | QuizConfigPage     |
| `/quiz`            | Auth required         | QuizPage           |
| `/quiz/result`     | Auth required         | QuizResultPage     |
| `/deck/:id`        | Auth required         | DeckViewPage       |
| `/deck/:id/edit`   | Auth required + owner | DeckEditPage       |
| `/profile`         | Auth required         | ProfilePage        |
| `/settings`        | Auth required         | SettingsPage       |

> **Auth required:** Redirect → `/login` nếu chưa đăng nhập.  
> **Guest only:** Redirect → `/dashboard` nếu đã đăng nhập.  
> **Owner:** Backend trả 403 nếu không phải owner.

---

## 9. Error Codes

| Code                    | HTTP | Ý nghĩa                                        |
| ----------------------- | ---- | ---------------------------------------------- |
| `EMAIL_ALREADY_EXISTS`  | 409  | Email đã tồn tại khi đăng ký                   |
| `INVALID_CREDENTIALS`   | 401  | Sai email hoặc mật khẩu                        |
| `USER_BANNED`           | 403  | Tài khoản bị khóa — liên hệ admin              |
| `USER_NOT_FOUND`        | 404  | Không tìm thấy user                            |
| `UNAUTHORIZED`          | 401  | Token hết hạn hoặc không hợp lệ                |
| `FORBIDDEN`             | 403  | Không có quyền thực hiện hành động này         |
| `NOT_FOUND`             | 404  | Resource không tồn tại                         |
| `DECK_CARD_LIMIT`       | 422  | Deck đã đạt giới hạn 1000 thẻ                  |
| `INVALID_TOKEN`         | 400  | Token reset password không hợp lệ hoặc đã dùng |
| `TOKEN_EXPIRED`         | 400  | Token reset password đã hết hạn (1 giờ)        |
| `INTERNAL_SERVER_ERROR` | 500  | Lỗi server                                     |
