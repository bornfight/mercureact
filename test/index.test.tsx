import { renderHook } from '@testing-library/react-hooks';
import { useSubscribe, SubscribeConfig } from '../src';
// @ts-ignore
import { sources } from 'eventsourcemock';

const CONNECTING = 0;
const OPEN = 1;
const CLOSED = 2;

const config: SubscribeConfig = {
  url: 'https://localhost:3050/.well-known/mercure',
  topics: [
    'https://localhost:3050/foo/{id}',
    'https://localhost:3050/bar/{id}',
  ],
};

describe('useMercure', () => {
  it('should create a correct url for the EventSource', () => {
    const { result } = renderHook(() => useSubscribe(config));

    const decodedUrl = decodeURIComponent(
      result.current.eventSource.current?.url as string
    );
    const url =
      'https://localhost:3050/.well-known/mercure?topic=https://localhost:3050/foo/{id}&topic=https://localhost:3050/bar/{id}';
    expect(decodedUrl).toBe(url);
  });

  it('should connect and disconnect correctly', () => {
    const mockOnOpen = jest.fn();
    const { result, unmount } = renderHook(() =>
      useSubscribe({
        ...config,
        onOpen: mockOnOpen,
      })
    );

    expect(result.current.eventSource.current?.readyState).toBe(CONNECTING);
    sources[result.current.eventSource.current?.url].emitOpen();
    expect(result.current.eventSource.current?.readyState).toBe(OPEN);
    expect(mockOnOpen).toBeCalled();
    unmount();
    expect(result.current.eventSource.current?.readyState).toBe(CLOSED);
  });

  it('should receive messages', () => {
    const message = {
      event: 'NewMessage',
      data: {
        text: 'Message text',
      },
    };

    const { result } = renderHook(() =>
      useSubscribe({
        ...config,
        onMessage: message => {
          expect(message).toEqual(message);
        },
      })
    );
    sources[result.current.eventSource.current?.url].emitMessage(message);
  });

  it('should handle onError', () => {
    const mockOnError = jest.fn();

    const { result } = renderHook(() =>
      useSubscribe({
        ...config,
        onError: mockOnError,
      })
    );

    const error = new Error('something went wrong');
    sources[result.current.eventSource.current?.url].emitError(error);

    expect(mockOnError).toHaveBeenCalledWith(error);
  });

  it('should work with token passed to config', () => {
    const { result } = renderHook(() =>
      useSubscribe({
        ...config,
        token: 'my-test-token',
      })
    );
    expect(result.current.eventSource.current?.readyState).toBe(CONNECTING);

    /**
     * todo: test if authorization headers are present. ⚠️ eventsource mock does not support it
     */
  });
});
