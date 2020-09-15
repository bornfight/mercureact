# Mercureact
[![codecov](https://codecov.io/gh/bornfight/mercureact/branch/master/graph/badge.svg)](https://codecov.io/gh/bornfight/mercureact)

## About
React hooks based Mercure client for subscription to topics.

## Caveats
Supports *only* token based authentication, cookie based auth currently not implemented.

## Installation
1. `yarn add @bornfight/mercureact` or `npm i @bornfight/mercureact`

2. install peer dependency (eventsource)
- `yarn add eventsource` or `npm i eventsource`  

## Usage
`useMemo` is recommended (or some other memoization method) for preventing re-instantiation of `useSubscribe` hook.

```tsx
import { SubscribeConfig, useSubscribe } from "@bornfight/mercureact";

const config: SubscribeConfig = useMemo(() => {
    const fooTopic = `/foo/1`;

    return {
        url: "http://localhost:5000/.well-known/mercure",
        token: "my-token",
        topics: [fooTopicc],
        onMessage: (message) => {
            // messages are not serialized internally
            const serializedMessage = message.data
                ? JSON.parse(message.data)
                : undefined;

            console.log(serializedMessage)
        },
    };
}, []);

const { eventSource } = useSubscribe(config);
```



