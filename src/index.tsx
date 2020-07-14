import { useEffect, useRef } from 'react';

export interface UseMercureConfig {
  topics: string[];
  url: string;
  token?: string;

  // events
  onOpen?: () => void;
  onMessage?: (message: MessageEvent) => void;
  onError?: (event: Event) => void;
}

function createUrl(baseUrl: string, topics: string[]) {
  const url = new URL(baseUrl);
  topics.forEach(topic => {
    url.searchParams.append('topic', topic);
  });
  return url.toString();
}

function createEventSource({
  url,
  token,
}: {
  url: string;
  token?: string;
}): EventSource {
  if (token !== undefined && token !== '') {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    /**
     * relies on eventsource polyfill which supports custom headers, unlike the standard API
     * the polyfill adds EventSourcePolyfill constructor to window object
     * @see https://github.com/EventSource/eventsource/#browser-polyfill
     */
    // todo: fix type, browse tsdx repo for custom .d.ts files
    return new (window as any).EventSourcePolyfill(url, options);
  }

  return new EventSource(url);
}

export const useMercure = ({
  token,
  topics,
  url,
  onOpen,
  onMessage,
  onError,
}: UseMercureConfig) => {
  const eventSource = useRef<EventSource | undefined>(undefined);

  useEffect(() => {
    eventSource.current = createEventSource({
      url: createUrl(url, topics),
      token,
    });

    if (onOpen) {
      eventSource.current.onopen = () => onOpen();
    }
    if (onError) {
      eventSource.current.onerror = event => onError(event);
    }
    if (onMessage) {
      eventSource.current.onmessage = event => onMessage(event);
    }

    return () => {
      eventSource.current?.close();
    };
  }, [token, topics, url, onMessage, onError, onOpen]);

  return {
    eventSource,
  };
};
