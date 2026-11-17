import { writable, type Readable } from 'svelte/store';
import type { Toast } from './toast';

const DEFAULT_LIMIT = 3;

/**
 * Cap how many toasts are on screen at once. Extra toasts wait in a queue and
 * are only shown when an earlier one is dismissed.
 *
 * The queue is derived from the source store, so dismissing a toast frees its
 * slot without a second API call. `limit` is read once, at creation.
 */
export function createViewport(source: Readable<Toast[]>, limit = DEFAULT_LIMIT): Readable<Toast[]> {
  const visible = writable<Toast[]>([]);
  const pending: Toast[] = [];

  function fill(): void {
    visible.update((shown) => {
      const next = [...shown];
      while (next.length < limit && pending.length > 0) next.push(pending.shift()!);
      return next;
    });
  }

  source.subscribe((list) => {
    const alive = new Map(list.map((toast) => [toast.id, toast]));

    for (let index = pending.length - 1; index >= 0; index -= 1) {
      if (!alive.has(pending[index].id)) pending.splice(index, 1);
    }

    visible.update((shown) => {
      const known = new Set(shown.map((toast) => toast.id));
      const next = shown
        .filter((toast) => alive.has(toast.id))
        .map((toast) => alive.get(toast.id)!);

      for (const toast of list) {
        if (known.has(toast.id)) continue;
        if (next.length < limit) next.push(toast);
        else if (!pending.some((queued) => queued.id === toast.id)) pending.push(toast);
      }

      return next;
    });

    fill();
  });

  return { subscribe: visible.subscribe };
}
