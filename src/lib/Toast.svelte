<script lang="ts">
  import { dismiss, pause, resume, type Toast } from './toast';

  export let toast: Toast;
</script>

<li
  class="toast toast--{toast.tone}"
  role={toast.tone === 'error' ? 'alert' : 'status'}
  on:mouseenter={() => pause(toast.id)}
  on:mouseleave={() => resume(toast.id)}
  on:focusin={() => pause(toast.id)}
  on:focusout={() => resume(toast.id)}
>
  <p class="toast__message">{toast.message}</p>
  <button
    class="toast__close"
    type="button"
    aria-label="Dismiss notification"
    on:click={() => dismiss(toast.id)}
  >&times;</button>
</li>

<style>
  .toast {
    display: flex;
    gap: 0.75rem;
    align-items: start;
    padding: 0.5rem 0.75rem;
    border: 1px solid currentColor;
    border-radius: 0.375rem;
  }

  .toast__message {
    margin: 0;
    flex: 1;
  }

  .toast__close {
    border: 0;
    background: none;
    font: inherit;
    line-height: 1;
    cursor: pointer;
  }
</style>
