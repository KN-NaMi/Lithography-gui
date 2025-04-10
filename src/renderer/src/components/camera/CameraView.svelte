<script lang="ts">
  import '../../app.css'
  import { onMount, onDestroy } from 'svelte'
  import { Camera, Settings, Expand, FileDown, CircleX } from 'lucide-svelte'
  import {
    videoDevices,
    selectedDeviceId,
    screenshotData,
    showScreenshotPreview,
    initScreenshotCanvas,
    getVideoDevices,
    stream,
    cameraError
  } from '../../libs/cameraStore'

  import {
    initializeWebcam,
    takeScreenshot,
    downloadScreenshot,
    openCameraSettings
  } from '../../libs/cameraControls'

  let cameraView: HTMLElement
  let videoElement: HTMLVideoElement
  let container: HTMLDivElement
  let resizeObserver: ResizeObserver

  let isInitialized = false

  onMount(async () => {
    initScreenshotCanvas()

    // Create a video element for our camera feed
    videoElement = document.createElement('video')
    videoElement.style.cssText = 'width: 100%; height: 100%; object-fit: cover;'

    // Create a container with forced 16:9 aspect ratio
    container = document.createElement('div')
    container.style.cssText =
      'position: relative; width: 100%; height: 0; padding-bottom: 56.25%; overflow: hidden;'

    container.appendChild(videoElement)
    cameraView.appendChild(container)

    const devices = await getVideoDevices()

    if (devices.length > 0) {
      await initializeWebcam(videoElement)
      isInitialized = true

      // Set up a resize observer to handle container size changes
      resizeObserver = new ResizeObserver(() => {
        ensureVideoFill()
      })

      if (container) {
        resizeObserver.observe(container)
      }

      ensureVideoFill()
    }
  })

  onDestroy(() => {
    if ($stream) {
      $stream.getTracks().forEach((track) => track.stop())
    }

    // Clean up the observer
    if (resizeObserver) {
      if (container) resizeObserver.unobserve(container)
      resizeObserver.disconnect()
    }
  })

  // Ensures video element properly fills the container
  function ensureVideoFill() {
    if (!videoElement) return

    // Position the video to fill the container while maintaining aspect ratio
    videoElement.style.position = 'absolute'
    videoElement.style.top = '0'
    videoElement.style.left = '0'
    videoElement.style.width = '100%'
    videoElement.style.height = '100%'
    videoElement.style.objectFit = 'cover'
  }

  async function handleDeviceChange() {
    await initializeWebcam(videoElement)
  }

  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.error('Error exiting fullscreen:', err))
    } else {
      if (container) {
        container
          .requestFullscreen()
          .catch((err) => console.error('Error entering fullscreen:', err))
      }
    }
  }

  function closeScreenshotPreview() {
    $showScreenshotPreview = false
  }

  function captureScreenshot() {
    takeScreenshot(videoElement)
  }
</script>

<!-- Control panel component -->
<div class="flex justify-between items-center rounded-xl w-full mb-2">
  <!-- Camera selector -->
  <div class="flex items-center space-x-2 rounded-xl">
    <select
      class="bg-gray-900 text-white text-xs py-1 pl-2 pr-6 rounded border border-gray-700"
      bind:value={$selectedDeviceId}
      on:change={handleDeviceChange}
      disabled={$videoDevices.length === 0}
    >
      {#each $videoDevices as device}
        <option value={device.deviceId}>
          {device.label || `Camera ${$videoDevices.indexOf(device) + 1}`}
        </option>
      {/each}
    </select>
  </div>

  <!-- Camera controls -->
  <div class="flex items-right space-x-3 m-2">
    <button on:click={handleFullscreen} disabled={!isInitialized}>
      <Expand class="w-4 h-4 " />
    </button>
    <button on:click={captureScreenshot} disabled={!isInitialized}>
      <Camera class="w-4 h-4" />
    </button>
    <button on:click={openCameraSettings}>
      <Settings class="w-4 h-4" />
    </button>
  </div>
</div>

<!-- Camera view with properly constrained aspect ratio -->
<div bind:this={cameraView} class="w-full rounded-xl"></div>

{#if $cameraError}
  <div class="text-red-500 text-center mt-4">
    Unable to access camera. Please check your camera permissions.
  </div>
{:else if $videoDevices.length === 0}
  <div class="text-yellow-500 text-center mt-4">
    No video devices found. Please connect a camera.
  </div>
{/if}

{#if $showScreenshotPreview && $screenshotData}
  <div
    class="absolute inset-0 bg-black bg-opacity-80 z-20 flex flex-col items-center justify-center p-4"
  >
    <div class="relative bg-gray-800 p-3 rounded-lg shadow-lg">
      <div class="flex justify-end">
        <button on:click={closeScreenshotPreview}>
          <CircleX class="w-5 h-5 text-white" />
        </button>
      </div>
      <img src={$screenshotData} alt="Screenshot" class="max-w-full max-h-64 object-contain mt-1" />
      <div class="mt-4 flex justify-center">
        <button
          on:click={downloadScreenshot}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FileDown class="w-5 h-5" />
          <span>Download Screenshot</span>
        </button>
      </div>
    </div>
  </div>
{/if}
