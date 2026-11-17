<script lang="ts">
  import Toast from './Toast.svelte';
  import { toasts } from './toast';
  import { createViewport } from './viewport';

  export let limit = 3;

  const visible = createViewport(toasts, limit);
</script>

<ul class="toast-viewport" aria-live="polite">
  {#each $visible as toast (toast.id)}
    <Toast {toast} />
  {/each}
</ul>

<style>
  .toast-viewport {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
</style>
