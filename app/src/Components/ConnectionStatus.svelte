<script lang="ts">
    import { isStartup, isReconnecting, isConnectionLost, connectionStatus, url } from '../store';

    function reconnect() {
        connectionStatus.set(2);
        url.set('');
        url.set(window.location.href);
    }
</script>

<div role="alert" aria-live="polite" class="fixed w-screen h-screen z-50 bg-white bg-opacity-60">
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white max-w-lg max-h-80 border-2 border-blue shadow-2xl flex flex-col">
        {#if $isStartup}
            <h2 class="border-b-2 border-gray-200 px-4 py-2 font-bold">Connecting...</h2>
            <div class="flex-shrink flex-grow overflow-auto">
                <p class="px-4 py-3">The connection to the tutorial server is being established. Please wait...</p>
            </div>
        {:else if $isReconnecting}
            <h2 class="border-b-2 border-gray-200 px-4 py-2 font-bold text-red">Reconnecting...</h2>
            <div class="flex-shrink flex-grow overflow-auto">
                <p class="px-4 py-3">The connection to the tutorial server has been lost. The system will try to automatically reconnect
                    for up to one minute. Please wait...</p>
            </div>
        {:else if $isConnectionLost}
            <h2 class="border-b-2 border-gray-200 px-4 py-2 font-bold text-red">Connection lost</h2>
            <div class="flex-shrink flex-grow overflow-auto px-4 py-3">
                <p class="pb-2">The connection to the tutorial server has been lost. Please check your internet connection.</p>
                <p class="pb-2">If the connection is fine
                    and you are accessing this via Compute Home, then the most likely reason is that your server has been shut down due to inactivity.
                    If you are running it locally through Docker, check your Docker container is still running and re-start it.</p>
                <p>You can either <button on:click={reconnect} class="inline-block border-1 border-orange border-solid rounded px-2">try reconnecting</button>
                    or reload your browser window or tab if that does not work.</p>
            </div>
        {/if}
    </div>
</div>
