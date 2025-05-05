<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Expand, Camera, Settings } from 'lucide-svelte'

  let devices: MediaDeviceInfo[] = []
  let selectedDeviceId: string | undefined = undefined
  let videoElement: HTMLVideoElement
  let stream: MediaStream | null = null
  let error: string | null = null
  let isFullscreen = false
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
      error = `Unable to access the camera: ${err.message}. Check permissions.`
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
      error = `Cannot start the camera (${devices.find((d) => d.deviceId === deviceId)?.label || 'selected device'}): ${err.message}`
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

  async function toggleFullscreen() {
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

  function capturePhoto() {
    if (!videoElement || !stream) {
      console.error('No video stream available')
      return
    }

    try {
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
        capturedPhoto = canvas.toDataURL('image/jpeg')
        downloadPhoto()
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

<div class="flex flex-col h-full" bind:this={containerElement}>
  <div class="flex items-center justify-between mb-2 flex-shrink-0">
    <div class="flex-1 mr-4">
      {#if devices.length > 0}
        <select
          bind:value={selectedDeviceId}
          class="w-full p-2 border border-gray-300 rounded bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {#each devices as device}
            <option value={device.deviceId}
              >{device.label || `Camera ${device.deviceId.substring(0, 6)}`}</option
            >
          {/each}
        </select>
      {:else if !error}
        <p class="text-sm text-gray-500">Searching for cameras...</p>
      {/if}
    </div>

    <div class="flex space-x-1">
      <button
        on:click={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Expand size={18} />
      </button>
      <button
        on:click={capturePhoto}
        title="Take and download photo"
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        disabled={!stream}
      >
        <Camera size={18} />
      </button>
      <button
        title="Settings"
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Settings size={18} />
      </button>
    </div>
  </div>

  <div class="flex-grow w-full relative overflow-hidden bg-black rounded">
    <div>
      <video
        bind:this={videoElement}
        autoplay
        muted
        playsinline
        class="w-full h-full object-contain"
      />
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
        <p>No cameras detected or permissions are missing.</p>
      </div>
    {/if}
  </div>
</div>
