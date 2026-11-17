import { get, writable, type Readable } from 'svelte/store';

export type ToastTone = 'info' | 'success' | 'error';

export interface ToastInput {
  message: string;
  tone?: ToastTone;
  duration?: number;
}

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
  duration: number;
}

export type TimerHandle = ReturnType<typeof setTimeout>;

const DEFAULT_DURATION = 4000;

let nextId = 1;

const timers = new Map<number, TimerHandle>();
const paused = new Set<number>();

const state = writable<Toast[]>([]);

export const toasts: Readable<Toast[]> = { subscribe: state.subscribe };

function clearTimer(id: number): void {
  const timer = timers.get(id);
  if (timer === undefined) return;
  clearTimeout(timer);
  timers.delete(id);
}

function startTimer(toast: Toast): void {
  if (toast.duration <= 0) return;
  clearTimer(toast.id);
  timers.set(
    toast.id,
    setTimeout(() => dismiss(toast.id), toast.duration),
  );
}

export function push(input: ToastInput): number {
  const toast: Toast = {
    id: nextId++,
    message: input.message,
    tone: input.tone ?? 'info',
    duration: input.duration ?? DEFAULT_DURATION,
  };

  state.update((list) => [...list, toast]);
  startTimer(toast);

  return toast.id;
}

export function dismiss(id: number): void {
  clearTimer(id);
  paused.delete(id);
  state.update((list) => list.filter((toast) => toast.id !== id));
}

export function pause(id: number): void {
  const toast = get(state).find((entry) => entry.id === id);
  if (toast === undefined || toast.duration <= 0) return;

  clearTimer(id);
  paused.add(id);
}

export function resume(id: number): void {
  if (!paused.delete(id)) return;

  const toast = get(state).find((entry) => entry.id === id);
  if (toast !== undefined) startTimer(toast);
}
