# Review Recording Script

A 60–90 second recording can use this sequence:

1. Show the component tree and point out `GamesSection` as the Server Component and `GameGrid` as the interactive client boundary.
2. Search for a Persian/Latin game name and pause while the 300ms debounce updates the URL.
3. Open the vendor filter, select both vendors, press Escape, then reopen it and apply the selection.
4. Change sorting and show that the query string is the source of truth.
5. Open a second browser tab with the copied URL to demonstrate that the same state is restored.
6. Click favorite on one card and show the local favorite state plus the favorites-only filter.
7. Load more pages and explain that TanStack Query forwards its `AbortSignal` to Axios so stale page requests are cancellable.
8. Mention the custom virtual grid: it switches on after more than 50 loaded items and only keeps the visible rows plus overscan in the DOM.
9. Finish by showing the pure `lib/` tests and the README AI disclosure.
