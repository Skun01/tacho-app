# Design System: Tacho (User Frontend)

## 1. Creative North Star

**"Tacho"** — Lấy cảm hứng từ *The Great Wave off Kanagawa*, sự giao thoa giữa indigo đại dương và mặt giấy cổ. Không phải learning app thông thường — đây là không gian học thuật trầm tĩnh.

Phong cách: **high-end editorial**, intentional asymmetry, non-linear layout. Mỗi pixel là một nét bút có chủ đích. Phá vỡ "bootstrap template" aesthetic bằng indigo depth trên weathered cream surface.

---

## 2. Color Tokens

> Dark mode apply qua class `dark` trên `<html>` — không dùng `prefers-color-scheme`.

| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--primary` | `#002453` | `#adc6ff` | Authoritative elements, primary CTA |
| `--primary-container` | `#1a3a6d` | `#003585` | Gradient end của primary button |
| `--secondary` | `#4a6267` | `#b2ccd1` | Secondary wave — bridge giữa ink và paper |
| `--secondary-container` | `#cde7ed` | `#324b50` | Selection chip background |
| `--on-secondary-container` | `#051f24` | `#e8f3f6` | Selection chip text |
| `--tertiary` | `#3d1d00` | `#ffb87a` | Calligraphy stamp label, tertiary text |
| `--surface` | `#fff9eb` | `#1d1c13` | Base background — "Fine Paper" |
| `--surface-container-low` | `#f9f3e5` | `#222119` | Secondary content blocks |
| `--surface-container-lowest` | `#ffffff` | `#17160f` | Cards — tạo "lift" effect |
| `--surface-container-high` | `#ede8da` | `#2d2c23` | Background behind cards |
| `--surface-container-highest` | `#e8e2d4` | `#38372d` | Focal point cards, CTA cards |
| `--on-surface` | `#1d1c13` | `#e8e6d9` | Body text — không dùng pure black |
| `--on-surface-variant` | `#4a4740` | `#cac7bb` | Section titles, secondary text |
| `--outline-variant` | `#cbc8bc` | `#4a4740` | Ghost border base (15% opacity) |

`--primary` dùng cho authoritative elements và primary CTA. Gradient `--primary` → `--primary-container` cho hero section và main CTA button.

---

## 3. Typography

```css
font-family: "Nunito", "Kiwi Maru", system-ui, sans-serif;
```

| Token | Size | Weight | Font | Dùng cho |
|---|---|---|---|---|
| `display-lg` | 3.5rem | 700 | Kiwi Maru | Hero, decorative Kanji header |
| `display-md` | 2.5rem | 700 | Kiwi Maru | Page title |
| `headline-md` | 1.5rem | 600 | Kiwi Maru | Section header |
| `headline-sm` | 1.25rem | 600 | Kiwi Maru | Card title, sub-section |
| `body-lg` | 1rem | 400 | Nunito | Body text mặc định |
| `body-md` | 0.875rem | 400 | Nunito | Secondary text, caption |
| `label-md` | 0.875rem | 500 | Nunito | Button, chip, tab label |

- Display headers: `letter-spacing: 0.02em`, có thể offset hoặc vertical orientation cho Kanji
- Vietnamese body text: `line-height: 1.6` minimum để accommodate diacritics
- Section titles: màu `--on-surface-variant`, không dùng `--on-surface`

---

## 4. Component Visual Decisions

### Elevation & Depth

Không dùng shadow cho card thông thường — dùng tonal layering:
```
--surface-container-low (background)
  └── --surface-container-lowest (card) → "lift" như layered rice paper
```
Floating elements (modal, popover): `box-shadow: 0 16px 48px rgba(29, 28, 19, 0.05)`

### Navigation (Top Bar / Sidebar)

- Glassmorphism: `--surface` semi-transparent + `backdrop-filter: blur(12px)`
- Tablet+: glassmorphism. Mobile: solid `--surface-container-low`

### Buttons

- **Primary:** gradient `--primary` → `--primary-container`, `border-radius: 0.75rem` (`xl`)
- **Tertiary:** no background, no border — màu `--primary`, background `--surface-variant` on hover only

### Input Fields

- Không dùng 4-sided border
- Style 1: bottom-only border dùng `--outline-variant` ở 40% opacity
- Style 2: filled `--surface-container-highest` block, không border
- Giữ "scholarly notebook" feel

### Border Radius

| Element | Value |
|---|---|
| Button, card, input | `0.75rem` (`xl`) |
| Chip, badge | `rounded-full` |
| Modal | `1rem` |
| Calligraphy stamp label | `0.25rem` (square — intentional) |

### Cards & Lists

- Không dùng divider line giữa list items — dùng `gap-4` hoặc zebra `--surface` / `--surface-container-low`
- Card body: `--surface-container-highest` cho focal point, `--surface-container-lowest` cho standard card

### Selection Chips

- Background `--secondary-container`, text `--on-secondary-container`, `rounded-full`

### Specialized Components

- **Vertical Kanji Strips:** `writing-mode: vertical-rl` — chỉ dùng cho decoration, không dùng cho content chính
- **Calligraphy Stamp Labels:** Small square label, màu `--tertiary`, `border-radius: 0.25rem`

### Animation

- Slow-in / slow-out — mimics shoji screen sliding
- `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`
- Không dùng bouncy hay snappy transition

---

## 5. Do's & Don'ts

**Do:**
- Embrace asymmetry — offset text block, để layout "chảy" tự nhiên
- Treat empty space như design element, không phải missing content
- Dùng tonal shift để phân tách — không dùng border

**Don't:**
- Không pure black — luôn dùng `--on-surface`
- Không sharp corners — system sống trong range `md` đến `xl`
- Không over-animate — mọi transition đều chậm và có chủ đích