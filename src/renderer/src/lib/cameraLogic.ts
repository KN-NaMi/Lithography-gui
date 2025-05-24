import { writable, derived, type Writable, type Readable } from 'svelte/store'

// Define types
export interface CameraState {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string | undefined
  stream: MediaStream | null
  error: string | null
  isFullscreen: boolean
  capturedPhoto: string | null
}

// Create the store
export const createCameraStore = () => {
  const state: Writable<CameraState> = writable({
    devices: [],
    selectedDeviceId: undefined,
    stream: null,
    error: null,
    isFullscreen: false,
    capturedPhoto: null
  })

  // Store getters as readable stores
  const devices: Readable<MediaDeviceInfo[]> = derived(state, ($state) => $state.devices)
  const selectedDeviceId: Readable<string | undefined> = derived(
    state,
    ($state) => $state.selectedDeviceId
  )
  const stream: Readable<MediaStream | null> = derived(state, ($state) => $state.stream)
  const error: Readable<string | null> = derived(state, ($state) => $state.error)
  const isFullscreen: Readable<boolean> = derived(state, ($state) => $state.isFullscreen)

  // Methods that update the store
  async function getDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true })
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter((device) => device.kind === 'videoinput')

      state.update((s) => {
        const newState = {
          ...s,
          devices: videoDevices,
          error: null
        }

        if (videoDevices.length > 0 && !s.selectedDeviceId) {
          newState.selectedDeviceId = videoDevices[0].deviceId
        }

        return newState
      })

      // After updating devices and possibly selectedDeviceId, start stream if needed
      const currentState = get(state)
      if (currentState.selectedDeviceId) {
        await startStream(currentState.selectedDeviceId)
      }
    } catch (err: any) {
      console.error('Error enumerating devices or getting permissions:', err)
      state.update((s) => ({
        ...s,
        devices: [],
        error: `Cannot access the camera: ${err.message}. Check permissions.`
      }))
    }
  }

  function stopStream() {
    state.update((s) => {
      if (s.stream) {
        s.stream.getTracks().forEach((track) => track.stop())
      }
      return { ...s, stream: null }
    })
  }

  async function startStream(deviceId: string) {
    stopStream()

    state.update((s) => ({ ...s, error: null }))

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: { exact: deviceId }
      },
      audio: false
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      state.update((s) => ({ ...s, stream: newStream }))

      const videoTrack = newStream.getVideoTracks()[0]
      const settings = videoTrack.getSettings()
      console.log(`Actual resolution: ${settings.width}x${settings.height}`)

      return newStream
    } catch (err: any) {
      console.error(`Error starting stream for device ${deviceId}:`, err)
      state.update((s) => ({
        ...s,
        stream: null,
        error: `Failed to start camera: ${err.message}`
      }))
      return null
    }
  }

  async function toggleFullscreen(element: HTMLElement | null) {
    if (!element) return

    if (!document.fullscreenElement) {
      try {
        await element.requestFullscreen()
        state.update((s) => ({ ...s, isFullscreen: true }))
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err)
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
        state.update((s) => ({ ...s, isFullscreen: false }))
      }
    }
  }

  function capturePhoto(videoElement: HTMLVideoElement | null) {
    state.update((s) => {
      if (!videoElement || !s.stream) {
        console.error('No video stream available')
        return s
      }

      try {
        console.log('Capturing photo...')
        const canvas = document.createElement('canvas')
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
          const capturedPhoto = canvas.toDataURL('image/jpeg')
          downloadPhoto(capturedPhoto)
          console.log('Photo captured and downloaded')
          return { ...s, capturedPhoto }
        }
      } catch (err) {
        console.error('Error capturing photo:', err)
      }
      return s
    })
  }

  function downloadPhoto(photoData: string | null) {
    if (!photoData) return

    const link = document.createElement('a')
    link.href = photoData

    const now = new Date()
    const fileName = `photo_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.jpg`
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  function setSelectedDevice(deviceId: string) {
    state.update((s) => ({ ...s, selectedDeviceId: deviceId }))
    startStream(deviceId)
  }

  function handleFullscreenChange() {
    state.update((s) => ({ ...s, isFullscreen: !!document.fullscreenElement }))
  }

  // For internal use to get the current state
  function get<T>(store: Writable<T>): T {
    let value: T
    const unsubscribe = store.subscribe((v) => (value = v))
    unsubscribe()
    return value!
  }

  return {
    // Readable stores
    devices,
    selectedDeviceId,
    stream,
    error,
    isFullscreen,

    // State for direct access
    state,

    // Methods
    getDevices,
    startStream,
    stopStream,
    toggleFullscreen,
    capturePhoto,
    setSelectedDevice,
    handleFullscreenChange
  }
}

// Export a singleton instance for use across the app
export const cameraStore = createCameraStore()
