<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  let devices: MediaDeviceInfo[] = []
  let selectedDeviceId: string | undefined = undefined
  let videoElement: HTMLVideoElement
  export let stream: MediaStream | null = null
  let error: string | null = null
  export let isFullscreen = false
  let containerElement: HTMLDivElement
  let capturedPhoto: string | null = null

  async function getDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      devices = allDevices.filter((device) => device.kind === 'videoinput')
      if (devices.length > 0 && !selectedDeviceId) {
        selectedDeviceId = devices[0].deviceId
      }
    } catch (err: any) {
      console.error('Error enumerating devices or getting permissions:', err)
      error = `Cannot access the camera: ${err.message}. Check permissions.`
      devices = []
    }
  }

  async function startStream(deviceId: string) {
    stopStream()
    error = null

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: { exact: deviceId }
      },
      audio: false
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoElement) {
        videoElement.srcObject = stream
        const videoTrack = stream.getVideoTracks()[0]
        const settings = videoTrack.getSettings()
        console.log(`Actual resolution: ${settings.width}x${settings.height}`)
      }
    } catch (err: any) {
      console.error(`Error starting stream for device ${deviceId}:`, err)
      stream = null
      if (videoElement) {
        videoElement.srcObject = null
      }
    }
  }

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      stream = null
      if (videoElement) {
        videoElement.srcObject = null
      }
    }
  }

  export async function toggleFullscreen() {
    if (!containerElement) return

    if (!document.fullscreenElement) {
      try {
        await containerElement.requestFullscreen()
        isFullscreen = true
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err)
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
        isFullscreen = false
      }
    }
  }

  export function capturePhoto() {
    if (!videoElement || !stream) {
      console.error('No video stream available')
      return
    }

    try {
      console.log('Capturing photo...')
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
        capturedPhoto = canvas.toDataURL('image/jpeg')
        downloadPhoto()
        console.log('Photo captured and downloaded')
      }
    } catch (err) {
      console.error('Error capturing photo:', err)
    }
  }

  function downloadPhoto() {
    if (!capturedPhoto) return

    const link = document.createElement('a')
    link.href = capturedPhoto

    const now = new Date()
    const fileName = `photo_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.jpg`
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  onMount(async () => {
    await getDevices()
    document.addEventListener('fullscreenchange', () => {
      isFullscreen = !!document.fullscreenElement
    })
  })

  onDestroy(() => {
    stopStream()
    document.removeEventListener('fullscreenchange', () => {})
  })

  $: if (selectedDeviceId && devices.length > 0) {
    startStream(selectedDeviceId)
  }
</script>

<div class="flex flex-col h-full w-full" bind:this={containerElement}>
  <div class="flex justify-end flex-shrink-0 p-2">
    <div class="flex items-center space-x-2">
      {#if devices.length > 0}
        <select
          bind:value={selectedDeviceId}
          class="mr-1 w-96 h-8 p-1 text-xs border border-gray-300 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        >
          {#each devices as device}
            <option value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.substring(0, 6)}`}
            </option>
          {/each}
        </select>
      {:else if !error}
        <p class="text-xs text-gray-500">Searching for cameras...</p>
      {/if}
    </div>
  </div>

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
