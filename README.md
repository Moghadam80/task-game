# Lifelands — Game Explorer

A production-oriented **Game Explorer** built for the Lifelands Frontend Technical Assignment.

The section is Persian/RTL and includes server-side initial fetching, client-side search and filtering, URL-persisted state, favorites, Load More pagination, accessibility, runtime API validation, unit-tested data logic, image fallbacks, and virtualization for larger result sets.

## Tech Stack

- Next.js `16.3.8` — App Router / Server Components
- React `19.2.8`
- TypeScript `5.9.3` with `strict: true`
- Tailwind CSS `4.3.3`
- TanStack Query `5.104.1`
- Axios `1.20.0`
- Jest `30.5.2`
- ESLint `9.39.5`
- `next/image`

No `any`, `@ts-ignore`, or `as unknown as` is used.

## Run Locally

```bash
git clone <YOUR_REPOSITORY_URL>
cd task-game
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run build
npm start
npm run typecheck
npm run lint
npm test
```

## Architecture

```text
app/page.tsx
    │
    ▼
GamesSection (Server Component)
    │  initial server fetch
    ▼
GameGrid (Client Component)
    ├── search / filters / sort
    ├── URL state
    ├── favorites
    ├── Load More
    └── virtualization

Browser → /api/games → Lifelands API
```

### Server / Client split

- `app/page.tsx` is a Server Component and provides the page shell.
- `GamesSection.tsx` is a Server Component and fetches the first page.
- `GameGrid.tsx` is the main Client Component for browser interaction.
- Leaf components are client-side only when they need browser APIs or interaction.

The initial data is therefore **not loaded with `useEffect`**.

## API Layer

The browser never calls the Lifelands API directly. It requests the local Next.js route:

```text
Browser → /api/games → https://lifelands.ir/api/v1/games
```

The server fetch uses the API's real response shape. Runtime guards validate the response before it becomes application data.

The API envelope is modeled with a reusable generic, and the game/page types are derived from the fields actually consumed by the application.

## Search & Persian Normalization

Search is debounced by **300ms** and matches both `title` and `companyName`.

Before matching, `normalizePersian()`:

- converts `ي` → `ی` and `ك` → `ک`
- converts Persian/Arabic digits to Latin digits
- removes ZWNJ
- collapses whitespace
- trims the result

This logic is pure and lives in `lib/`, so it can be tested without React.

## Filters & Sorting

Supported filters include:

- Vendor (`vitrinThirdPartyVendors`)
- Category
- Minimum score
- Orientation
- Favorites only

Filters are defined through a configuration array so the UI can render them from configuration instead of hard-coded branches.

Sorting supports the required numeric fields plus the derived **quality** score. Numeric sort keys are constrained with a mapped TypeScript type rather than `string`.

### Quality score

The quality option combines `score`, `rating`, and `like` into one normalized heuristic. The calculation is isolated in `lib/quality.ts` and is documented there so the weighting can be changed independently from the UI.

## URL State

Search, filters, sort, and favorites-only state are represented in the URL.

This means:

- shared links restore the same view
- browser Back/Forward restores previous state
- the URL is the source of truth instead of duplicating filter state in unrelated components

## Load More

I chose **Load More** instead of traditional numbered pagination.

It fits an explorer/grid experience better because users can continue discovering games without losing the current result set. The server still fetches pages using the API's `pageId`/pagination information.

The implementation checks the actual returned array length and pagination metadata instead of assuming that `total` always equals the number of returned items. This prevents incorrect Load More behavior when the API response is inconsistent.

Search and filters operate on the games currently loaded in the browser. With more time, server-side search/filter parameters could reduce the amount of data transferred for very large datasets.

## Race-Safe Async Loading

Additional pages are loaded through TanStack Query and protected with `AbortSignal`.

If the relevant request becomes stale, the previous request can be cancelled rather than allowing an outdated response to overwrite the current state. No artificial `setTimeout` is used to solve race conditions.

## Favorites

Favorites are stored in `localStorage` and exposed through `useFavorites()`.

The UI also provides a favorites-only filter. Favorite state is kept separate from the server data so toggling one card does not require refetching the game list.

## Images

The API can return relative image paths. `resolveImageUrl()` converts them into absolute URLs.

`GameImage` uses `next/image` with explicit dimensions and provides a real fallback state when an image fails, preserving the card layout instead of simply hiding the broken image.

## Performance

- Filtering/sorting is memoized.
- Search is debounced.
- Additional requests are cancelled when stale.
- Below-fold images use `next/image` lazy loading.
- A lightweight virtual grid is enabled when more than 50 games are loaded.
- Favorite toggles are localized to the relevant card/state rather than refetching the entire list.

## Accessibility

- Persian RTL layout
- Keyboard-accessible controls
- Visible focus states
- Escape support for dropdown/popover controls
- Semantic buttons for interactive actions
- Loading, empty, error, and image-fallback states
- Respect for reduced-motion preferences where animations/feedback are used

## Empty Vendor Arrays

Games with no vendors are treated as **unspecified**. They are not considered a match for a specific vendor filter because an empty array does not provide evidence that the game belongs to that vendor.

## Loading & Error States

The initial game list is rendered behind React `Suspense` with a layout-matching skeleton to reduce layout shift.

The project also includes empty and error states with recovery actions, plus image-level fallbacks for broken game images.

## Testing

Pure data logic is kept in `lib/` with no React imports.

Tests cover the required cases, including:

- Persian normalization
- game filtering
- sorting and quality scoring
- API parsing/runtime guards
- pagination metadata and page merging
- URL serialization

Run:

```bash
npm test
```

## Design Decisions & Trade-offs

### Why a server proxy?

It prevents browser-side direct access to the Lifelands API and gives the application one place to handle errors, validation, and upstream changes.

### Why Load More?

It provides a smoother discovery experience for a game grid and preserves already loaded results. The trade-off is that client-side filtering only covers loaded games.

### Why URL state?

The assignment requires shareable state and correct Back/Forward behavior. Keeping these values in the URL makes the state reproducible and navigable.

### Why a vendor union?

The API exposes vendors as strings, but the UI supports a known set. A union plus type guard gives compile-time safety while still handling unknown API values safely.

### Why AbortSignal?

It is a native way to cancel stale requests and avoids timing-based race-condition workarounds.

### Revalidation

The server fetch uses a short revalidation window because the game catalog can change, but it does not need to be requested from the upstream API on every render. The chosen value is documented in the fetch layer.

## Known Limitations

With more time I would consider:

- server-side search/filter parameters for very large datasets
- broader test coverage for interactive components
- a more advanced virtualization strategy if the dataset becomes significantly larger
- a full Lighthouse/accessibility report in the README

## 28. AI Usage

AI tools were used as development assistants during this assignment. I used them for research, architecture discussions, debugging, code review, and documentation. I did not rely on AI to blindly generate the complete project.

### Tools Used

- **ChatGPT:** architecture discussions, TypeScript/API design, Persian text normalization, URL state, race-condition handling, performance considerations, testing ideas, and README review.
- **Cursor / GitHub Copilot:** code suggestions, refactoring, debugging, and smaller implementation improvements.

### Where AI Helped

I used AI to compare implementation approaches for the Next.js Server/Client Component split, API typing, filtering and sorting, Load More behavior, `AbortController`, image fallbacks, memoization, virtualization, and accessibility.

AI was also useful for identifying edge cases such as empty vendor arrays, Persian/Arabic character differences, stale asynchronous responses, and differences between `total`, `eachPerPage`, and the actual number of returned items.

### How I Changed the Suggestions

AI suggestions were treated as recommendations, not as final solutions. I reviewed them against the actual Lifelands API and the assignment requirements and changed or rejected suggestions when necessary.

For example, I kept the initial API request in a Server Component, avoided using `useEffect` for the initial data load, avoided unsafe TypeScript constructs such as `any` and `@ts-ignore`, used a server-side API proxy instead of calling the external API directly from the browser, and used `AbortController` for race-safe requests.

### What I Wrote and Decided Myself

The final project structure, component boundaries, UI implementation, filtering behavior, URL-state approach, Load More strategy, data-processing logic, styling, and final architectural decisions were reviewed and finalized by me.

### Honest Assessment

AI helped me move faster when comparing solutions and finding edge cases, especially during debugging and code review. However, some suggestions were too generic or did not match the actual project, so they required modification or were rejected.

I used AI as a development and learning assistant while keeping responsibility for understanding, reviewing, and validating the final code.

## Submission Checklist

- [ ] GitHub repository URL added above
- [ ] Deployed URL added above
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] No `.env`, `node_modules`, debug logs, dead code, or unused files committed
