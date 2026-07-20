# ROOTMAN MONEY ROUTE — Image Prompts: 6 Money Types (ตัวหลัก)

พรอมป์สำหรับสร้าง/รีเจนภาพ **6 Money Types** ให้เข้าชุดเดียวกับ 16 อัตลักษณ์
(ดูสไตล์กลาง/พาเลตต์/เนกาทีฟ/เซ็ตติ้งได้ที่ [IDENTITY_IMAGE_PROMPTS.md](./IDENTITY_IMAGE_PROMPTS.md))

> **6 ตัวหลักยังใช้อยู่ไหม? — ใช้ครับ และสำคัญมาก** เพราะเป็นทั้ง
> 1. **ฐานของระบบให้คะแนน** — ทุกคำตอบถูกจับเป็น 6 Money Types ก่อน แล้วค่อย
>    แปลงเป็น 1 ใน 16 อัตลักษณ์ (primary + secondary → identity)
> 2. **แสดงบนหน้า Home** — ทั้ง Hero cluster และเซกชัน "รูปแบบการทำเงิน 6 แบบ"
> 3. **แสดงในรายงาน** — เซกชัน "แบบแผนการหาเงินของคุณ" (Money Pattern)
> 4. **ภาพ fallback ให้ 16 อัตลักษณ์** — ถ้าภาพอัตลักษณ์ตัวใดหาย ระบบจะใช้ภาพ
>    ตาม base type แทนโดยอัตโนมัติ
>
> จึงควรมีภาพ 6 ตัวนี้ให้คมและเข้าชุดกับ 16 อัตลักษณ์เสมอ

ไฟล์ปลายทาง: `public/personas/<slug>.png` (เช่น `hunter.png`)

---

## พรอมป์รายตัว (6 Money Types)

ทุกพรอมป์ใช้สไตล์กลางเดียวกับ 16 อัตลักษณ์ ต่างกันที่ subject และสีเน้น
ให้ทำภาพ 6 ตัวนี้ให้ดู **เป็น "ต้นแบบ/หัวหน้าตระกูล"** (สง่ากว่า ท่านิ่งกว่า
อัตลักษณ์ย่อยเล็กน้อย) เพื่อสื่อว่าเป็นรากของทั้ง 16

### 1. THE HUNTER — นักล่า (`hunter.png`) · สีเน้น crimson `#c23b22`
> *หาเงินเร็ว ปิดดีลเก่ง*
```
isometric voxel 3D character mascot, the archetypal HUNTER, confident bold
stance with one arm forward as if seizing an opportunity, a glowing crimson
target/crosshair and a few gold coin sparks floating nearby, sharp fearless
expression, chunky pixel-art cubes with visible facets, matte clay material,
soft studio lighting with warm rim light, premium dark editorial mood, ROOTMAN
palette (espresso #1a1714, crimson #c23b22 accent, antique gold #b8860b, warm
tan #c4956a, cream #f4efe8), 3/4 front isometric view, floating with soft drop
shadow, centered, transparent background, no text, no logo --ar 1:1 --style raw
```

### 2. THE CREATOR — ครีเอเตอร์ (`creator.png`) · สีเน้น gold `#b8860b`
> *ดึงความสนใจ เล่าเรื่องเป็น*
```
isometric voxel 3D character mascot, the archetypal CREATOR, expressive open
pose mid-idea, a glowing gold lightbulb / play-button and a small floating
content-card or camera nearby, creative confident expression, chunky pixel-art
cubes with visible facets, matte clay material, soft studio lighting with warm
rim light, premium dark editorial mood, ROOTMAN palette (espresso #1a1714,
antique gold #b8860b accent, crimson #c23b22, warm tan #c4956a, cream #f4efe8),
3/4 front isometric view, floating with soft drop shadow, centered, transparent
background, no text, no logo --ar 1:1 --style raw
```

### 3. THE EXPERT — ผู้เชี่ยวชาญ (`expert.png`) · สีเน้น tan/bronze `#c4956a`
> *แก้ปัญหาด้วยทักษะเฉพาะ*
```
isometric voxel 3D character mascot, the archetypal EXPERT, composed
authoritative pose, holding a precision tool with a floating bronze gear and a
small glowing premium gem symbolizing high-value skill, calm intelligent
expression, chunky pixel-art cubes with visible facets, matte clay material,
soft studio lighting with warm rim light, premium dark editorial mood, ROOTMAN
palette (espresso #1a1714, tan/bronze #c4956a accent, antique gold #b8860b,
crimson #c23b22, cream #f4efe8), 3/4 front isometric view, floating with soft
drop shadow, centered, transparent background, no text, no logo --ar 1:1
--style raw
```

### 4. THE OPERATOR — นักปฏิบัติการ (`operator.png`) · สีเน้น gunmetal steel + gold
> *ทำระบบหลังบ้านให้ลื่น*
```
isometric voxel 3D character mascot, the archetypal OPERATOR, steady reliable
pose surrounded by a few neatly interlocking gunmetal gears and a clean
floating checklist, orderly calm expression, gold rivet accents on steel,
chunky pixel-art cubes with visible facets, matte clay material, soft studio
lighting with warm rim light, premium dark editorial mood, ROOTMAN palette
(espresso #1a1714, gunmetal steel and antique gold #b8860b accents, crimson
#c23b22, cream #f4efe8), 3/4 front isometric view, floating with soft drop
shadow, centered, transparent background, no text, no logo --ar 1:1 --style raw
```

### 5. THE MERCHANT — พ่อค้า (`merchant.png`) · สีเน้น amber/gold-soft `#d4a017`
> *มองสินค้าและ Margin ออก*
```
isometric voxel 3D character mascot, the archetypal MERCHANT, shrewd confident
pose beside a few stacked product crates, upward amber price arrows and flowing
gold coins around them, sharp calculating grin, chunky pixel-art cubes with
visible facets, matte clay material, soft studio lighting with warm rim light,
premium dark editorial mood, ROOTMAN palette (espresso #1a1714, amber/gold-soft
#d4a017 accent, antique gold #b8860b, crimson #c23b22, cream #f4efe8), 3/4 front
isometric view, floating with soft drop shadow, centered, transparent
background, no text, no logo --ar 1:1 --style raw
```

### 6. THE BUILDER — นักสร้าง (`builder.png`) · สีเน้น ember red + gold
> *สร้างสินทรัพย์ที่ขยายได้*
```
isometric voxel 3D character mascot, the archetypal BUILDER, patient visionary
pose beside a modular voxel tower / system assembling itself upward, holding a
small blueprint, ambitious focused expression, chunky pixel-art cubes with
visible facets, matte clay material, soft studio lighting with warm rim light,
premium dark editorial mood, ROOTMAN palette (espresso #1a1714, ember red
#c23b22 and antique gold #b8860b accents, warm tan #c4956a, cream #f4efe8), 3/4
front isometric view, floating with soft drop shadow, centered, transparent
background, no text, no logo --ar 1:1 --style raw
```

---

## ตารางสรุป

| # | Money Type | Thai | ไฟล์ | สีเน้น | ครอบคลุมอัตลักษณ์ |
|---|---|---|---|---|---|
| 1 | THE HUNTER | นักล่า | `hunter.png` | crimson | closer, rainmaker, connector |
| 2 | THE CREATOR | ครีเอเตอร์ | `creator.png` | gold | storyteller, magnetizer, educator |
| 3 | THE EXPERT | ผู้เชี่ยวชาญ | `expert.png` | tan/bronze | specialist, advisor, mentor |
| 4 | THE OPERATOR | นักปฏิบัติการ | `operator.png` | steel+gold | systemizer, executor, orchestrator |
| 5 | THE MERCHANT | พ่อค้า | `merchant.png` | amber | trader, curator |
| 6 | THE BUILDER | นักสร้าง | `builder.png` | ember+gold | architect, visionary |

> เคล็ดลับ: เจน 6 ตัวนี้ด้วย seed เดียวกับซีรีส์ 16 อัตลักษณ์ เพื่อให้สัดส่วน/
> วัสดุ/แสงตรงกัน แล้ววางไว้ที่ `public/personas/<slug>.png` (ทับของเดิมได้เลย)
