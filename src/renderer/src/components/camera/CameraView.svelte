<script lang="ts">
  import { onMount } from 'svelte'
  import { Camera, Settings, Expand, FileDown, CircleX } from 'lucide-svelte'
  import {
    videoDevices,
    selectedDeviceId,
    screenshotData,
    showScreenshotPreview,
    initScreenshotCanvas,
    getVideoDevices
  } from './cameraStore'
  import {
    initializeWebcam,
    toggleFullscreen,
    takeScreenshot,
    downloadScreenshot,
    openCameraSettings
  } from './cameraControls'

  // DOM elements
  let cameraView: HTMLElement
  let videoElement: HTMLVideoElement

  onMount(async () => {
    // Initialize screenshot canvas
    initScreenshotCanvas()

    // Get available video devices
    await getVideoDevices()

    // Create video element and add to DOM
    videoElement = document.createElement('video')
    videoElement.style.width = '100%'
    videoElement.style.height = '100%'
    videoElement.style.objectFit = 'cover'
    cameraView.appendChild(videoElement)

    // Initialize webcam with first available device
    await initializeWebcam(videoElement, cameraView)
  })

  // Handle device selection change
  function handleDeviceChange() {
    initializeWebcam(videoElement, cameraView)
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
    <button on:click={() => toggleFullscreen(cameraView)}>
      <Expand class="w-4 h-4 text-white" />
    </button>
    <button on:click={captureScreenshot}>
      <Camera class="w-4 h-4 text-white" />
    </button>
    <button on:click={openCameraSettings}>
      <Settings class="w-4 h-4 text-white" />
    </button>
  </div>
</div>
<div class="">
  <div bind:this={cameraView} class="w-full h-full overflow-hidden rounded-xl"></div>

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
