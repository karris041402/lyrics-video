# SCENE_PLAN: "Real" (landscape, v3)

Status: approved by the user through `out/v3d-landscape.mp4`. Replaces the old vertical plan (18 unrelated scenes). Style rules live in `LYRIC_VIDEO_STYLE_GUIDE.md` section 9.

Source of truth: `assets/real_lyrics_aligned.json` (hand-edited by the user, read-only, imported by `src/lyrics/data.ts`). Audio: `assets/real_IBALsS5z.m4a` (copy in `public/`), 57.21 s, used once, untouched. Canvas 1920x1080, 30 fps. Composition id `LyricV3` (`src/v3/LyricV3.tsx`, registered in `src/Root.tsx`). Beat data from the instrumental stem (`src/lyrics/beats.ts`, about 60.6 BPM) drives only subtle pulses.

## Through-line

One conversation with yourself about being real when nobody is watching. It opens on an empty stage under a searching spotlight ("kung walang nakatingin"), moves into a chat with "Real" (you tell yourself the same words), then speeds through a carousel (changes), a tunnel (momentum), and a stack of notifications (other people's opinions) that get swiped away ("di bale na"). It ends on one giant 3D "tunay ka" and a small "Sent" tag that closes the chat motif.

## Scenes

| # | Time (s) | Lines | Presentation | Accent | Entry / exit move |
|---|---|---|---|---|---|
| S1 | 0.73-11.4 | 1-4 | Open stage, centred lines. Spotlight searches, locks on "nakatingin". "fake" splits into two colour ghosts and gets struck through. | yellow | fade-in from black; exits left (11.0-11.8) |
| S2 | 11.4-21.7 | 5-8 | Messenger-style chat on a slanted 3D phone. Each line is a sent bubble built word by word. Reactions 👀 (line 7) and 😬 (line 8), seen avatar, compose bar. | yellow | phone rises from below (10.6-11.5); exits left (21.75-22.45) |
| S3 | 22.08-32.77 | 9-14 | Carousel. The wheel turns to each line; next line is a dim preview on the right. Line 14 "totoo": cat meme (`cat_meme_agree.jpg`) pops in on the right, about 620 px, vertically centred. | coral | enters from the right (21.75-22.45); camera pushes through (32.85-33.5) |
| S4 | 33.07-43.3 | 15-18 | Tunnel. Camera flies through each line over a moving grid floor, strafing right. Line 18 "totoo": second meme (`caat_meme_agree2.jpg`), same placement and pop. | blue | emerges from depth (32.85-33.5); push-through (43.0-43.6) |
| S5 | 43.2-53.28 | 19-22 | Notification cards, two rows each. Typing-dots card at 49.4-50.7 ("may masasabi ba"). Older cards swipe away from the word "di" of "di bale na"; the last card leaves 0.45 s before its line ends. | teal | cards drop in from above |
| S6 | 53.28-57.21 | 23 | Finale: "basta" small, "tunay ka" at 300 px extruded 3D, slow orbit, "ka" opens its tracking over the sustained note (54.17-55.27). "Sent" tag at 55.6. 0.8 s fade to black. | yellow | rises in from depth |

Persistent layers on every scene: accent glow, drifting soft orbs, slow dashed rings, rising dust, an occasional light sweep, drifting dot grid.

## Lines and hero words

| Line | Text | Hero |
|---|---|---|
| 1 | ano man ang marating | marating |
| 2 | lagi lang ako na same | same |
| 3 | kung walang nakatingin | nakatingin |
| 4 | di pa rin magiging fake | fake |
| 5-8 | repeat of 1-4 | same heroes |
| 9 | dami na rin ang nagbago sa kamalayan | kamalayan |
| 10 | dami ring hinagod sa kaalaman | kaalaman |
| 11 | sabi ko sa akin | akin |
| 12 | anu man ang mangyare | mangyare |
| 13 | wag ka magiging peke | peke |
| 14 | maging totoo lang | totoo |
| 15 | kahit ano pa man ang magiging takbo | takbo |
| 16 | ng buhay basta galingan mo | galingan |
| 17 | laging umabante lang at tapatan mo | umabante |
| 18 | ng pagiging totoo mo sa lahat ng to | totoo |
| 19 | kung ganiyan ka, uh | ganiyan |
| 20 | di mo na kailangan na isipin pa | isipin |
| 21 | ung mga tao kung may masasabi ba | masasabi |
| 22 | mabuti masama man ay di bale na | masama |
| 23 | basta tunay ka | tunay, ka |

Hero indexes are in `HERO_KEYS` (`src/v2/tokens.ts`). Lines are shown on two rows at most (body row, then hero plus trailing words).

## Code map

- `src/v3/kit.tsx`: type sizes, `Stage` (camera-move transitions), `Backdrop`, `Wd`/`HeroX`/`HeroG`, `Plane` (line layout), `MemeCard`.
- `src/v3/SceneA.tsx`: S1 stage, S2 chat. `SceneB.tsx`: S3 carousel, S4 tunnel. `SceneC.tsx`: S5 notifications, S6 finale.
- `src/v3/LyricV3.tsx`: stage windows and audio. Restyle one scene = edit that scene's component; retime a transition = edit its `Stage` props.
- Shared: `src/lyrics/` (data, motion, beats) and `src/v2/` (tokens, `Extrude`). Older attempts (`src/lyrics`, `src/proto`, `src/v2`) are kept, not used by v3.
- Renders: `out/v3-landscape.mp4`, `v3b`, `v3c`, `v3d` (latest approved). Add a new letter for each revision.

## Accent colours

yellow `#ffd84d` (S1, S2, S6), coral `#ff7a6b` (S3), blue `#7aa7ff` (S4), teal `#5eead4` (S5). Crossfade 0.35 s at section starts. Base `#0d0f1a`, ink `#f5f6fa`.

## Timing conflicts in the JSON (reported, not changed)

- line-011 starts at 27.70 but its first word starts at 27.48; line-010 ends at 27.70, so lines 10 and 11 overlap for about 0.2 s.
- line-018 starts at 40.67 but its first word starts at 40.60; its end (43.30) overlaps line-019 start (43.20).
- line-001/002/018/021/022 `end` differs from the last word `end`. Display uses word times only.
- Several words are 0.02 s long (e.g. "na" 22.40-22.42, "ung" 48.17-48.18). They keep their onset time; they appear together with their neighbours.

## Known limits

- Fonts are Segoe UI (Windows only); other machines will render differently.
- The two cat memes are low resolution (370 px and 400 px) and are shown at about 620 px, so they look soft. Replace the files in `public/cat1.jpg` and `public/cat2.jpg` if larger versions exist.
- Motion, transition timing and audio sync were verified from rendered still frames only. They need the user's review by watching.
- Messenger "Notes" bubble was not built.
