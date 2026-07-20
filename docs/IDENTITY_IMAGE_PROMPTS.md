# ROOTMAN MONEY ROUTE — Image Prompts: 16 อัตลักษณ์ทางการเงิน

พรอมป์สำหรับสร้างภาพตัวละครทั้ง 16 อัตลักษณ์ ให้เข้าชุดกับ persona art เดิม
(voxel / pixel + 3D บนพื้นหลังโปร่งใส) ใช้ได้กับ Midjourney, DALL·E 3, Stable
Diffusion, Leonardo, Flux ฯลฯ

> **เป้าหมายความสม่ำเสมอ:** ทั้ง 16 ตัวต้องดูเหมือนมาจากซีรีส์เดียวกัน — วัสดุ
> แสง มุมกล้อง และโทนสีเดียวกัน ต่างกันแค่ท่าทาง พร็อพ และสีเน้นตามตระกูล

---

## 1) Art Direction (สไตล์กลาง — ใช้กับทุกตัว)

- **รูปแบบ:** isometric voxel 3D character mascot, chunky pixel-art blocks,
  visible cubic facets, matte clay/plastic material
- **มุมกล้อง:** 3/4 front view, ~45° isometric, eye-level, centered
- **ท่า:** floating slightly above ground, dynamic but readable silhouette,
  soft contact/drop shadow underneath
- **แสง:** soft studio key light + subtle warm rim light, gentle ambient
  occlusion, premium editorial mood (ไม่การ์ตูนจ๋า)
- **พื้นหลัง:** transparent (PNG alpha) — ไม่มีกรอบ ไม่มีพื้น ไม่มีฉาก
- **ห้ามมี:** ข้อความ ตัวอักษร โลโก้ ลายน้ำ

### ROOTMAN Brand Palette (ล็อกสีให้ทุกตัว)
| บทบาท | HEX |
|---|---|
| Base / espresso | `#1a1714` |
| Ink (เงาเข้ม) | `#0b0a09` |
| Crimson (แดงแบรนด์) | `#c23b22` |
| Gold (ทองแอนทีค) | `#b8860b` |
| Gold soft | `#d4a017` |
| Tan / bronze | `#c4956a` |
| Cream (ไฮไลต์) | `#f4efe8` |

### สีเน้นตามตระกูล (Base Type)
| ตระกูล | สีเน้นหลัก | อารมณ์ |
|---|---|---|
| HUNTER | crimson `#c23b22` | ดุดัน คมเร็ว |
| CREATOR | gold `#b8860b` | สร้างสรรค์ ดึงดูด |
| EXPERT | tan/bronze `#c4956a` | ลึก น่าเชื่อถือ |
| OPERATOR | gunmetal steel + gold rivets | เป็นระบบ นิ่ง |
| MERCHANT | amber/gold-soft `#d4a017` | คล่อง ค้าขาย |
| BUILDER | ember red + gold | ทะเยอทะยาน มองไกล |

### Base Prompt Template (วางต่อหน้าทุกพรอมป์ได้)
```
isometric voxel 3D character, chunky pixel-art cubes with visible facets,
matte clay material, soft studio lighting with warm rim light, premium dark
editorial mood, ROOTMAN palette (espresso #1a1714, crimson #c23b22, antique
gold #b8860b, warm tan #c4956a, cream #f4efe8), 3/4 front isometric view,
character floating with soft drop shadow, centered, transparent background,
highly detailed, clean silhouette, no text, no logo --style raw
```

### Negative Prompt (สำหรับ SD / Flux / Leonardo)
```
text, letters, watermark, logo, signature, extra limbs, deformed, blurry,
low-res, jpeg artifacts, cluttered background, opaque background, white frame,
border, realistic photo skin, nsfw, flat 2d sticker
```

### Technical Settings
- **Aspect ratio:** 1:1 (`--ar 1:1`)
- **ความละเอียด:** ≥ 1024×1024, ส่งออก **PNG โปร่งใส**
- **Midjourney:** เติม `--ar 1:1 --style raw --stylize 250`; ถ้าต้องการ
  พื้นหลังโปร่งใสจริง ให้ใช้ `--no background` แล้วไดตัดพื้นด้วยเครื่องมือ remove-bg
- **DALL·E 3:** เขียนต่อท้ายว่า “on a fully transparent background, PNG with alpha”
- **ไฟล์ปลายทางที่แนะนำ:** `public/personas/identities/<slug>.png`
  (เช่น `closer.png`, `rainmaker.png` … ตามตารางด้านล่าง)

---

## 2) พรอมป์รายตัว (16 อัตลักษณ์)

แต่ละตัวมีพรอมป์แบบ **paste-ready** (รวมสไตล์กลางไว้แล้ว) ต่างกันแค่ subject

### 👑 ตระกูล HUNTER — สีเน้น crimson `#c23b22`

#### 1. THE CLOSER — นักปิดดีล (`closer.png`)
> *"ปิดก่อน แล้วค่อยปรับ"* · เห็นเงิน ปิดจบ ไม่ลังเล
```
isometric voxel 3D character mascot of a sharp confident deal-closer,
mid-handshake pose with one hand extended, wearing a crisp dark blazer with
crimson tie, a glowing crimson checkmark "deal done" icon floating beside the
hand, a few gold coin sparks, decisive smirk, chunky pixel cubes, matte clay,
soft studio light + warm rim, ROOTMAN palette with crimson #c23b22 accent,
3/4 front isometric view, floating with soft drop shadow, centered,
transparent background, no text, no logo --ar 1:1 --style raw
```

#### 2. THE RAINMAKER — พ่อค้านักล่า (`rainmaker.png`)
> *"ของดี + คนที่ใช่ = เงิน"* · มองส่วนต่างออก ปิดดีลเป็น
```
isometric voxel 3D character mascot of a hunter-merchant, holding a balance
scale with a small product cube on one side and gold coins on the other,
crimson price tags, a stylized voxel hawk perched on the shoulder, coins
raining lightly around, keen opportunistic expression, chunky pixel cubes,
matte clay, soft studio light + warm rim, ROOTMAN palette with crimson
#c23b22 accent and gold coins, 3/4 front isometric view, floating with soft
drop shadow, centered, transparent background, no text, no logo --ar 1:1
--style raw
```

#### 3. THE CONNECTOR — นักเชื่อมโอกาส (`connector.png`)
> *"ดีลเริ่มจากความไว้ใจ"* · รู้จักคน เปิดประตูดีล
```
isometric voxel 3D character mascot of a warm networker connecting people,
open welcoming gesture, glowing crimson-and-gold threads/nodes linking small
floating figures around them, a fan of business-card cubes in one hand,
friendly trustworthy smile, chunky pixel cubes, matte clay, soft studio light
+ warm rim, ROOTMAN palette with crimson #c23b22 accent, 3/4 front isometric
view, floating with soft drop shadow, centered, transparent background, no
text, no logo --ar 1:1 --style raw
```

### 🎨 ตระกูล CREATOR — สีเน้น gold `#b8860b`

#### 4. THE STORYTELLER — นักเล่าเรื่อง (`storyteller.png`)
> *"ถ้าเล่าให้คนหยุดดูได้ ก็ขายได้"* · ดึงความสนใจ สร้าง Audience
```
isometric voxel 3D character mascot of a charismatic storyteller mid-gesture,
holding a glowing gold speech-bubble / small megaphone, a voxel camera
floating nearby, tiny glowing audience dots gathering toward them, expressive
animated pose, chunky pixel cubes, matte clay, soft studio light + warm rim,
ROOTMAN palette with antique gold #b8860b accent, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

#### 5. THE MAGNETIZER — นักดึงดูดยอดขาย (`magnetizer.png`)
> *"ทุกโพสต์ต้องมีเป้าหมาย"* · คอนเทนต์ที่ปิดการขายได้
```
isometric voxel 3D character mascot of an energetic creator holding a big
horseshoe magnet, pulling floating gold coins, tiny shopping carts and heart
icons toward a glowing phone screen, confident dynamic pose, chunky pixel
cubes, matte clay, soft studio light + warm rim, ROOTMAN palette with antique
gold #b8860b accent, 3/4 front isometric view, floating with soft drop shadow,
centered, transparent background, no text, no logo --ar 1:1 --style raw
```

#### 6. THE EDUCATOR — นักสอนสร้างศรัทธา (`educator.png`)
> *"สอนให้เขาเก่งขึ้น แล้วเขาจะจ่าย"* · ให้ความรู้ สร้างความน่าเชื่อถือ
```
isometric voxel 3D character mascot of a trustworthy teacher with glasses,
pointing at a floating holographic gold diagram / mini chalkboard with simple
shapes, glowing attention arrows from small learner dots, calm credible
expression, chunky pixel cubes, matte clay, soft studio light + warm rim,
ROOTMAN palette with antique gold #b8860b accent, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

### 🔬 ตระกูล EXPERT — สีเน้น tan/bronze `#c4956a`

#### 7. THE SPECIALIST — ผู้เชี่ยวชาญเฉพาะทาง (`specialist.png`)
> *"ทักษะที่คมคือสินทรัพย์"* · แก้ปัญหาที่คนยอมจ่ายแพง
```
isometric voxel 3D character mascot of a precise specialist craftsman focused
on work, holding one specialized tool (a sleek laptop or precision instrument),
a floating bronze gear and a small glowing premium gem representing high value,
calm expert focus, chunky pixel cubes, matte clay, soft studio light + warm
rim, ROOTMAN palette with tan/bronze #c4956a accent, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

#### 8. THE ADVISOR — ที่ปรึกษามือโปร (`advisor.png`)
> *"ขายผลลัพธ์ ไม่ใช่ชั่วโมง"* · ความรู้ + ปิดงานเป็นระบบ
```
isometric voxel 3D character mascot of a professional consultant in a smart
suit, holding a clipboard/roadmap, pointing at a floating rising results bar
chart with bronze checkmarks, composed confident posture, chunky pixel cubes,
matte clay, soft studio light + warm rim, ROOTMAN palette with tan/bronze
#c4956a accent, 3/4 front isometric view, floating with soft drop shadow,
centered, transparent background, no text, no logo --ar 1:1 --style raw
```

#### 9. THE MENTOR — โค้ชผู้สร้างคน (`mentor.png`)
> *"ความสำเร็จของศิษย์คือพอร์ตของคุณ"* · เปลี่ยนความรู้เป็นคอมมูนิตี้
```
isometric voxel 3D character mascot of a warm coach/mentor guiding a smaller
figure up a set of glowing steps, passing a small torch of light, a soft
community ring of tiny figures around them, encouraging expression, chunky
pixel cubes, matte clay, soft studio light + warm rim, ROOTMAN palette with
tan/bronze #c4956a accent, 3/4 front isometric view, floating with soft drop
shadow, centered, transparent background, no text, no logo --ar 1:1 --style raw
```

### ⚙️ ตระกูล OPERATOR — สีเน้น gunmetal steel + gold rivets

#### 10. THE SYSTEMIZER — นักวางระบบ (`systemizer.png`)
> *"ระบบที่ดีทำงานแทนคุณ"* · ทำงานหลังบ้านให้ลื่นไหล
```
isometric voxel 3D character mascot of a calm systems engineer surrounded by
neatly interlocking gunmetal gears and a clean floating flowchart, holding a
checklist tablet, orderly composed posture, gold rivet accents on steel,
chunky pixel cubes, matte clay, soft studio light + warm rim, ROOTMAN palette
with gunmetal steel and antique gold #b8860b accents, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

#### 11. THE EXECUTOR — นักลงมือจริง (`executor.png`)
> *"ทำให้เสร็จ ดีกว่าทำให้สมบูรณ์แบบ"* · ปิดงานได้ทั้งขายและส่งมอบ
```
isometric voxel 3D character mascot of a hands-on doer with rolled-up sleeves,
stamping a glowing checkmark on a floating to-do list with items crossed off,
a tool (hammer or keyboard) in the other hand, reliable determined expression,
gold rivet accents on steel, chunky pixel cubes, matte clay, soft studio light
+ warm rim, ROOTMAN palette with gunmetal steel and gold accents, 3/4 front
isometric view, floating with soft drop shadow, centered, transparent
background, no text, no logo --ar 1:1 --style raw
```

#### 12. THE ORCHESTRATOR — ผู้จัดวางทีม (`orchestrator.png`)
> *"อย่าทำงานหนักขึ้น ให้ระบบทำแทน"* · ขยายงานผ่านระบบและคน
```
isometric voxel 3D character mascot of a conductor-like leader directing
several small worker figures/bots arranged around a floating org-chart and SOP
scroll, holding a baton, commanding yet calm posture, gold rivet accents on
steel, chunky pixel cubes, matte clay, soft studio light + warm rim, ROOTMAN
palette with gunmetal steel and antique gold accents, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

### 🛒 ตระกูล MERCHANT — สีเน้น amber/gold-soft `#d4a017`

#### 13. THE TRADER — พ่อค้าหัวไว (`trader.png`)
> *"ของที่หมุนเร็ว คือของที่ดี"* · มองสินค้าและ Margin ออก
```
isometric voxel 3D character mascot of a quick-witted trader juggling small
product boxes, upward amber price arrows and flowing gold coins around them, a
compact market-stall vibe implied by a few stacked crates, sharp opportunistic
grin, chunky pixel cubes, matte clay, soft studio light + warm rim, ROOTMAN
palette with amber/gold-soft #d4a017 accent, 3/4 front isometric view,
floating with soft drop shadow, centered, transparent background, no text, no
logo --ar 1:1 --style raw
```

#### 14. THE CURATOR — นักคัดสรรแบรนด์ (`curator.png`)
> *"แบรนด์คือเหตุผลที่คนซื้อซ้ำ"* · เลือกของเป็น เล่าแบรนด์ได้
```
isometric voxel 3D character mascot of a tasteful brand curator elegantly
presenting a premium product on a small pedestal/display shelf under a soft
spotlight, a subtle brand tag, refined poised gesture, chunky pixel cubes,
matte clay, soft studio light + warm rim, ROOTMAN palette with amber/gold-soft
#d4a017 accent and cream highlights, 3/4 front isometric view, floating with
soft drop shadow, centered, transparent background, no text, no logo --ar 1:1
--style raw
```

### 🏗️ ตระกูล BUILDER — สีเน้น ember red + gold

#### 15. THE ARCHITECT — สถาปนิกสินทรัพย์ (`architect.png`)
> *"สร้างครั้งเดียว ให้มันทำงานตลอด"* · สร้างสินทรัพย์ที่ขยายได้
```
isometric voxel 3D character mascot of a visionary builder holding an unrolled
blueprint scroll, beside a modular voxel tower self-assembling upward with a
small crane, structural and systematic vibe, patient focused expression,
chunky pixel cubes, matte clay, soft studio light + warm rim, ROOTMAN palette
with ember red #c23b22 and antique gold #b8860b accents, 3/4 front isometric
view, floating with soft drop shadow, centered, transparent background, no
text, no logo --ar 1:1 --style raw
```

#### 16. THE VISIONARY — นักสร้างอนาคต (`visionary.png`)
> *"เริ่มจากภาพที่คนอื่นยังไม่เห็น"* · เห็นภาพใหญ่ ดึงคนตามได้
```
isometric voxel 3D character mascot of an inspiring visionary pointing toward a
glowing gold star / future horizon, a floating holographic city or big idea
above the hand, a few small follower silhouettes looking up, bold forward-
leaning pose, chunky pixel cubes, matte clay, soft studio light + warm rim,
ROOTMAN palette with ember red #c23b22 and antique gold #b8860b accents, 3/4
front isometric view, floating with soft drop shadow, centered, transparent
background, no text, no logo --ar 1:1 --style raw
```

---

## 3) ตารางสรุป (slug → ไฟล์ → ตระกูล → สีเน้น)

| # | Identity | Thai | slug / ไฟล์ | Base Type | สีเน้น |
|---|---|---|---|---|---|
| 1 | THE CLOSER | นักปิดดีล | `closer.png` | hunter | crimson |
| 2 | THE RAINMAKER | พ่อค้านักล่า | `rainmaker.png` | hunter | crimson |
| 3 | THE CONNECTOR | นักเชื่อมโอกาส | `connector.png` | hunter | crimson |
| 4 | THE STORYTELLER | นักเล่าเรื่อง | `storyteller.png` | creator | gold |
| 5 | THE MAGNETIZER | นักดึงดูดยอดขาย | `magnetizer.png` | creator | gold |
| 6 | THE EDUCATOR | นักสอนสร้างศรัทธา | `educator.png` | creator | gold |
| 7 | THE SPECIALIST | ผู้เชี่ยวชาญเฉพาะทาง | `specialist.png` | expert | tan/bronze |
| 8 | THE ADVISOR | ที่ปรึกษามือโปร | `advisor.png` | expert | tan/bronze |
| 9 | THE MENTOR | โค้ชผู้สร้างคน | `mentor.png` | expert | tan/bronze |
| 10 | THE SYSTEMIZER | นักวางระบบ | `systemizer.png` | operator | steel+gold |
| 11 | THE EXECUTOR | นักลงมือจริง | `executor.png` | operator | steel+gold |
| 12 | THE ORCHESTRATOR | ผู้จัดวางทีม | `orchestrator.png` | operator | steel+gold |
| 13 | THE TRADER | พ่อค้าหัวไว | `trader.png` | merchant | amber |
| 14 | THE CURATOR | นักคัดสรรแบรนด์ | `curator.png` | merchant | amber |
| 15 | THE ARCHITECT | สถาปนิกสินทรัพย์ | `architect.png` | builder | ember+gold |
| 16 | THE VISIONARY | นักสร้างอนาคต | `visionary.png` | builder | ember+gold |

---

## 4) วิธีนำภาพเข้าโปรเจกต์ (เมื่อสร้างเสร็จ)

1. บันทึกภาพ PNG โปร่งใสไว้ที่ `public/personas/identities/<slug>.png`
2. เพิ่ม map ใน `src/components/persona/persona-image.tsx` (หรือสร้าง
   `IDENTITY_IMAGES` ใหม่) แล้วให้ result/report/dashboard/home ใช้ภาพตาม
   `identity.slug` แทนภาพ base type
3. ปัจจุบันระบบ fallback ใช้ภาพตาม `identity.baseType` (6 ภาพ) อยู่แล้ว —
   จึงค่อย ๆ ทยอยแทนได้โดยหน้าเว็บไม่พัง

> เคล็ดลับความสม่ำเสมอ: สร้างทีละตระกูลในรอบเดียว (seed เดียวกัน) เพื่อให้สัดส่วน
> ตัวละครและวัสดุเหมือนกัน แล้วค่อยไล่เปลี่ยนพร็อพ/สีเน้นตามอัตลักษณ์
