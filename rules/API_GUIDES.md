  ### API Response Format

  ```json
  {
    "code": 200,
    "success": true/false,
    "message": "Error_Code_Here" | null,
    "data": <T>,
    "metaData": { "total": N, "page": N, "pageSize": N } | null
  }
  ```
  
  ### API-ready architecture (mock now, real API later)
  > **Rule:** Never embed static data directly in components or constants files as a substitute 

  ---

  ### Furigana Markup Format

  For any Japanese text field that may contain kanji, the backend **must** use the following inline furigana notation:

  ```
  {漢字|かんじ}
  ```

  **Format rule:** `{kanji|reading}` — curly braces, pipe `|` separator, no spaces.

  **Examples:**
  ```
  "{勉強|べんきょう}をしています"
  "私は{日本語|にほんご}を{勉強|べんきょう}しています"
  "〜{思|おも}います"
  ```

  Plain text with no furigana markup is also valid — the frontend handles both gracefully.

  **Fields that MUST support this format (backend contract):**

  | Type | Field |
  |---|---|
  | `VocabCard` | `content` |
  | `GrammarCard` | `content`, `structure`, `formalVariant` |
  | `CardExample` | `japaneseSentence` |
  | `LinkedCard` | `content` |
  | `QuizQuestion` | `cardContent`, `promptSentence`, `exampleSentence` |

  **Fields that do NOT use this format:**
  - `reading` — pure hiragana/katakana, no furigana needed
  - `meaning` / `exampleMeaning` — Vietnamese text
  - `aboutText` / `userNote` — HTML rich text (rendered via `dangerouslySetInnerHTML`)
