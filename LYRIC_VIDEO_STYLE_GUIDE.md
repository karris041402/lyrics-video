# Lyric Video Creative Style Guide

Version: 2.0 (adds section 9, the established house style, approved through the "Real" project)  
Purpose: Reusable creative direction for Claude Code + Remotion lyric-video projects.  
Reference: The user-provided ~62-second vertical lyric-video reference. This document captures _stylistic characteristics_, not a mandate to replicate the footage or branding.

## 1. Creative intent

Create expressive, fast-moving, **mixed-media cinematic lyric edits**, not plain subtitle/karaoke videos. The lyrics are the visual protagonist: words change scale, arrangement, color, emphasis, timing, and relationship to the background. The visual language should feel deliberately edited to the music rather than generated from one repeating template.

Treat this guide as the **default visual grammar**, not a fixed storyboard. The song's emotion, lyrical meaning, supplied assets, and user feedback override specific style choices. Ask when a direction is ambiguous; do not fabricate assets.

## 2. Observed motifs in the reference

- **High-contrast lyric compositions:** black or white full-frame backgrounds alternate with photographic/cinematic footage and color graphics.
- **Dynamic kinetic typography:** giant cropped words, very small accompanying words, stretched or elongated text, irregular positions, tightly timed replacement of phrases, stacked lines, and mixed type weights.
- **Word/phrase emphasis:** one important lyric can dominate the entire frame while surrounding text is reduced or temporarily disappears.
- **Mixed media:** cinematic-looking footage of people/architecture alternates with abstract vector/graphic compositions. Use user-provided/licensed imagery; do not assume permission to reuse the original reference's footage.
- **Graphic interludes:** colored curves/lines, rings/outlined circles, simple illustrated symbols, blur and motion trails; some words are highlighted in yellow, red, blue, or purple against largely neutral palettes.
- **Changes in visual rhythm:** alternating quieter readable holds with sudden large text jumps, zooms, quick cuts and spatial transitions.
- **Portrait/mobile-first editing:** reference is vertical short-form video; honor each new project's requested aspect ratio.
- **Layered text over footage:** text is sometimes thin/light over moving imagery and sometimes bold against clean graphic backgrounds. Contrast/readability must remain adequate.

These are observations from representative frames; exact timing, transitions, and audio correspondence must be analyzed from the supplied source and song for each project.

## 3. Motion design rules

1. Animate to **vocal word onset** for lyric appearance and to **musical beats/onsets** for selective cuts, pulses, and impacts. They are different timing tracks.
2. Avoid applying animation to every single syllable mechanically. Mix expressive accent hits with calm readable phrases.
3. Develop each 5–15-second passage as an intentional mini-sequence: establish an image, spotlight a lyric, vary scale/layout, then transition.
4. Prefer thoughtfully composed cuts and motivated spatial transitions to constant random zoom/shake.
5. Text must remain readable long enough for the singer's phrasing; don't sacrifice recognition for spectacle.
6. Use a varied visual vocabulary: giant typography, minimal black/white sections, footage-backed lines, shape-driven interludes, and occasional lyric-focused abstract movement.
7. Effects such as blur, scale overshoot, smear, camera pan, parallax, masks and shakes are permitted where motivated by the track, not as blanket presets.
8. Respect safe areas for TikTok/Reels overlays. Preserve sufficient contrast on all backgrounds.
9. No added watermarks. Credit/rights requirements for third-party assets must be honored.

## 4. Inputs required per song

All paths below are relative to the song folder `songs/<song-name>/` (see 9.10).

- `assets/<song>.mp3`, `.m4a` or `.wav`: full original track, retained as the final soundtrack.
- `assets/<song>_lyrics_aligned.json`: timestamped lyrics aligned to the original track. Prefer **word-level** timing, but line-level timing is a valid start. Times are seconds from the start of the original audio.
- `assets/` (or `assets/visuals/`): optional user-curated images, video clips, textures and overlays.
- `assets/reference.mp4`: optional per-song visual reference.
- `SONG_BRIEF.md` (in the song folder): song-specific mood, preferred colors/footage, forbidden elements, canvas dimensions, ending treatment, any special direction.

### Suggested `lyrics.json` format

```json
{
  "version": 1,
  "audioFile": "assets/<song>.mp3",
  "language": "fil",
  "segments": [
    {
      "id": "line-001",
      "start": 3.2,
      "end": 5.85,
      "text": "Sample lyric line",
      "words": [
        { "text": "Sample", "start": 3.2, "end": 4.05 },
        { "text": "lyric", "start": 4.12, "end": 4.65 },
        { "text": "line", "start": 4.74, "end": 5.85 }
      ]
    }
  ]
}
```

Validate: timestamps are nonnegative, ordered, and within audio duration; preserve exact lyric spelling; flag suspicious gaps/overlaps for human review. Do not silently rewrite lyric text. If only line-level timestamps exist, never pretend word timing is known; derive and review word timing as an optional separate step.

## 5. Visual assets: flexible usage

The user's provided images and video clips are a **creative palette**, not a required one-to-one mapping. Select them where the mood and lyric meaning support them. Do not force every image to appear. For critical assets, the brief may pin an asset to a specific timestamp or lyric. When available footage is unsuitable, use authored vectors, typography, gradients or simple effects instead; do not substitute unrelated stock footage without approval.

## 6. Recommended Claude Code workflow

### Phase A — Intake and planning (no scene implementation yet)

1. Read this file and `songs/<song>/SONG_BRIEF.md` first.
2. Inspect MP3 duration, lyric JSON validity, assets, aspect ratio and existing Remotion project structure.
3. Optionally measure audio beats and verify timestamp alignment; if word-level timing is already reliable, skip expensive transcription/separation.
4. Prepare `songs/<song>/SCENE_PLAN.md` covering the full song by lyric phrases: mood arc, key visual accents, intended asset usage, and major transitions. Use the supplied reference to infer design language, not to copy shots verbatim.
5. Ask for confirmation on the first segment's treatment if needed.

### Phase B — Incremental production

1. Keep **one continuous, frame-accurate song timeline** (global audio time). Design and render **review chunks** of about 60 seconds, rather than building isolated projects with clocks that each restart at zero.
2. At a chunk boundary, plan both neighboring phrases; render with an optional short overlap/handles for transition review, but do not duplicate audio or lyrics in the final assembly.
3. Implement the first 0:00–1:00 chunk using reusable Remotion React/TypeScript components and a per-song scene configuration. Render a preview MP4 and extract selected frames for inspection.
4. Pause for user feedback. Make targeted revisions to the chunk until explicitly approved.
5. Lock approved chunks conceptually (do not change without request), then proceed 1:00–2:00, 2:00–3:00, etc. Maintain scene transitions and design variation across boundaries.
6. At the end, render a single full-length composition with the **original MP3 exactly once** (preferred). If stitching preview clips instead, take special care to avoid duplicated/lost frames or repeated audio at boundaries.

### Phase C — Quality assurance

- Check word/line timing against the original audio, including pauses and repeated words.
- Review actual rendered frames, not only source code or console logs.
- Inspect rapid cuts for unintended blank frames, flashing, cropped text, low contrast and safe-area collisions.
- Verify segment boundary continuity and music-to-video sync at beginning, middle and end.
- Verify source media licensing/permissions when publishing, especially music and film clips.
- Preserve existing unrelated compositions, configs and assets.

## 7. User commands to expect

- “Use the style guide and make a scene plan for this song. Don't render yet.”
- “Make 0:00–1:00. Prioritize giant kinetic text, but insert my background image during the softer phrase.”
- “At 0:34, replace the harsh zoom with a minimal black-and-white typographic scene.”
- “Approved first minute. Make 1:00–2:00 without changing approved work.”
- “Render the final full-song MP4 and check synchronization.”

## 8. Guiding principle

**Consistency of editing identity does not mean repetition of effects.** Keep the same level of intentionality, typography, tempo-awareness and polished motion design, while adapting scene structure to the musical and emotional arc of each song. Avoid generic slideshows and default karaoke templates.

## Typography-First Visual Production Rule

The lyric video must be capable of achieving a professional cinematic motion-graphics aesthetic without requiring external background images or video footage.

Default visual approach:

- Treat kinetic typography as the primary visual element.
- Use expressive 2D and 3D text animations.
- Create dynamic camera movements, perspective shifts, zooms, rotations, and depth effects.
- Incorporate procedural backgrounds, abstract geometric shapes, particles, masks, and motion graphics.
- Synchronize motion with vocal delivery, musical beats, and emotional intensity.
- Use creative transitions and varied scene compositions to avoid repetitive animation patterns.
- Maintain a strong visual hierarchy and lyric readability.

External images and video clips are optional creative enhancements, not mandatory dependencies.

When external visual assets are unavailable, independently design compelling typography-driven scenes instead of leaving the composition visually empty.

Prioritize artistic direction, smooth motion, strong composition, and polished animation over excessive or random effects.


## 9. Established house style (default for every new song in this folder)

This folder is the primary workspace for lyric videos. Section 9 records the style the user approved on the "BE REAL" video (`songs/be-real/src/`, render `songs/be-real/out/v3d-landscape.mp4`). **Where section 9 conflicts with sections 1–8, section 9 wins.** Start new songs from it; vary scene content, not the system.

### 9.1 What the user wants (and rejected)

- **One idea from start to end.** The video is one story told through changing *presentations* of the lyrics (a stage, a chat, a carousel, a tunnel, notifications, a finale). Rejected: 18 unrelated scenes, scattered text, random sizes, and "a phone with lyrics plus the same lyrics outside it".
- **Cohesive typography.** Size, placement and colour relate to each other. Rejected: random small/huge jumps and text floating around the frame.
- **Real motion.** Rejected: a polished but static layout. Every scene change is a 3D camera move; every word has an entrance; the background always moves a little.
- **Creative but not OTT.** Low-contrast background motion, no constant shake, no blanket effects.
- **Readability first.** Every lyric must be fully readable while it is being sung.

### 9.2 Format

- 1920x1080, 30 fps, landscape (unless the song brief says otherwise). Original audio included once, untouched.
- Fonts are Windows-only (Segoe UI Semibold / Black / Emoji). Renders on another OS will differ; say so in the report.

### 9.3 Type system (the "one scale" rule)

- `BODY` 96px (Segoe UI Semibold) for ordinary words; `HERO` 180px (Segoe UI Black, extruded 3D) for the one key word of each line (two at most). Defined in `src/tokens.ts` of the song folder; per-line hero indexes in `HERO_KEYS`.
- Text inside phone/notification UI uses its own two sizes: `UI` 52 and `UIHERO` 96 (`kit.tsx` in the song folder).
- One exception per song: the finale hero (`FIN_HERO` 300). Do not add more.
- Line layout: body words above, hero word, body words after. Put a line on **two rows at most**; join a trailing short word to the row above instead of wrapping (e.g. "...nagbago sa" / "kamalayan"). In cards and bubbles the hero and its trailing words share a row.
- Centre the text block when nothing else shares the frame (the opening stage), so there is no dead strip on one side. Use left-aligned text only when the neighbouring line, a meme or a phone fills the other side.

### 9.4 Colour

- Dark navy base `#0d0f1a`, ink `#f5f6fa`, one accent per section that crossfades (0.35 s) at section starts: yellow, coral, blue, teal, back to yellow. The active word takes the accent.

### 9.5 Motion rules

- **Word entrance** is always the same: slide up ~26px, blur-in, fade, on the aligned onset (`Wd`, `HeroX`). Hero words swing in on Y with a depth push, then sway and open their tracking while sustained.
- **Scene transitions are camera moves, never plain cuts or fades**: push-through, flip off to one side with the next scene entering from the other, phone rising from below, flying through a plane. Use `Stage` in `kit.tsx` (`left`, `right`, `rise`, `through`, `deep`). Start a transition in the pause or over a sustained note, never over a word still being sung.
- **Presentation modes** (pick a different one for each section of the song; reuse the code in `songs/be-real/src/`):
  - open stage: centred lines, spotlight that searches then locks on a key word, glitch/strike on a "false" word;
  - Messenger-style chat on a slanted 3D phone: each line becomes a sent bubble built word by word; header, "Today" stamp, compose bar, seen avatar, emoji reactions;
  - carousel: lines on a rotating wheel, the wheel turns to each line, the next line is a dim preview on the right (fast/rap sections);
  - tunnel: the camera flies through each line over a moving grid floor (momentum sections);
  - notification cards: stacked 3D cards, typing-dots card for "other people", cards swiped away on a dismissive lyric (reflective sections);
  - finale: one giant extruded 3D hero, slow orbit, a small "sent" tag closing the chat motif.
- **Chat/phone is one scene, not an overlay.** Lyrics live only inside the phone while it is on screen. Never add lyrics that are not in the JSON; emoji, "Seen", typing dots, timestamps and header text are allowed as UI.
- **Background (always on, additive, low contrast)**: accent glow, drifting soft orbs, slowly rotating dashed rings, rising dust, an occasional light sweep, drifting dot grid, small beat pulse from the instrumental stem. Add layers; do not replace them.
- **Beat data** (`beats.ts`, `pulse()`) drives only subtle pulses, never lyric timing.
- 3D rules: use `perspective` + `preserve-3d` + stacked `translateZ` layers for extrusion. Opacity/filter/overflow on a parent flatten its 3D children, so apply opacity per element and keep the 3D group un-faded. Hide not-yet-sung words with `visibility`/opacity (not unmounting) so layout never jumps, except bubbles/cards that should grow as sung (`OnlyOn`).

### 9.6 External images (memes, photos)

- Only use images the user supplies in `songs/<song>/assets/`; import them from there (no copy into `public/`). Never download or invent assets. If one is low resolution, say so.
- A meme must look like it **belongs to the video**: place it on the empty side of the line it reacts to, in the same plane as the text so it travels with the camera, pop it in on the hero word's onset with the same spring, rounded corners, white border, glow in the accent family, slight tilt and bob, and the small seen-avatar from the chat motif (`MemeCard`). Size about 620px, vertically centred in the frame.

### 9.7 Data and timing rules (unchanged, repeated because they matter)

- `assets/<song>_lyrics_aligned.json` is edited by hand by the user: **read-only**. Import it directly (`data.ts` in the song folder); never rewrite or "fix" it. Report timing conflicts (overlaps, line start/end differing from word times, 0.02 s words) instead of silently fixing them.
- Display windows are derived from word times only (`showFrom`/`showTo`).
- Do not claim visual verification unless rendered frames were actually inspected. Motion/audio sync can only be confirmed by the user watching; say so.

### 9.8 Working agreement

- The user usually gives feedback as Taglish, scene by scene ("sa line na ..."). Make **targeted** revisions; do not redo approved scenes.
- Never overwrite earlier renders: write each revision to a new file (`songs/<song>/out/<song>-v1.mp4`, then `v1b`, `v1c`, ...). Render stills to `songs/<song>/out/stills/` for inspection before the full render.
- Wait for approval before a *big redesign*. Small requested adjustments can be applied and rendered immediately.
- Final report: file path, what changed, what was verified (stills only vs. watched), limitations (fonts, low-res images, JSON conflicts), in short Taglish.

### 9.9 Starting a new song (checklist)

1. Read this guide, the song brief and the aligned JSON; list lyric lines with times.
2. Write a one-paragraph through-line, then assign a presentation mode per section (9.5) and a hero word per line (`HERO_KEYS`). Share it before building if the song is very different from "Real".
3. Copy `songs/be-real/` to `songs/<new-song>/` (see 9.10), clear `assets/`, `out/` and `archive/`, then rework the scenes. Register the new composition in the root `src/Root.tsx`.
4. Check for 2-row lines, centre vs. left alignment, empty sides (fill with a supplied meme or neighbour preview), then render stills, then the full video.

### 9.10 Folder structure (one folder per song)

Everything that belongs to a song lives in `songs/<song-name>/`: code, assets and renders. The folder name is the song title in kebab-case (the last song is `songs/be-real/`).

```
songs/<song-name>/
  assets/        audio, <song>_lyrics_aligned.json (read-only), template, memes, reference video
  src/           the video code (BeReal.tsx, kit.tsx, SceneA/B/C.tsx, data.ts, tokens.ts, Hero.tsx, motion.ts, beat.ts, beats.ts)
  out/           final renders; stills/ for QA frames
  archive/       superseded attempts (not compiled)
  SCENE_PLAN.md  the plan for this song
  SONG_BRIEF.md  optional song-specific brief
```

Outside the song folders only project-wide things remain: `LYRIC_VIDEO_STYLE_GUIDE.md`, `src/index.ts`, `src/Root.tsx` (one `<Composition>` per song), `src/assets.d.ts`, `tools/` (helper prompts), `package.json`, `tsconfig.json`, `remotion.config.ts`.

Rules:
- Audio and images are **imported from the song's `assets/`** (`import song from "../assets/<file>.m4a"`), not through `public/`. There is no root `public/` or `assets/`.
- A song's code does not import from another song. To start a new song, copy the whole folder, then replace assets and rework `HERO_KEYS`, scene timings and stage windows.
- Renders go to `songs/<song>/out/`, never to a root `out/`.
- Checks: `npm run lint` (eslint + tsc over `src` and `songs/*/src`).
