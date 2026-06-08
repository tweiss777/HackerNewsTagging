# Hacker News App

## What I built

- I built a web application that consumes the Hacker News Api, tags articles relevant to the user, and summarizes the article using AI.
- The front end uses **React**, **Tailwind**, and **ShadCN** for the front-end while the backend uses **Node.JS**, **Express**, and the **OpenAI** SDK.

## How to run it

- In `docker-compose.yml`, assign env variables for `OPEN_AI_API_KEY` and `OPEN_AI_MODEL`. If no model is passed then it defaults to `gpt-5.4`.
- Run `docker compose up` and point your browser to `http://localhost`.
- You can also launch the client and server separately if you don't wish to run it through docker
  **Client** - Run `yarn dev`
  **Server** - Run `yarn watch`

## What works

### Backend

- **Story feeds** — Endpoints to fetch top, new, and best stories, plus lookup by id.
- **Topic tagging** — Rule-based classifier assigns topic tags from the story title, URL, and text (e.g. `show_hn`, `ai_ml`, `security_privacy`). If no rules match, ChatGPT assigns tags via structured output.
- **Intent tag scorer** — After topic tags are assigned, each story gets an intent label based on engagement signals and the user's interests:
  - `read_now` — topic tags overlap with the user's interests **and** the story is high-signal (score > 100, comment count > 50)
  - `skim_comments` — comment count exceeds score (discussion-heavy thread)
  - `bookmark_later` — default for everything else
- **Summarization** — OpenAI streams a summary when the client passes a story id.
- **User profile** — In-memory profile stores interests and blocked topic tags; interests feed directly into the intent scorer.

### Frontend

- Browse and search stories across top, new, and best feeds.
- Topic and intent tags shown on story cards and the article detail page.
- Streamed ChatGPT summaries on demand.
- User profile page to add/remove interests and blocked tags (interests affect intent scoring on newly fetched stories).

## What's incomplete

- **Blocked tags** — The UI lets you block topic tags, but nothing in the backend or feed filtering actually deprioritizes or hides those stories.
- **Intent scorer coverage** — Nine intent labels are defined, but only three are assigned today (`read_now`, `skim_comments`, `bookmark_later`).
- **Stale personalization** — Intent tags are computed once when a story is first cached. Changing interests does not re-score existing stories.
- **No persistence** — Stories, tags, and the user profile live in server memory only. Restarting the server clears the profile and cached tags.
- **Summaries not saved** — `discussionSummary` exists on the story model, but streamed summaries are only kept in the browser until you leave the page.
- **Story lookup from cache only** — Fetching a story by id only works if that story was already loaded through a feed. There is no on-demand fetch from the Hacker News API.
- **Unbounded feed loading** — The server fetches every story id in a feed and tags each one individually, which is slow and can trigger many OpenAI calls on first load.
- **Embeddings / semantic search** — The `embedding` field is defined but never populated or used.
- **No personalized feed ordering** — Stories are sorted by date only; there is no ranking by intent or user interests.

## Tradeoffs made

- **Rule-based tagging before ChatGPT** — Topic tags are assigned in-server using regex and heuristics on the story title, URL, and text (e.g. matching `Show HN`, known domains, keyword patterns). ChatGPT is only called when no rules match. This cuts unnecessary API calls and token cost on the majority of stories, at the cost of maintaining hand-written rules that won't catch every edge case an LLM would handle more flexibly.
- **Rule-based intent scoring** — Intent labels (`read_now`, `skim_comments`, `bookmark_later`) are derived from engagement signals and user interests without an LLM call. Fast and free, but less nuanced than AI-driven classification.
- **In-memory cache** — Simple and fast to implement for a prototype, but data is lost on restart and doesn't scale across multiple server instances (see **If I had more time**).

## What I used AI for

### In the application

- **Topic tagging (fallback)** — OpenAI assigns topic tags only when the rule-based classifier finds no match.
- **Summarization** — Streams an on-demand article summary when the user clicks Summarize on a story page.

### During development

- **Debugging** — Resolving type errors, dependency issues, and other small blockers.
- **Implementation** — Designing and building the tagging and intent classifiers, React pages and routes, shared types, and the `fetch` wrapper around the API client.

## If I had more time

- **Redis or Valkey caching** — Replace the in-process `Map` cache with a shared cache layer so story records, tags, and summaries survive server restarts and can be shared across instances.
- **Database persistence** — Store stories, topic tags, intent tags, and summaries in a database (e.g. Postgres). On each feed request, only fetch new or stale items from the Hacker News API instead of re-downloading and re-tagging the entire feed on every cold start.
- **Background sync** — Run a periodic job to refresh feeds and update scores/comment counts in the database, keeping the UI fast while data stays reasonably fresh.
