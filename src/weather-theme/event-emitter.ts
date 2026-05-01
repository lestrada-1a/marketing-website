/**
 * Typed Event Emitter
 *
 * A lightweight, type-safe event emitter for weather theme events.
 * Used to decouple components and enable reactive updates.
 */

import { WeatherThemeEvent, WeatherThemeEventPayload } from './types';

type EventHandler<T> = (payload: T) => void;

export class WeatherThemeEventEmitter {
  private handlers: Map<string, Set<EventHandler<unknown>>> = new Map();

  /**
   * Subscribe to a specific event.
   * Returns an unsubscribe function.
   */
  on<E extends WeatherThemeEvent>(
    event: E,
    handler: EventHandler<WeatherThemeEventPayload[E]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>);

    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    };
  }

  /**
   * Subscribe to an event for a single invocation only.
   */
  once<E extends WeatherThemeEvent>(
    event: E,
    handler: EventHandler<WeatherThemeEventPayload[E]>
  ): () => void {
    const unsubscribe = this.on(event, (payload) => {
      unsubscribe();
      handler(payload);
    });
    return unsubscribe;
  }

  /**
   * Emit an event with the associated payload.
   */
  emit<E extends WeatherThemeEvent>(
    event: E,
    payload: WeatherThemeEventPayload[E]
  ): void {
    const eventHandlers = this.handlers.get(event);
    if (!eventHandlers) return;

    eventHandlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        // Prevent handler errors from breaking event propagation
        console.error(`[WeatherTheme] Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Remove all handlers for a specific event.
   */
  off(event: WeatherThemeEvent): void {
    this.handlers.delete(event);
  }

  /**
   * Remove all handlers for all events.
   */
  removeAllListeners(): void {
    this.handlers.clear();
  }
}
