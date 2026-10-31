# Product Requirements Document

> **How to use this template:** Replace everything in `[brackets]`. Text in *italic guidance* explains what goes in each section; delete it once filled. Keep requirements short, testable, and tagged with a priority (P1 = low … P10 = high).

| Field | Value |
|---|---|
| Project name / code | [e.g. Project B298] |
| Organization | [Company / team / course] |
| Division / group | [e.g. Wearables division] |
| Product manager | [Name] |
| Team members | [Names + roles] |
| Date created | [MM/DD/YYYY] |
| Last updated | [MM/DD/YYYY] |
| Version | [e.g. 0.1] |
| Status | [Draft / In review / Approved] |

---

## 1. Introduction

Garmin Connect is the companion app for Garmin's wearables, where users review activities, follow training plans, and track performance over time. Its interface currently leans toward a professional, data-dense style built for experienced athletes. Our user interviews suggest this creates friction for everyday users: features that already exist are hard to find and adjust, and the large volume of metrics does not automatically help users understand their progress. This project explores how a redesigned Connect interface could make existing features easier to discover and use, turn raw data into understandable insight, and deliver guidance at the moment it is actually useful.

- **Background / context:** Garmin Connect pairs with Garmin watches to record and display workout data (e.g. cadence, training load) and offers features such as adjustable training plans and suggested workouts. The current UI is professional-focused and presents a lot of data at once.
- **Problem / opportunity:**
  - **Navigation and discoverability.** One interviewee struggled to navigate Connect and to adjust their training plans, a frustration the team has also experienced firsthand. Useful features exist but are hard to find and use.
  - **Data vs. understanding.** The same interviewee sometimes has to look up unfamiliar metrics such as cadence, and team members also do outside research to interpret what Connect shows. Showing more data does not automatically help users understand their progress.
  - **Timing of guidance.** Another interviewee opens their watch with an activity already in mind, so a suggested run often arrives after their workout decision is made and feels irrelevant. When guidance appears may matter as much as what it says.
- **What users are asking for:** Easier access to existing features (especially training-plan adjustments), plain-language explanations of metrics, and a clearer sense of progress over time. Interviewees showed interest in progress tracking and summaries.
- **Concept to explore (hypothesis, not yet validated):** A clearer, more enjoyable progress recap, similar to Spotify Wrapped, that explains changes in consistency, activities, or performance in readable language. The interviews support interest in progress and summaries but do not yet establish demand for this specific format; this needs further testing.
- **Enabling technology / trends:** Garmin devices already collect rich activity and performance data, so the opportunity lies in presentation rather than new sensors. Consumer apps like Spotify have shown that personalized, story-style recaps of usage data are engaging and shareable.

## 2. Objectives

*What will this project achieve, and how will you know it worked?*

- **Project goal:** [One sentence describing what you will build and for whom]
- **Business objectives:** [e.g. reach X users / $Y revenue / Z% market share by DATE]
- **User objectives:** [What users will be able to do that they can't today]
- **Competitive positioning:** [Which competitors you must match or beat, and on what features]

### 2.1 Success Metrics

| Metric | Current baseline | Target | How measured | By when |
|---|---|---|---|---|
| [e.g. Weekly active users] | [0] | [500] | [Analytics] | [MM/YYYY] |
| [e.g. Task completion rate] | [ ] | [ ] | [Usability test] | [ ] |
| [ ] | [ ] | [ ] | [ ] | [ ] |

### 2.2 Scope

Every requirement in Section 4 falls into one of three groups:

- **MVP:** built for the first prototype (P7–P10).
- **Later:** worth building after the MVP (P3–P6).
- **Won't build:** not built by this project, either because Garmin's watch already does it or because there is too little evidence it is needed.

The MVP follows Release 1 of the user story map (4.0): everything a casual user needs to review and share a run in the app, plus the casual-first interface rules.

#### MVP (P7–P10)

| Area | Requirements |
|---|---|
| Finish, save & sync | 1.2 instant data with sync status · 2.11 "summary ready" notification |
| Review the run | 1.3 summary leads with core metrics · 1.5 past runs list · 2.7 run history details |
| Share | 1.6 share in ≤3 taps · 2.8 share run summary |
| Casual-first interface | 1.1 journey-based navigation · 1.4 metric explanations · 1.7 reduced data density · 1.8 accessibility · 3.1 two-layer structure · 3.2 ≤3–4 items per screen · 3.3 everyday language · 3.4 meaning for each data point · 3.5 daily tasks in ≤3 taps · 3.6 short onboarding · 3.7 confirm & undo · 3.8 clear feedback |

#### Later (P3–P6)

| Area | Requirements |
|---|---|
| Decide to run (Release 2) | 1.9 readiness card · 2.15 suggested distance · 2.12 weekly / monthly summaries · 3.9 guidance timing |
| Get ready (Release 2) | 1.10, 2.16 weather, air quality & heat-risk alerts |
| In-run alerts (Release 2) | 2.17 high heart rate alert |
| Review the run (Release 2) | 1.11, 2.21 compare recent performance |
| Social (Release 2) | 1.13, 2.22 viewing friends' runs (challenges and club runs are in Won't build) |
| Friend privacy controls | 4.1–4.7 (needed once the social features ship) |
| Training plans | 2.9 reschedule with suggested adjustments · 2.10 rescheduled workout sync · 4.8 build a plan · 4.9 edit plan · 4.10 rest-day limits · 4.11 custom structured workouts |
| Routes | 4.12 create route · 4.13 save route · 4.16 route privacy |
| Advanced layer (Layer 2) | 3.10 detailed metrics on second layer · 3.11 advanced charts one tap away · 3.12 Advanced mode · 3.14 advanced settings area |
| Other | 2.13 favorite activities · 2.14 Strava auto-upload |

#### Won't build

**A. Existing Garmin watch capabilities (dependencies, not built)**

This project redesigns the Garmin Connect app. These story map Release 1 tasks are still part of the user's journey, but they already work on Garmin watches, so the MVP relies on them rather than building them (see Section 5).

| Req | Function | Why we don't build it |
|---|---|---|
| 2.1 | Battery warning before a run | Existing watch behavior; outside the app's scope |
| 2.2 | Start a run with GPS check | Existing watch behavior |
| 2.3 | Live pace, distance, time, heart rate | Existing watch behavior |
| 2.4 | Pause / resume recording | Existing watch behavior |
| 2.5 | End and save a run on the watch | Existing watch behavior; the app's run summary (1.3) is in the MVP |
| 2.6 | Background sync from watch to app | The sync already exists; the MVP redesigns how sync status is shown (1.2, 3.8), not the sync itself |
| 4.14 | Turn-by-turn route navigation | Watch-side feature; routes are not in the MVP |

**B. Cut: little evidence or poor fit for casual users**

| Req | Function | Why we don't build it |
|---|---|---|
| 2.19 | Hydration reminders | Lowest priority (P3); not supported by interviews or use cases |
| 2.18 | Pace, distance-milestone & return-before-dark alerts | More in-run alerts add noise for casual users; not supported by interviews |
| 1.12, 2.20 | Rate run difficulty, record mood, edit activity | Adds an extra step after every run; not supported by interviews |
| 2.22 (part) | Friend relay challenge & organizing a club run | Large social features with no supporting evidence; only viewing friends' runs is backed by Use Case #3 |
| 4.15 | Attach a route to a planned workout | Depends on both routes and training plans, neither of which is in the MVP |
| 3.13 | Pin advanced metrics to the simple view | Works against the simple first layer; Advanced mode (3.12) already serves experienced users |

## 3. Use Cases

### User Case #1: The Goal-Oriented Runner

A recreational runner follows a regular training schedule alongside strength workouts. They value their Garmin watch's performance data and workout prompts but find the app's training plans difficult to customize. When they miss a session, rescheduling becomes frustrating, leading them to seek plans from other apps and AI tools.

After waking up sore on a day with a scheduled run, the runner opens the improved Garmin app. The dashboard displays the planned workout alongside training readiness and recovery information. They move the run to another day, review the suggested schedule changes, and confirm them. The updated workout syncs to their watch, preserving its warm-up and interval prompts. They can maintain a consistent training plan while accommodating recovery and changes in availability.

- **Features illustrated:**
  - Dashboard showing today's planned workout with training readiness and recovery — 1.9, 3.9
  - Easy rescheduling of a planned workout — 2.9, 3.5, 4.9
  - Suggested schedule adjustments with user confirmation — 2.9, 3.7, 4.10
  - Sync of the updated workout to the watch with structured prompts (warm-up, intervals) preserved — 2.10, 4.11
  - Training plan that fits strength workouts and availability — 4.8, 4.9

### User Case #2: The Busy Fitness Enthusiast

A busy fitness enthusiast exercises to stay healthy, choosing activities around their schedule and the weather. They wear their Garmin mainly during exercise and use the app afterward to review performance charts and monthly activity summaries. However, slow syncing sometimes causes them to close the app before seeing their results.

After a workout, they open the improved Garmin app. It immediately displays previously synced activities and clearly indicates that the latest workout is still transferring. They can leave the app and receive an optional notification when the summary is ready. Later, they review a concise workout overview and weekly activity totals. At the end of the month, they can quickly assess their consistency without searching through menus or waiting on a loading screen.

- **Features illustrated:**
  - Instant display of previously synced data with clear sync-in-progress status — 1.2, 2.6, 3.8
  - Optional notification when a workout summary is ready — 2.11
  - Concise post-workout overview — 1.3, 3.2, 3.4
  - Weekly activity totals and monthly consistency summary — 2.12
  - Summaries reachable without searching through menus — 1.1, 3.5

### User Case #3: The Self-Directed Athlete

An experienced recreational athlete exercises around existing commitments and personal preferences. They use their Garmin primarily to record activities rather than decide what to do. Generic workout suggestions rarely fit their plans, while seeing friends' activities helps motivate them to stay active.

Before a workout, they open the improved Garmin app and select an activity from their favorites. Afterward, they review a brief summary of the session's key metrics. With their existing Strava connection enabled, the activity uploads automatically, and the app confirms the transfer. A weekly activity view brings different types of exercise together, helping them recognize their consistency. They can track progress and connect with friends while continuing to choose activities that fit their routine.

- **Features illustrated:**
  - Quick-start from favorite activities — 2.13
  - Brief post-workout summary of key metrics — 1.3, 2.5, 3.2
  - Automatic Strava upload with transfer confirmation — 2.14, 3.8
  - Combined weekly view across activity types — 2.12
  - Seeing friends' activity, with control over what is shared — 1.13, 2.22, 4.1–4.7

## 4. Requirements

*Group requirements by aspect. Write each as "The product shall …", make it measurable where possible, and tag a priority (P1–P10). Add, rename, or remove aspects to fit your product.*

### 4.0 User Story Map

**Persona:** Garmin Device Casual User  **Activity:** Go for a run

The story map follows the run journey from left to right. Release 1 covers the core tasks needed to complete a run; Release 2 adds guidance, safety, reflection, and social features. *Surface* shows whether a step happens mainly on the watch or in the Garmin Connect app (the focus of this project).

| Journey step | Surface | Release 1 | Release 2 |
|---|---|---|---|
| Decide to run | App | — | View suggested distance; check weekly activity; view sleep score, stress level, recovery time |
| Get ready | Watch + App | Check watch battery | Air quality / heat risk alert; check weather |
| Start the run | Watch | Activate run activity; check GPS connection; start recording | — |
| Keep track while running | Watch | View pace; view distance; view elapsed time; view heart rate | High heart rate alerts; fast pace alerts; return-before-dark alerts; distance milestone alerts |
| Take a water break (optional) | Watch | Pause recording; resume recording | Optional hydration reminders |
| Finish and save | Watch → App | End run; save activity; view run summary; sync activity to app | — |
| Review the run | App | View past runs | Rate run difficulty; record post-run mood; edit saved activity; compare recent performance |
| Share with friends | App | Share run summary | View friends' runs; challenge a friend (friend relay); organize a club run |

**Priority convention:** The MVP is Release 1 plus the cross-cutting interface requirements that shape how Release 1 screens are built (simple first layer, plain language, clear feedback). MVP requirements are rated P7–P10. Release 1 watch tasks (2.1–2.6) keep their high priority because the journey depends on them, but they are existing Garmin capabilities and are not built by this project. Release 2 tasks and features not on the story map are rated P3–P6. See 2.2 Scope for the full MVP / Later / Won't build lists.

### 4.1 Product Design
*App interface requirements derived from the story map and the interview findings in Section 1 (navigation, data comprehension, timing of guidance).*

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 1.1 | The app's navigation shall follow the run journey (prepare → review → share), with each step's main features reachable within 2 taps of the home screen. | (P9) | Tap-count audit of prototype; ≥80% of usability-test participants find each feature without help |
| 1.2 | The app shall display previously synced activities immediately on launch and show a clear progress indicator while the latest activity syncs. | (P9) | No blocking loading screen on launch; sync status visible within 1 s |
| 1.3 | The run summary shall lead with the four core metrics (pace, distance, elapsed time, heart rate) before detailed charts. | (P9) | Core metrics visible above the fold on a standard phone screen |
| 1.4 | Every metric shown shall offer a plain-language explanation in the app (e.g. tap to learn what cadence means). | (P8) | 100% of displayed metrics have an explanation; participants can explain a metric's meaning after reading it |
| 1.5 | Past runs shall be viewable in one reverse-chronological list, reachable from the home screen. | (P8) | Usability test: participants open a specific past run in <15 s |
| 1.6 | Sharing a run summary shall take no more than 3 taps from the summary screen. | (P8) | Tap-count audit |
| 1.7 | Screens shall show fewer primary metrics than the current Connect app, using hierarchy (size, color, grouping) to distinguish key data from detail, while staying recognizably Garmin. | (P7) | Side-by-side comparison with current app; participant ratings of clarity and brand recognition |
| 1.8 | The interface shall meet WCAG 2.1 AA color-contrast and text-size guidelines. | (P7) | Contrast checker on all screens |
| 1.9 | The home screen shall include a glanceable readiness card combining weekly activity, suggested distance, and sleep / stress / recovery. | (P6) | Card present on home screen; participants can state whether they are ready to run |
| 1.10 | The home screen shall show weather, air quality, and heat-risk warnings before a run. | (P5) | Conditions shown on home screen; warnings appear when thresholds are exceeded |
| 1.11 | A "compare recent performance" view shall summarize changes in readable language rather than charts alone. | (P5) | Each comparison includes a written summary sentence |
| 1.12 | After saving a run, the app shall offer an optional one-step prompt to rate difficulty and record mood. | (P4) | Prompt can be completed or skipped in one tap |
| 1.13 | A social area shall bring together friends' runs, challenges, and club runs. | (P4) | All three features reachable from one tab |

*In-run watch features from the story map (alerts, pause/resume, GPS) are covered in 4.2 Functionality.*

### 4.2 Functionality
*What the product must do across the run journey (story map, 4.0) and the use cases (Section 3). Watch-side requirements describe existing Garmin capabilities the app experience depends on.*

**Release 1 — core run**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 2.1 | The watch shall show its battery level and warn the user before starting a run if the battery is too low to record it. | (P8) | Warning appears below a set threshold (e.g. 10%) |
| 2.2 | The user shall be able to start a run activity from the watch, which confirms GPS connection before recording begins. | (P10) | GPS status shown; recording starts in one action once GPS is ready |
| 2.3 | During a run, the watch shall display live pace, distance, elapsed time, and heart rate. | (P10) | All four metrics visible and updating during a test run |
| 2.4 | The user shall be able to pause and resume recording, with paused time excluded from moving time. | (P9) | Paused segment not counted in moving time on the summary |
| 2.5 | The user shall be able to end and save a run, then see a run summary on the watch. | (P10) | Saved activity appears in history with summary |
| 2.6 | Saved activities shall sync automatically from the watch to the app in the background. | (P10) | Activity appears in app without user action when phone is nearby |
| 2.7 | The app shall store all past runs and let the user open any run's full details. | (P9) | All synced runs accessible from history |
| 2.8 | The user shall be able to share a run summary as an image or link to messaging and social apps. | (P8) | Share sheet opens with summary image; tested on iOS and Android |

**Use-case features**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 2.9 | The user shall be able to move a planned workout to another day, review suggested adjustments to the rest of the plan, and confirm or reject them. *(Use Case #1)* | (P6) | Rescheduling completed in usability test without help; plan updates only after confirmation |
| 2.10 | Rescheduled structured workouts shall sync to the watch with their warm-up and interval prompts intact. *(Use Case #1)* | (P5) | Workout steps on watch match the plan after rescheduling |
| 2.11 | The app shall send an optional notification when a workout's summary has finished syncing. *(Use Case #2)* | (P7) | Notification arrives after sync completes; can be turned off in settings |
| 2.12 | The app shall provide weekly activity totals and a monthly consistency summary that combine all activity types. *(Use Cases #2, #3)* | (P6) | Totals match the sum of recorded activities across types |
| 2.13 | The user shall be able to mark activities as favorites and start one from the favorites list. *(Use Case #3)* | (P6) | Favorite activity starts in ≤2 actions |
| 2.14 | With a connected Strava account, activities shall upload automatically and the app shall confirm the transfer. *(Use Case #3)* | (P6) | Upload confirmation shown; activity appears in Strava |

**Release 2 — guidance, safety, reflection, social**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 2.15 | The app shall suggest a run distance based on recent training load and recovery (sleep score, stress level, recovery time). | (P6) | Suggestion changes with recovery data; participants rate suggestions as reasonable |
| 2.16 | The app shall show current weather and alert the user to poor air quality or heat risk before a run. | (P5) | Alert triggers when local AQI or heat index exceeds a set threshold |
| 2.17 | The watch shall alert the user during a run when heart rate exceeds a user-set limit. | (P6) | Alert triggers within 5 s of crossing the limit |
| 2.18 | The watch shall offer optional alerts for pace (too fast), distance milestones, and returning before dark. | (P4) | Each alert can be toggled individually; triggers correctly in test runs |
| 2.19 | The watch shall offer optional hydration reminders at a user-set interval or distance. | (P3) | Reminder fires at the set interval |
| 2.20 | After a run, the user shall be able to rate its difficulty, record their mood, and edit activity details (title, type, notes). | (P4) | Edits and ratings saved and shown on the activity |
| 2.21 | The app shall compare a run with the user's recent runs and highlight changes in pace, distance, and consistency. | (P5) | Comparison shown for any run with ≥3 previous runs of the same type |
| 2.22 | The user shall be able to view friends' runs, challenge a friend (friend relay), and organize a club run. | (P4) | Each feature works between two test accounts |

*The use-case features (2.9–2.14) are not on the story map. Only 2.11 (sync notification) supports a Release 1 task and is in the MVP; the rest are post-MVP.*

### 4.3 Interactivity / User Experience
*The app is designed first for casual daily users. Simple, everyday information sits on the first layer; professional and advanced features remain available on a second layer, one tap deeper, so experienced athletes lose nothing.*

**Layer 1: casual daily use (default)**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 3.1 | The app shall use a two-layer structure: every screen opens in a simple view, with advanced data and settings behind a clearly labeled "More details" or "Advanced" control. | (P10) | Every main screen has a simple default view and a visible path to the advanced layer |
| 3.2 | The first layer shall show no more than 3–4 key items per screen (e.g. today's plan, readiness, latest activity, weekly progress). | (P9) | Screen audit of prototype |
| 3.3 | First-layer text shall use everyday language instead of technical terms (e.g. "How hard it felt" instead of "Training Effect"; "Steps per minute" instead of "Cadence"), with the technical term available on tap. | (P9) | Participants with no training background understand all first-layer labels |
| 3.4 | Each data point shall be paired with a short explanation of what it means for the user (e.g. "Your pace was faster than last week"). | (P8) | Every first-layer metric has a one-line interpretation |
| 3.5 | Common daily tasks (check today's plan, review last run, reschedule a workout, share a run) shall each be completable in 3 taps or fewer from the home screen. | (P9) | Tap-count audit; usability test completion without help |
| 3.6 | New users shall complete a short onboarding (≤ 1 minute) that asks for their goal and experience level and sets up a casual-friendly home screen. | (P8) | Timed onboarding test; home screen matches selected goal |
| 3.7 | Interactions shall be forgiving: changes such as rescheduling, editing, or deleting an activity shall show a confirmation and offer undo. | (P8) | Undo available after each destructive or plan-changing action |
| 3.8 | The app shall give clear feedback for every action and background process (e.g. syncing, saving, uploading to Strava), so users never wonder whether something worked. | (P8) | Each action shows a visible status or confirmation |
| 3.9 | Guidance (suggested workouts, readiness tips) shall appear at moments when the user is still deciding, such as the morning or before choosing an activity, not only after an activity starts. | (P5) | Guidance shown on home screen before activity selection; interview follow-up confirms relevance |

**Layer 2: professional / advanced features**

*Layer 2 is post-MVP. In the MVP, the "More details" entry point from 3.1 can lead to the existing Connect screens, so experienced users keep access to their data while the redesign focuses on the casual first layer.*

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 3.10 | Detailed metrics (e.g. cadence, VO2 max, training load, heart rate zones, lap splits, running dynamics) shall remain available on the second layer of each relevant screen. | (P6) | All metrics in the current Connect app are reachable from the new design |
| 3.11 | Advanced charts and analysis (trends, zone distribution, comparisons) shall open from the simple view with one tap and return to it with one tap. | (P5) | Navigation test between layers |
| 3.12 | Users shall be able to switch to an "Advanced mode" that shows second-layer data by default. | (P4) | Mode setting persists across sessions |
| 3.13 | Users shall be able to pin selected advanced metrics to their first layer, customizing their home and summary screens. | (P3) | Pinned metric appears on the chosen screen |
| 3.14 | Advanced settings (custom data screens, zone thresholds, sensor pairing) shall be grouped in one Advanced settings area, separate from everyday settings. | (P4) | Everyday settings screen contains no advanced options |

### 4.4 Customization
*Ways users tailor the product to their privacy preferences, training goals, and running locations.*

**Data sharing & privacy (what friends can see)**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 4.1 | The user shall choose a default visibility for their activities: Only me, Friends, or Everyone. New users shall default to Friends or more private. | (P6) | Setting available during onboarding and in settings; default verified on a new account |
| 4.2 | The user shall be able to control which data types friends can see, individually: activity type, distance, duration, pace, route map, heart rate, and health data (sleep, stress, recovery). | (P6) | Each toggle hides that data from a test friend account |
| 4.3 | Health data (heart rate, sleep, stress, recovery) shall be private by default and shared only if the user turns it on. | (P6) | New account: friend view shows no health data |
| 4.4 | The user shall be able to override visibility for a single activity before or after sharing it. | (P5) | Changing one activity's visibility does not affect others |
| 4.5 | The user shall be able to hide the start and end of route maps within a set radius of chosen locations (e.g. home, work). | (P5) | Map shown to friends excludes the hidden area |
| 4.6 | The user shall be able to preview exactly what a friend sees before sharing. | (P4) | "View as friend" screen matches the friend's actual view |
| 4.7 | Visibility settings shall be explained in plain language in one settings screen, reachable within 2 taps from the profile. | (P4) | Usability test: participants correctly predict what a friend will see |

**Custom training schedule**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 4.8 | The user shall be able to build a training plan by choosing a goal (e.g. 5K, 10K, half marathon, general fitness), a target date, and the days of the week they are available. | (P6) | Plan generated that only schedules workouts on available days |
| 4.9 | The user shall be able to add, remove, swap, or move individual workouts in their plan, including non-running sessions such as strength training. (Rescheduling behavior: see 2.9.) | (P6) | Each edit is saved and reflected on the calendar and watch |
| 4.10 | The user shall be able to set preferred rest days and maximum weekly running days, which suggested adjustments shall respect. | (P5) | Suggested changes never break these limits |
| 4.11 | The user shall be able to create custom structured workouts (warm-up, intervals, cool-down, targets for pace or heart rate) and save them for reuse. | (P4) | Custom workout syncs to the watch and runs with correct prompts |

**Custom routes**

| ID | Requirement | Priority | Acceptance criteria / how verified |
|---|---|---|---|
| 4.12 | The user shall be able to create a route by drawing on a map or generating a loop of a chosen distance from a starting point. | (P6) | Generated loop within ±5% of chosen distance |
| 4.13 | The user shall be able to save a route from a completed run and reuse it. | (P5) | Saved route appears in the route library |
| 4.14 | Saved routes shall sync to the watch for turn-by-turn navigation during a run. | (P5) | Watch shows route and direction prompts during a test run |
| 4.15 | The user shall be able to attach a saved route to a planned workout in their training schedule. | (P4) | Route loads automatically when the planned workout starts |
| 4.16 | The user shall control route visibility separately from activity visibility (see 4.1–4.5). | (P4) | A route marked private is hidden from friends even if the activity is shared |

## 5. Assumptions, Dependencies & Risks

| Type | Description | Impact | Mitigation |
|---|---|---|---|
| Assumption | [e.g. Users already own a smartphone] | [ ] | [ ] |
| Dependency | Existing Garmin watch features for recording a run: battery warning, GPS start, live metrics, pause / resume, save (2.1–2.5) | The MVP's review and share screens need recorded runs | Use existing watch behavior; prototype with sample run data |
| Dependency | Existing watch-to-app sync (2.6) | Run data must reach the app before the redesigned screens can show it | Design for sync delays with clear status (1.2, 3.8) |
| Risk | [e.g. Cost exceeds target] | [High/Med/Low] | [ ] |

## 6. Open Questions

*Things you don't know yet that could change the requirements.*

- [Question 1]
- [Question 2]
- [What pivots are possible if early user testing shows the concept is undesirable?]

## 7. Milestones

| Milestone | Target date | Deliverable | Owner |
|---|---|---|---|
| Concept presentation | [MM/DD/YYYY] | [ ] | [ ] |
| Prototype / MVP | [MM/DD/YYYY] | [ ] | [ ] |
| User testing | [MM/DD/YYYY] | [ ] | [ ] |
| Design presentation | [MM/DD/YYYY] | [ ] | [ ] |
| Design freeze | [MM/DD/YYYY] | [ ] | [ ] |
| Planned release / launch | [MM/DD/YYYY] | [ ] | [ ] |

---

## Appendix: Explanation of Terms

| Term | Definition |
|---|---|
| P1–P10 | Priority of the requirement, from low (P1) to high (P10). |
| [Acronym] | [Definition] |
| [Acronym] | [Definition] |

