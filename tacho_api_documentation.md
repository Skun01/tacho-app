# Tacho — Tài liệu Chức năng & Thiết kế API Backend

> **Ứng dụng học tiếng Nhật** theo phương pháp SRS (Spaced Repetition System).  
> Stack frontend: React + TypeScript + Vite. API base URL: `/api`.

---

## Mục lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Data Models](#2-data-models)
3. [Chức năng chi tiết](#3-chức-năng-chi-tiết)
4. [Thiết kế API Backend](#4-thiết-kế-api-backend)
5. [Cơ chế Auth](#5-cơ-chế-auth)
6. [SRS & Mastery System](#6-srs--mastery-system)

---

## 1. Tổng quan hệ thống

### Luồng học tập chính
```
Đăng nhập → Dashboard → [Học thẻ mới hoặc Ôn tập] → Study (xem thẻ) → Quiz (làm bài) → Kết quả
```

### Các module chính

| Module | Mô tả |
|--------|-------|
| **Auth** | Đăng ký, đăng nhập, refresh token, quên/reset mật khẩu |
| **Dashboard** | Thống kê tổng quan: hàng học hôm nay, due review, biểu đồ hoạt động |
| **Library** | Quản lý bộ thẻ (deck): tạo, sửa, xóa, clone, bookmark |
| **Card** | Từ vựng & ngữ pháp N5–N1; tìm kiếm, chi tiết, tiến trình |
| **Study** | Xem thẻ tuần tự trước khi làm bài |
| **Quiz** | 4 dạng bài: điền từ (A), nghe-điền (B), trắc nghiệm (C), flashcard (D) |
| **Search** | Tìm kiếm từ vựng + ngữ pháp, lọc JLPT, thêm vào deck |
| **Comment** | Bình luận trên từng thẻ, like/reply |
| **Profile** | Thống kê cá nhân, streak calendar, JLPT progress |
| **Settings** | Cấu hình số thẻ học mỗi ngày và session |

---

## 2. Data Models

### 2.1 User
```typescript
{
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  createdAt: string         // ISO 8601
  passwordHash: string      // server-side only
}
```

### 2.2 Card (VocabCard | GrammarCard)

**VocabCard**
```typescript
{
  id: string
  type: "vocab"
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1"
  content: string           // Kanji/Kana (e.g. "学校")
  reading: string           // Furigana (e.g. "がっこう")
  meaning: string           // Vietnamese (e.g. "trường học")
  exampleSentence?: string  // JP example
  exampleMeaning?: string   // VN translation của example
}
```

**GrammarCard**
```typescript
{
  id: string
  type: "grammar"
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1"
  content: string           // e.g. "〜てから"
  meaning: string           // e.g. "Sau khi..."
  example?: string
  notes?: string
}
```

### 2.3 CardDetail (mở rộng của Card)

**VocabCardDetail** (thêm vào VocabCard)
```typescript
{
  pitchAccent?: string       // e.g. "わ↘たし"
  pitchPattern?: number[]    // per mora: 0=low, 1=high
  audioUrl?: string
  dictionaryEntries: DictEntry[]
  examples: CardExample[]
  userNote?: string
  userProgress?: CardProgressDetail
}
```

**GrammarCardDetail** (thêm vào GrammarCard)
```typescript
{
  structure: string
  formalVariant?: string
  register: "casual" | "standard" | "polite" | "formal"
  aboutText: string
  antonyms: LinkedCard[]
  relatedStructures: LinkedCard[]
  references: ReferenceLink[]
  examples: CardExample[]
  aboutExamples?: CardExample[]
  userNote?: string
  userProgress?: CardProgressDetail
}
```

**DictEntry**
```typescript
{ partOfSpeech: string; definitions: string[] }
```

**CardExample**
```typescript
{
  id: string
  japaneseSentence: string
  vietnameseMeaning: string
  jlptLevel: JlptLevel
  audioUrl?: string
}
```

**CardProgressDetail**
```typescript
{
  masteryStage: number      // 0–14 (15 stages)
  firstLearnedAt: string
  lastReviewedAt: string
  nextReviewAt: string
  reviewCount: number
}
```

### 2.4 CardProgress (user-card relationship)
```typescript
{
  cardId: string
  userId: string
  masteryLevel: number      // 0–14
  isInReview: boolean       // đang trong queue review
  isSaved: boolean          // bookmark
  nextReviewAt?: string
  lastReviewedAt?: string
}
```

### 2.5 Deck
```typescript
{
  id: string
  name: string
  description: string
  category: DeckCategory    // "Mặc định" | "Từ vựng" | "Ngữ pháp" | "Anime" | "Manga" | "Âm nhạc" | "TV" | "Novel" | "Game" | "Sách giáo khoa" | "Khác"
  source: "user" | "app" | "community" | "textbook"
  coverIndex: number        // 0–5 gradient preset
  coverUrl?: string
  ownerId: string
  ownerName: string
  isPublic: boolean
  totalCards: number
  vocabCount: number
  grammarCount: number
  userCount: number         // tổng số người đang học deck này
  textbook?: string         // chỉ khi source === "textbook"
  createdAt: string
  updatedAt: string
}
```

**DeckUserState** (merged khi authenticated)
```typescript
{
  isOwner: boolean
  isBookmarked: boolean
  isSaved: boolean          // đã thêm vào thư viện cá nhân
  isInReview: boolean       // deck đang active trong SRS queue
  learnedCards: number
  reviewDue: number
}
```

**DeckCardOrder** (bảng lưu thứ tự thẻ trong deck)
```typescript
{
  deckId: string
  cardId: string
  position: number
}
```

### 2.6 QuizQuestion
```typescript
{
  id: string
  cardId: string
  type: "A" | "B" | "C" | "D"
  isRetry: boolean
  jlptLevel: string
  cardContent: string
  cardMeaning: string
  cardReading?: string
  promptSentence?: string   // TypeA: câu có ___
  promptMeaning?: string    // TypeA: nghĩa tiếng Việt của câu
  promptKeyword?: string    // TypeA: từ khóa highlight trong promptMeaning
  promptLabel?: string      // TypeA fallback label
  audioUrl?: string         // TypeB, C
  exampleSentence?: string  // TypeB
  exampleAudioUrl?: string  // TypeB
  exampleMeaning?: string   // TypeB
  correctAnswer: string
  acceptedAnswers: string[]
  choices?: QuizChoice[]    // TypeC only
}
```

### 2.7 Comment & Reply
```typescript
// Comment
{
  id: string
  cardId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  text: string
  createdAt: string
  likeCount: number
  likedByMe: boolean
  replies: Reply[]
  replyCount: number
}

// Reply
{
  id: string
  commentId: string
  authorId: string
  authorName: string
  text: string
  createdAt: string
  likeCount: number
  likedByMe: boolean
}
```

### 2.8 Dashboard Summary
```typescript
{
  learn: {
    totalTarget: number
    completedCount: number
    batchIds: string[]         // cardIds để học hôm nay
    decks: Array<{ id: string; name: string; due: number; batchIds: string[] }>
  }
  review: {
    totalDue: number
    vocab: number
    grammar: number
    batchIds: string[]
  }
  progress: {
    vocab: number[]            // phân bổ mastery 0–14
    grammar: number[]
  }
  personal: {
    activity: Array<{ date: string; vocab: number; grammar: number }>
    streakDays: number
    streakCalendar: Array<{ label: string; active: boolean }>
    jlpt: Record<"Từ vựng" | "Ngữ pháp" | "Cả hai", 
      Array<{ current: number; total: number; done?: boolean; level: JlptLevel }>>
  }
}
```

---

## 3. Chức năng chi tiết

### 3.1 Auth

| Chức năng | Mô tả |
|-----------|-------|
| Đăng ký | Tạo tài khoản với email + password + displayName |
| Đăng nhập | Trả về `accessToken` + thông tin user |
| Refresh token | Dùng HTTPOnly cookie (refreshToken) để làm mới accessToken |
| Logout | Xóa refreshToken cookie phía server |
| Quên mật khẩu | Gửi email reset password |
| Reset mật khẩu | Xác thực token + cập nhật password mới |
| Đổi mật khẩu | Yêu cầu mật khẩu cũ + mật khẩu mới |
| Đổi displayName | Cập nhật tên hiển thị |

### 3.2 Dashboard

- Hiển thị số thẻ **cần học mới hôm nay** (based on `dailyNewCards` setting)
- Hiển thị số thẻ **cần ôn tập hôm nay** (SRS due)
- **Biểu đồ forecast**: số thẻ due trong 7 ngày tới
- **Biểu đồ hoạt động**: vocabl + grammar học theo ngày (30 ngày)
- **Streak calendar**: 13 tuần gần nhất (ngày nào có học)
- **JLPT progress**: tiến trình N5–N1 theo vocab/grammar/cả hai
- Nút **Học thẻ mới** → navigate đến Study với batchIds
- Nút **Ôn tập** → navigate đến Quiz với batchIds

### 3.3 Library (Thư viện)

**4 tab:**
1. **Bộ thẻ của tôi** — deck do user tạo
2. **Bộ thẻ của app** — deck do admin/app cung cấp
3. **Sách giáo khoa** — deck gắn với sách (Minna, Genki, v.v.)
4. **Cộng đồng** — deck public của users khác

**Mỗi deck có thể:**
- Xem chi tiết danh sách thẻ
- Thêm vào review queue (`isInReview`)
- Bookmark/lưu (`isSaved`)
- Clone (copy deck về thư viện cá nhân)
- Edit (nếu là owner): đổi tên, mô tả, danh mục, ảnh bìa
- Xóa (nếu là owner)
- Thêm/xóa thẻ (tìm và thêm từ kho thẻ app)
- Kéo thả sắp xếp thứ tự thẻ

### 3.4 Card Detail

Hiển thị đầy đủ thông tin của 1 thẻ:
- Pitch accent, furigana, audio
- Dictionary entries (từ điển)
- Ví dụ câu (có audio)
- Tiến trình SRS của user (masteryStage, nextReviewAt, v.v.)
- Ghi chú cá nhân
- Bình luận (phân trang, like, reply)
- Các thẻ liên quan (antonyms, related structures)

### 3.5 Search

- Tìm theo từ khóa (content, reading, meaning)
- Lọc theo loại: Vocab / Grammar / Tất cả
- Lọc theo JLPT: N5, N4, N3, N2, N1 (multi-select)
- **Select mode**: chọn nhiều thẻ → thêm vào deck hoặc bắt đầu study ngay
- Thêm từng thẻ vào deck cụ thể

### 3.6 Study (Học thẻ)

- Duyệt qua danh sách thẻ tuần tự (prev/next)
- Hiển thị nội dung đầy đủ của VocabCard hoặc GrammarCard
- Progress bar theo deck
- Nút "Bắt đầu bài tập" ở thẻ cuối → navigate sang Quiz

### 3.7 Quiz

**4 dạng bài:**

| Type | Tên | Mô tả |
|------|-----|-------|
| A | Điền từ | Câu ví dụ có `___`, điền từ tiếng Nhật còn thiếu. Gợi ý nghĩa bên dưới (hover để xem). |
| B | Nghe và điền | Nghe audio câu ví dụ, gõ lại toàn bộ câu tiếng Nhật. |
| C | Trắc nghiệm | Nghe audio từ, chọn 1 trong 4 đáp án nghĩa tiếng Việt. |
| D | Thẻ ghi nhớ | Flashcard: lật thẻ, tự đánh giá Đã nhớ / Chưa nhớ (swipe/button). |

**Cơ chế quiz:**
- Nhận danh sách `cardIds` → backend tạo câu hỏi phù hợp
- Mỗi thẻ có `masteryLevel` 0–14, trả lời đúng +1, sai −2
- Thẻ trả lời sai được thêm vào cuối queue để ôn lại
- Kết thúc khi queue rỗng → commit masteryChanges → navigate sang Result

**Quiz Config:**
- Chọn loại bài (A/B/C/D) trước khi bắt đầu

**Quiz Result:**
- Accuracy %, số đúng/sai
- Danh sách thẻ với mastery before/after
- Nút "Tiếp tục học" hoặc "Về trang chủ"

**Action/Controls trong quiz:**
- Hoàn tác (undo câu trả lời vừa rồi — chỉ TypeA/B/C)
- Xem đáp án
- Xem thông tin thẻ (inline card detail panel)
- Hotkey: Space (flip/check), Enter (next), mũi tên (TypeC), Z (undo), S (see answer)

### 3.8 Comment

- Xem danh sách bình luận theo thẻ (phân trang, 5/page)
- Đăng bình luận mới
- Like/unlike bình luận
- Trả lời bình luận (reply)
- Like/unlike reply

### 3.9 Profile

- Thông tin user (tên, email, ngày tham gia, avatar)
- Thống kê: ngày học, streak, vocab/grammar đã học
- Streak calendar (13 tuần)
- JLPT progress breakdown

### 3.10 Settings

- Cài đặt **Số thẻ mới mỗi ngày** (`dailyNewCards`, default 20)
- Cài đặt **Số thẻ tối đa mỗi session** (`maxCardsPerSession`, default 40)
- Lưu vào localStorage (client-side)  
  → *Tương lai: đồng bộ lên server*

---

## 4. Thiết kế API Backend

### Chuẩn response
```json
{
  "code": 200,
  "success": true,
  "message": null,
  "data": { ... },
  "metaData": null
}
```

**Paginated response** thêm:
```json
{
  "metaData": { "total": 100, "page": 1, "pageSize": 20 }
}
```

**Error response:**
```json
{
  "code": 400,
  "success": false,
  "message": "EMAIL_ALREADY_EXISTS",
  "data": null,
  "metaData": null
}
```

---

### 4.1 Auth APIs

#### `POST /api/auth/register`
Tạo tài khoản mới.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "string (min 8)",
  "displayName": "Nguyễn Văn A"
}
```

**Response 201:**
```json
{
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": "u1", "email": "...", "displayName": "...", "createdAt": "..." }
  }
}
```

**Error codes:** `EMAIL_ALREADY_EXISTS`

---

#### `POST /api/auth/login`
Đăng nhập.

**Request:**
```json
{ "email": "...", "password": "..." }
```

**Response 200:** Giống register. Set HTTPOnly cookie `refreshToken`.

**Error codes:** `INVALID_CREDENTIALS`

---

#### `POST /api/auth/refresh`
Làm mới access token từ refresh token cookie.

**Auth:** Cookie `refreshToken` (HTTPOnly)  
**Response 200:**
```json
{ "data": { "accessToken": "eyJ..." } }
```

---

#### `POST /api/auth/logout`
Xóa refresh token.

**Auth:** Bearer + Cookie  
**Response 200:** `{ "data": null }`

---

#### `POST /api/auth/forgot-password`
Gửi email reset password.

**Request:** `{ "email": "..." }`  
**Response 200:** `{ "data": null }`

---

#### `POST /api/auth/reset-password`
**Request:**
```json
{ "token": "abc123", "newPassword": "..." }
```
**Response 200:** `{ "data": null }`

---

#### `GET /api/auth/me`
Lấy thông tin user đang đăng nhập.

**Auth:** Bearer  
**Response 200:** `{ "data": UserDTO }`

---

#### `PATCH /api/auth/me/display-name`
**Auth:** Bearer  
**Request:** `{ "displayName": "..." }`  
**Response 200:** `{ "data": UserDTO }`

---

#### `PATCH /api/auth/me/password`
**Auth:** Bearer  
**Request:** `{ "currentPassword": "...", "newPassword": "..." }`  
**Response 200:** `{ "data": null }`  
**Error codes:** `INVALID_CREDENTIALS`

---

### 4.2 Dashboard APIs

#### `GET /api/dashboard/summary`
**Auth:** Bearer  
**Response 200:** `{ "data": DashboardSummary }`

> Backend cần tính:
> - `learn.batchIds`: N thẻ chưa học theo `dailyNewCards` setting
> - `review.batchIds`: thẻ có `nextReviewAt <= now` và `isInReview = true`
> - `personal.activity`: 30 ngày học gần nhất
> - `personal.streakCalendar`: 91 ngày (13 tuần), đánh dấu ngày có hoạt động
> - `personal.jlpt`: phân tích mastery theo từng level

---

#### `GET /api/dashboard/study-batch`
Lấy batch cardIds để học/ôn tập hôm nay.

**Auth:** Bearer  
**Query:** `?mode=learn|review`  
**Response 200:** `{ "data": ["cardId1", "cardId2", ...] }`

---

### 4.3 Card APIs

#### `GET /api/cards`
Tìm kiếm cards.

**Auth:** Bearer (optional — trả thêm `progress` nếu authed)  
**Query params:**
- `q` — từ khóa tìm kiếm
- `type` — `vocab | grammar`
- `jlpt` — `N5,N4,N3` (comma-separated)
- `ids` — `id1,id2,id3` (lấy nhiều thẻ cùng lúc)
- `page`, `pageSize`

**Response 200:**
```json
{
  "data": [
    {
      "id": "card-1",
      "type": "vocab",
      "jlptLevel": "N5",
      "content": "学校",
      "reading": "がっこう",
      "meaning": "trường học",
      "progress": {
        "masteryLevel": 3,
        "isInReview": true,
        "isSaved": false,
        "nextReviewAt": "2026-03-30T00:00:00Z",
        "lastReviewedAt": "2026-03-29T00:00:00Z"
      }
    }
  ],
  "metaData": { "total": 100, "page": 1, "pageSize": 20 }
}
```

---

#### `GET /api/cards/:id`
Lấy thông tin cơ bản của 1 card.

**Auth:** Optional  
**Response 200:** `{ "data": FlashCardWithProgress }`

---

#### `GET /api/cards/:id/detail`
Lấy full detail của 1 card (dictionary, examples, pitch, progress...).

**Auth:** Optional  
**Response 200:** `{ "data": VocabCardDetail | GrammarCardDetail }`

---

#### `PATCH /api/cards/:id/progress`
Cập nhật tiến trình học của user với 1 card.

**Auth:** Bearer  
**Request:**
```json
{
  "masteryLevel": 4,
  "isInReview": true,
  "isSaved": false,
  "nextReviewAt": "2026-04-05T00:00:00Z",
  "lastReviewedAt": "2026-03-29T00:00:00Z"
}
```
**Response 200:** `{ "data": FlashCardWithProgress }`

---

#### `POST /api/cards/progress/batch`
Commit kết quả quiz (cập nhật mastery nhiều thẻ cùng lúc).

**Auth:** Bearer  
**Request:**
```json
{
  "changes": [
    { "cardId": "c1", "before": 3, "after": 4 },
    { "cardId": "c2", "before": 5, "after": 3 }
  ]
}
```
**Response 200:** `{ "data": null }`

> Backend cần tính lại `nextReviewAt` theo SRS algorithm dựa vào `after` (masteryLevel mới).

---

### 4.4 Quiz APIs

#### `POST /api/quiz/batch`
Tạo câu hỏi quiz từ danh sách card IDs.

**Auth:** Bearer  
**Request:**
```json
{
  "cardIds": ["c1", "c2", "c3"],
  "forceType": "A"   // optional: A | B | C | D
}
```

**Response 200:**
```json
{
  "data": {
    "questions": [QuizQuestion, ...],
    "masteryMap": { "c1": 3, "c2": 0, "c3": 7 }
  }
}
```

> **Logic chọn type:**
> - Nếu `forceType` có → dùng type đó (fallback sang A nếu không có dữ liệu)
> - Nếu không có `forceType` → chọn theo masteryLevel:
>   - 0–2: Type D (flashcard)
>   - 3–5: Type A (fill-in)
>   - 6–9: Type C (multiple choice)
>   - 10+: Type B (listen & type)
> 
> **TypeA question cần:** `promptSentence` (câu có `___`), `promptMeaning`, `correctAnswer`, `acceptedAnswers`  
> **TypeB cần:** `exampleSentence`, `exampleAudioUrl`, `audioUrl`  
> **TypeC cần:** `choices` (4 options, 1 correct + 3 distractors), `audioUrl`  
> **TypeD cần:** `cardContent`, `cardMeaning`, `cardReading`

---

### 4.5 Deck APIs

#### `GET /api/decks`
Danh sách decks với filter.

**Auth:** Bearer  
**Query params:**
- `source` — `user | app | community | textbook`
- `category` — tên category
- `isOwner` — `true` (chỉ deck của mình)
- `isInReview` — `true`
- `isSaved` — `true`
- `textbook` — tên sách giáo khoa
- `search` — từ khóa tìm kiếm tên deck
- `page`, `pageSize`

**Response 200:**
```json
{
  "data": [DeckListItem, ...],
  "metaData": { "total": 50, "page": 1, "pageSize": 20 }
}
```

`DeckListItem` = `Deck` + `DeckUserState`

---

#### `GET /api/decks/:id`
Lấy chi tiết 1 deck kèm danh sách thẻ.

**Auth:** Bearer  
**Response 200:** `{ "data": DeckDetailWithState }`

---

#### `POST /api/decks`
Tạo deck mới.

**Auth:** Bearer  
**Request:**
```json
{
  "name": "N5 Từ vựng cơ bản",
  "description": "...",
  "category": "Từ vựng",
  "isPublic": false,
  "coverUrl": "https://..."
}
```
**Response 201:** `{ "data": DeckDetailWithState }`

---

#### `PATCH /api/decks/:id`
Cập nhật thông tin deck (chỉ owner).

**Auth:** Bearer  
**Request:** Partial của CreateDeckPayload  
**Response 200:** `{ "data": null }`

---

#### `DELETE /api/decks/:id`
Xóa deck (chỉ owner).

**Auth:** Bearer  
**Response 200:** `{ "data": null }`

---

#### `POST /api/decks/:id/clone`
Clone deck về thư viện cá nhân của user.

**Auth:** Bearer  
**Response 201:** `{ "data": DeckDetailWithState }`

---

#### `POST /api/decks/:id/cards`
Thêm thẻ vào deck.

**Auth:** Bearer (owner only)  
**Request:** `{ "cardIds": ["c1", "c2"] }`  
**Response 200:** `{ "data": null }`

---

#### `DELETE /api/decks/:deckId/cards/:cardId`
Xóa thẻ khỏi deck.

**Auth:** Bearer (owner only)  
**Response 200:** `{ "data": null }`

---

#### `PUT /api/decks/:id/cards/order`
Sắp xếp lại thứ tự thẻ trong deck.

**Auth:** Bearer (owner only)  
**Request:** `{ "orderedCardIds": ["c3", "c1", "c2"] }`  
**Response 200:** `{ "data": null }`

---

#### `POST /api/decks/:id/bookmark`
Toggle bookmark deck.

**Auth:** Bearer  
**Request:** `{ "bookmarked": true }`  
**Response 200:** `{ "data": null }`

---

#### `POST /api/decks/:id/review`
Toggle deck vào/ra review queue.

**Auth:** Bearer  
**Request:** `{ "inReview": true }`  
**Response 200:** `{ "data": null }`

---

#### `POST /api/decks/:id/save`
Toggle lưu deck vào thư viện cá nhân.

**Auth:** Bearer  
**Request:** `{ "saved": true }`  
**Response 200:** `{ "data": null }`

---

### 4.6 Comment APIs

#### `GET /api/cards/:cardId/comments`
Lấy danh sách bình luận của 1 thẻ (phân trang).

**Auth:** Bearer  
**Query:** `?page=1&pageSize=5`  
**Response 200:**
```json
{
  "data": [Comment, ...],
  "metaData": { "total": 23, "page": 1, "pageSize": 5 }
}
```

> Field `likedByMe` phụ thuộc user hiện tại.

---

#### `POST /api/cards/:cardId/comments`
Đăng bình luận mới.

**Auth:** Bearer  
**Request:** `{ "text": "Từ này hay quá!" }`  
**Response 201:** `{ "data": Comment }`

---

#### `POST /api/comments/:commentId/like`
Toggle like bình luận.

**Auth:** Bearer  
**Response 200:** `{ "data": null }`

---

#### `POST /api/comments/:commentId/replies`
Đăng reply vào bình luận.

**Auth:** Bearer  
**Request:** `{ "text": "Đồng ý với bạn!" }`  
**Response 201:** `{ "data": Reply }`

---

#### `POST /api/comments/:commentId/replies/:replyId/like`
Toggle like reply.

**Auth:** Bearer  
**Response 200:** `{ "data": null }`

---

### 4.7 User Settings APIs

#### `GET /api/users/me/settings`
Lấy cài đặt của user hiện tại.

**Auth:** Bearer  
**Response 200:**
```json
{
  "data": {
    "dailyNewCards": 20,
    "maxCardsPerSession": 40
  }
}
```

---

#### `PATCH /api/users/me/settings`
Cập nhật cài đặt.

**Auth:** Bearer  
**Request:**
```json
{
  "dailyNewCards": 30,
  "maxCardsPerSession": 50
}
```
**Response 200:** `{ "data": null }`

---

### 4.8 User Note APIs

#### `PUT /api/cards/:id/user-note`
Lưu ghi chú cá nhân cho 1 thẻ.

**Auth:** Bearer  
**Request:** `{ "note": "Mình hay nhầm từ này với..." }`  
**Response 200:** `{ "data": null }`

---

## 5. Cơ chế Auth

### Token Strategy
- **AccessToken**: JWT, short-lived (15 phút), gửi qua `Authorization: Bearer <token>`
- **RefreshToken**: Long-lived (7–30 ngày), lưu trong **HTTPOnly cookie** (`refreshToken`)
- **Auto-refresh**: Khi nhận 401, frontend tự động gọi `/auth/refresh`, queue các request đang chờ, retry sau khi có token mới (đã implement ở `setupInterceptors.ts`)

### Error Codes
| Code | Ý nghĩa |
|------|---------|
| `INVALID_CREDENTIALS` | Email hoặc mật khẩu sai |
| `EMAIL_ALREADY_EXISTS` | Email đã tồn tại |
| `USER_NOT_FOUND` | Không tìm thấy user |
| `UNAUTHORIZED` | Token hết hạn/không hợp lệ → 401 |
| `FORBIDDEN` | Không có quyền → 403 |
| `INTERNAL_SERVER_ERROR` | Lỗi server → 500 |

---

## 6. SRS & Mastery System

### Mastery Stages

```
Stage 0: New (chưa học)
Stage 1–4: Learning (đang học)
Stage 5–9: Review (ôn tập)
Stage 10–14: Advanced (nâng cao)
```

### Quy tắc điều chỉnh
- Trả lời **đúng**: `masteryLevel = min(14, masteryLevel + 1)`
- Trả lời **sai**: `masteryLevel = max(0, masteryLevel - 2)`

### SRS Intervals (gợi ý)

| Stage | Interval đến lần review tiếp |
|-------|------------------------------|
| 0 | Học ngay (lần đầu) |
| 1 | 4 giờ |
| 2 | 8 giờ |
| 3 | 1 ngày |
| 4 | 2 ngày |
| 5 | 4 ngày |
| 6 | 1 tuần |
| 7 | 2 tuần |
| 8 | 1 tháng |
| 9–12 | 2–6 tháng |
| 13–14 | 6–12 tháng (burned) |

### Audio Assets
- Mỗi `CardExample` và `VocabCard` có thể có `audioUrl`
- Định dạng: MP3 hoặc WebM, host trên CDN
- TypeB quiz PHẢI có audio; TypeC có thể có

---

## Phụ lục: Routing Frontend

| Route | Auth | Component |
|-------|------|-----------|
| `/` | Public | HomePage |
| `/login` | Guest only | LoginPage |
| `/register` | Guest only | RegisterPage |
| `/forgot-password` | Guest only | ForgotPasswordPage |
| `/reset-password` | Guest only | ResetPasswordPage |
| `/dashboard` | Protected | DashboardPage |
| `/library` | Protected | LibraryPage |
| `/search` | Protected | SearchPage |
| `/card/:id` | Protected | CardDetailPage |
| `/study` | Protected | StudyPage |
| `/quiz/config` | Protected | QuizConfigPage |
| `/quiz` | Protected | QuizPage |
| `/quiz/result` | Protected | QuizResultPage |
| `/deck/:id` | Protected | DeckViewPage |
| `/deck/:id/edit` | Protected | DeckEditPage |
| `/profile` | Protected | ProfilePage |
| `/settings` | Protected | SettingsPage |
| `/quick-study` | Protected | QuickStudyPage |
