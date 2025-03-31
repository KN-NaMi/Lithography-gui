<script lang="ts">
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

  // DOM elements
  let cameraView: HTMLElement
  let videoElement: HTMLVideoElement

  // Reactive variable to track initialization status
  let isInitialized = false

  onMount(async () => {
    // Initialize screenshot canvas
    initScreenshotCanvas()

    // Create video element
    videoElement = document.createElement('video')
    videoElement.style.width = '100%'
    videoElement.style.height = '100%'
    videoElement.style.objectFit = 'contain'

    // Create a container for the video
    const container = document.createElement('div')
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    container.style.alignItems = 'center'
    container.style.overflow = 'hidden'

    // Add video to container and container to cameraView
    container.appendChild(videoElement)
    cameraView.appendChild(container)

    // Get available video devices
    const devices = await getVideoDevices()

    // Initialize webcam if devices are available
    if (devices.length > 0) {
      await initializeWebcam(videoElement)
      isInitialized = true
    }
  })

  onDestroy(() => {
    // Clean up stream on component destroy
    if ($stream) {
      $stream.getTracks().forEach((track) => track.stop())
    }
  })

  // Handle device selection change
  async function handleDeviceChange() {
    await initializeWebcam(videoElement)
  }

  // Improved fullscreen function
  function handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      // Use the container div for fullscreen instead of the entire view
      const container = cameraView.querySelector('div')
      if (container) {
        container.requestFullscreen()
      }
    }
  }

  // Close screenshot preview
  function closeScreenshotPreview() {
    $showScreenshotPreview = false
  }

  // Take a screenshot with the current video element
  function captureScreenshot() {
    takeScreenshot(videoElement)
  }
</script>

<!-- Control panel component -->
<div class="flex justify-between items-center z-10 rounded-xl m-1 w-full">
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
      <Expand class="w-4 h-4 text-white" />
    </button>
    <button on:click={captureScreenshot} disabled={!isInitialized}>
      <Camera class="w-4 h-4 text-white" />
    </button>
    <button on:click={openCameraSettings}>
      <Settings class="w-4 h-4 text-white" />
    </button>
  </div>
</div>

<div class="w-full h-64">
  <div bind:this={cameraView} class="w-full h-full overflow-hidden rounded-xl"></div>

  <!-- Error and initialization handling -->
  {#if $cameraError}
    <div class="text-red-500 text-center mt-4">
      Unable to access camera. Please check your camera permissions.
    </div>
  {:else if $videoDevices.length === 0}
    <div class="text-yellow-500 text-center mt-4">
      No video devices found. Please connect a camera.
    </div>
  {/if}

  <!-- Screenshot preview overlay -->
  {#if $showScreenshotPreview && $screenshotData}
    <div
      class="absolute inset-0 bg-black bg-opacity-80 z-20 flex flex-col items-center justify-center p-4"
    >
      <div class="relative bg-gray-800 p-2 rounded-lg shadow-lg max-w-full max-h-full">
        <div class="absolute top-2 right-2 flex space-x-2">
          <button on:click={downloadScreenshot}>
            <FileDown class="w-4 h-4 text-white" />
          </button>
          <button on:click={closeScreenshotPreview}>
            <CircleX class="w-4 h-4 text-white" />
          </button>
        </div>
        <img
          src={$screenshotData}
          alt="Screenshot"
          class="max-w-full max-h-64 object-contain mt-4"
        />
        <div class="mt-3 text-center text-white text-sm">Screenshot captured</div>
      </div>
    </div>
  {/if}
</div>
