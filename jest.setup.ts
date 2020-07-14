// @ts-ignore
import EventSource from 'eventsourcemock';

Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});

// required for the polyfill
Object.defineProperty(window, 'EventSourcePolyfill', {
  value: EventSource,
});
