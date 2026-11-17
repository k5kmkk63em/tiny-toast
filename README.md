# tiny-toast

Small toast store and component for Svelte. One store, one list component, no dependency on a design system.

Why another toast library: most of them own the timer, the DOM and the styling at once, so pause-on-hover either does not exist or cannot be tested without a browser. Here the timer lives in plain TypeScript and the component only forwards pointer and focus events, so the behaviour is testable and the markup is yours to replace.

## Install

```sh
npm i tiny-toast
```

## Usage

```svelte
<script lang="ts">
  import { Toast, push, toasts } from 'tiny-toast';
</script>

<button on:click={() => push({ message: 'Saved', tone: 'success' })}>Save</button>

<ul class="toasts">
  {#each $toasts as toast (toast.id)}
    <Toast {toast} />
  {/each}
</ul>
```

Try it in the [Svelte REPL](https://svelte.dev/repl/hello-world?version=5) (placeholder link, no saved repl yet).

## API

- `push({ message, tone?, duration? })` adds a toast and returns its id. `duration` defaults to 4000 ms, `0` keeps it until dismissed.
- `dismiss(id)` removes a toast and clears its timer.
- `pause(id)` and `resume(id)` stop and restart the dismiss timer; the component calls them on `mouseenter`/`mouseleave` and `focusin`/`focusout`.
- `toasts` is a readable store of the current list.

Resuming currently restarts the full duration instead of the remaining time. That is a known gap, not a design decision.

## Layout

```
src/lib/toast.ts     store, timers, pause/resume
src/lib/Toast.svelte single toast, events only
src/lib/index.ts     public exports
```

## License

MIT
