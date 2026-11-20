---
name: Nusantara Toybox Adventure
colors:
  surface: '#fff8f6'
  surface-dim: '#ffd0bb'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae1'
  surface-container-high: '#ffe2d6'
  surface-container-highest: '#ffdbcc'
  on-surface: '#351000'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#561f00'
  inverse-on-surface: '#ffede6'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c49'
  primary: '#006947'
  on-primary: '#ffffff'
  primary-container: '#00855b'
  on-primary-container: '#f5fff6'
  inverse-primary: '#69dba8'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006577'
  on-tertiary: '#ffffff'
  tertiary-container: '#008096'
  on-tertiary-container: '#f9fdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#86f8c2'
  primary-fixed-dim: '#69dba8'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#fff8f6'
  on-background: '#351000'
  surface-variant: '#ffdbcc'
typography:
  display-hero:
    fontFamily: Rubik
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 56px
    letterSpacing: 0.02em
  display-hero-mobile:
    fontFamily: Rubik
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 38px
    letterSpacing: 0.01em
  headline-lg:
    fontFamily: Rubik
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Rubik
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Rubik
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Rubik
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '800'
    lineHeight: 22px
    letterSpacing: 0.03em
  label-md:
    fontFamily: Rubik
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Rubik
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-fidelity, tactile 3D game interface tailored specifically for 7-year-old Malaysian primary students (KSSR Tahap 1, Tahun 1). The aesthetic fuses top-tier mobile simulation game ergonomics (chunky proportions, immediate kinetic feedback, juicy micro-interactions) with an authentic celebration of traditional Malaysian visual architecture. 

The visual style is **Tactile Toyetic Skeuomorphism** blended with **Cultural Modernism**:
- **Tactile Toyetic Depth:** Buttons look chewable, pillowy, and physically stampable, sporting cast shadows, inner rim lights, glossy resin specular highlights, and physical bevels.
- **Sculpted Cultural Materiality:** Panels invoke carved chengal wood (*ukiran kayu*), rimmed with burnished brass and golden filigree, accented by soft woven motifs inspired by songket borders and *kelarai* geometric weaves.
- **Child-First Affordance:** Hit targets are deliberately oversized, interactive components react with squash-and-stretch energy, and iconographic glyphs accompany every textual label to guide early readers.
- **Atmospheric Palette:** The UI reflects a sun-drenched, hyper-saturated tropical paradise—lush padi fields, cool limestone river turquoise, warm clay terracotta, and royal songket purples.

## Colors

The palette balances joyful tropical saturation with grounded natural materials:

- **Primary (Zamrud Hutan / Emerald Green - `#0D9668`):** Represents the vibrant Malaysian rainforest and lush padi growth. Applied to core progression mechanics, positive confirmations, dynamic level progress bars, and high-impact action triggers.
- **Secondary (Emas Diraja / Royal Amber Gold - `#F59E0B`):** Inspires warmth, reward, and cultural nobility. Used for coins, golden filigree borders, star ratings, premium CTA buttons, and achievement banners.
- **Tertiary (Sungai Jeram / River Turquoise - `#06B6D4`):** Derived from cascading jungle waterfalls and tranquil rivers. Utilized for energy meters, quest portals, informational chips, and magical discovery nodes.
- **Neutral (Kayu Chengal / Warm Deep Timber - `#78350F`):** Anchors the physical world with the rich depth of polished Malaysian hardwoods. Serves as the base for frame bevels, deep container borders, readable high-contrast typography, and structural panel backing.
- **Accent - Bunga Raya Red (`#E11D48`):** High-urgency notifications, quest alerts, and close/cancel targets.
- **Accent - Songket Violet (`#7C3AED`):** Mastery stars, magical Wau Bulan flights, and wisdom/knowledge collectibles.
- **Surface Canvas (`#FFFBEB` - Pulut Santan):** A warm, soft ivory-cream surface avoiding harsh sterile digital white, mimicking natural bleached bark or woven pandan paper.

## Typography

Typography prioritizes extreme legibility for early-stage Malay readers while retaining game-ready enthusiasm:

- **Display & Headlines (`Rubik`):** A chunky, geometric font with rounded terminals that harmonizes with 3D candy-bevel styling. When rendered inside buttons or modal banners, headlines feature thick exterior outlines (`stroke: 3px #451A03`) and warm directional drop-shadows to ensure instantaneous legibility against complex 3D environments.
- **Body Text (`Plus Jakarta Sans`):** Clean, open counters and distinct character shapes (notably single-story 'a' and distinguishable 'l' vs '1') engineered for 7-year-olds developing literacy in Bahasa Melayu. Generous line-heights prevent cognitive overload during reading prompts.
- **Labels & Numbers (`Rubik`):** High-weight treatment for currencies, countdown clocks, quest progress counters, and immediate navigational prompts.

## Layout & Spacing

The layout operates on a landscape-first, touch-optimized fluid layout constructed primarily for tablets and touch displays common in modern classrooms and homes, gracefully adapting down to mobile:

- **HUD Safe Areas:** Persistent HUD containers (XP bar, Bintang, Syiling Emas, Wau energy) occupy anchor points at the top-left and top-right with an explicit `margin` offset of `1.5rem` to avoid device notches and rounded hardware corners.
- **Touch-First Target Sizing:** Minimum interactive targets strictly adhere to `56px × 56px` (ideal `64px × 64px`) to accommodate developing motor skills of 7-year-old players.
- **Modal Viewports:** Dialogue popups, shop panels, and inventory trays never exceed 90% of screen height and maintain a central focal anchor with generous interior component padding (`space-lg`).
- **Reflow Architecture:** On smaller displays, auxiliary secondary controls collapse into a unified wooden pull-drawer (*Laci Alat*), prioritizing unobstructed exploration of the 3D village canvas.

## Elevation & Depth

Visual hierarchy uses physical, tactile extrusion inspired by premium physical toys and 3D diorama games:

- **The Plinth Layer (Base World):** Flat 3D game canvas overlaid by structural wooden frames (*Papan Chengal*).
- **Extruded 3D Surface Panels:** Modals and containers are built from layered plates featuring an inner carved rim (1px light amber highlight at top, 2px deep sepia shadow at bottom) bounded by a solid `4px` solid border (`#5C240A`).
- **3D Convex Buttons (Candy Bevels):** Interactive buttons possess distinct physical thickness. The button face has a dual highlight: a linear gloss highlight across the top 40% and a heavy 4px bottom extrusion shadow (`#065F46` on green buttons; `#B45309` on gold buttons). On touch/press, the element physically shifts downward (`translateY(4px)`) while removing the bottom extrusion shadow to simulate a physical mechanical spring.
- **Ambient Floor Shadows:** Floating dialogs, avatars, and HUD trays project warm, tinted, diffused drop shadows (`rgba(69, 26, 3, 0.35)`) rather than dead grayscale blurs, maintaining environmental warmth.
- **Gleam & Sparkle Accents:** High-tier reward cards feature animated specular glints and a soft radial glow (`box-shadow: 0 0 24px rgba(245, 158, 11, 0.45)`).

## Shapes

The design system embraces ultra-friendly, soft, bouncy silhouettes without turning completely oval or jelly-like:

- **Containers & Panels:** Standard panels utilize `rounded-lg` (16px) with structural borders that evoke traditional wooden construction joints (*tanggam*).
- **Interactive Buttons & Badges:** Primary actions use `rounded-xl` (24px) or full pill curves for high touchability and child-friendly ergonomics.
- **Cultural Motif Cuts:** Select high-level celebratory modals incorporate subtle 45-degree corner bevels or arched roofs reminiscent of the *Bumbung Panjang* of traditional Rumah Melayu.
- **Pill Badges:** Counters for Syiling, Berlian, and Tenaga use continuous pill shapes with inset bevels, creating the illusion of embedded gemstones.

## Components

### Buttons (*Butang Tindakan*)
- **Primary CTA (Emas & Zamrud):** Chunky 3D buttons. Minimum height `56px`. Composed of a rich gradient face, an embossed 2px white-gloss top edge highlight, and a solid 4px base rim mimicking an extruded physical block. When pressed, the button depresses with a responsive auditory clack and haptic click.
- **Secondary / Utility Button (Papan Kayu):** Chengal wood surface texture with carved icon glyphs (e.g., Settings, Map, Inventory). Uses deep sepia border outlines with warm inset lighting.

### Resource Counters & Chips (*Cip Sumber & Tenaga*)
- Pill-shaped indicators combining an oversized 3D spinning coin or glowing gem overflowing the left edge of the chip.
- Background uses a dark, semi-translucent root-wood brown with bright golden or turquoise typography displaying current counts.
- Features a bouncy numerical ticker animation whenever rewards are accumulated.

### Quest & Dialogue Cards (*Kad Misi & Papan Cerita*)
- Light parchment background (`#FEF3C7`) framed in warm timber with delicate *ukiran* corner flourishes.
- Features large, expressive character busts (e.g., Sang Kancil, Tok Ketua, Pak Belukang) anchored cleanly on the card’s left flank.
- Text uses high-contrast dark wood brown (`#451A03`) in `body-lg` to guarantee reading ease for Year 1 pupils.
- Interactive audio button (*Dengar Suara*) always available alongside text for full phonetic speech assistance.

### Selection Controls (*Kotak Pilihan & Radio*)
- Traditional radio circles and check squares are replaced with physical 3D "Stamps" (*Cop Ukiran*).
- Selected state: Displays a vibrant, embossed Wau Bulan or Keris star stamped down with a golden spark particle effect.
- Unselected state: Carved, recessed depression in a light wooden base.

### Progress Bars (*Palang Kemajuan KSSR*)
- Framed like a carved bamboo or brass conduit with an inset track.
- Filled with liquid-like, animated emerald or river-turquoise gradient containing roving specular bubble highlights.
- Segmented milestones marked by small circular brass medallions indicating educational sub-modules (e.g., Huruf Vokal, Nombor Asas).

### Modal Dialogs (*Tetingkap Utama*)
- Dimmed ambient backdrop with tropical leaf silhouettes floating softly in the background blur.
- Centered stage framed with golden songket filigree, crowned with a decorative Wau Bulan archway.
- Large, unmistakable "X" dismissal button styled as a chunky red candy bead positioned proud of the top-right corner.