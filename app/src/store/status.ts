import { writable, derived } from 'svelte/store';

/**
 * Construct the connectionStatus store, with the custom modification functions.
 */
function connectionStatusStore() {
    const { subscribe, set } = writable(0);

    return {
        subscribe,
        startup() { set(0); },
        connected() { set(1); },
        reconnecting() { set(2); },
        lost() { set(3); },
    };
}

/**
 * The current connection status
 *
 * 0 - initial connect
 * 1 - connection established
 * 2 - reconnecting
 * 3 - connection lost
 */
export const connectionStatus = connectionStatusStore();

/**
 * Is the connection starting up
 */
export const isStartup = derived(
    connectionStatus,
    (connectionStatus) => {
        return connectionStatus === 0;
    },
    true
);

/**
 * Is the connection ready.
 */
export const isConnected = derived(
    connectionStatus,
    (connectionStatus) => {
        return connectionStatus === 1;
    },
    true
);

/**
 * Is the connection reconnecting.
 */
export const isReconnecting = derived(
    connectionStatus,
    (connectionStatus) => {
        return connectionStatus === 2;
    },
    true
);

/**
 * Is the connection lost.
 */
export const isConnectionLost = derived(
    connectionStatus,
    (connectionStatus) => {
        return connectionStatus === 3;
    },
    true
);
