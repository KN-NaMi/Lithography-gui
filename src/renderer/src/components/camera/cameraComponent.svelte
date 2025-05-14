<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { cameraStore } from '../../lib/cameraLogic'

  let videoElement: HTMLVideoElement
  let containerElement: HTMLDivElement

  // Create local copies of store values
  let devices: MediaDeviceInfo[] = []
  let selectedDeviceId: string | undefined = undefined
  let error: string | null = null

  // Define exported properties to match original component
  export let stream: MediaStream | null = null
  export let isFullscreen = false

  // Subscribe to stores and update local and exported variables
  const unsubscribeDevices = cameraStore.devices.subscribe((value) => (devices = value))
  const unsubscribeSelectedDeviceId = cameraStore.selectedDeviceId.subscribe(
    (value) => (selectedDeviceId = value)
  )
  const unsubscribeStream = cameraStore.stream.subscribe((value) => {
    stream = value
    if (videoElement && value) {
      videoElement.srcObject = value
    } else if (videoElement) {
      videoElement.srcObject = null
    }
  })
  const unsubscribeError = cameraStore.error.subscribe((value) => (error = value))
  const unsubscribeIsFullscreen = cameraStore.isFullscreen.subscribe(
    (value) => (isFullscreen = value)
  )

  // REMOVED: handleDeviceChange function, as it will be in main.svelte

  export function toggleFullscreen() {
    cameraStore.toggleFullscreen(containerElement)
  }

  export function capturePhoto() {
    cameraStore.capturePhoto(videoElement)
  }

  onMount(async () => {
    await cameraStore.getDevices()
    document.addEventListener('fullscreenchange', cameraStore.handleFullscreenChange)
  })

  onDestroy(() => {
    cameraStore.stopStream()
    document.removeEventListener('fullscreenchange', cameraStore.handleFullscreenChange)

    // Unsubscribe from all store subscriptions
    unsubscribeDevices()
    unsubscribeSelectedDeviceId()
    unsubscribeStream()
    unsubscribeError()
    unsubscribeIsFullscreen()
  })
</script>

<div class="flex flex-col h-full w-full" bind:this={containerElement}>
  <div
    class="flex-grow w-full h-full relative overflow-hidden rounded p-2"
    class:fullscreen-container={isFullscreen}
  >
    <div class="h-full w-full flex items-center justify-center rounded overflow-hidden">
      <video
        bind:this={videoElement}
        autoplay
        muted
        playsinline
        class="w-full h-full object-cover rounded"
        class:fullscreen-video={isFullscreen}
      />
    </div>
  </div>

  {#if error}
    <div
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
    >
      <p>{error}</p>
    </div>
  {:else if !stream && devices.length > 0 && !selectedDeviceId}
    <div
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
    >
      <p>Select a video device from the list above.</p>
    </div>
  {:else if !stream && devices.length === 0 && !error}
    <div
      class="inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
    >
      <p>No cameras detected or permissions missing.</p>
    </div>
  {/if}
</div>

<style>
  :global(body.fullscreen),
  :global(body.fullscreen .fullscreen-container) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0 !important;
    overflow: hidden;
  }

  :global(.fullscreen-container) {
    display: flex;
    flex-direction: column;
  }

  :global(.fullscreen-video) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0 !important;
  }

  :global(html, body) {
    height: 100%;
  }

  :global(#app, :root) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
