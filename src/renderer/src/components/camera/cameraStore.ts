import { writable } from 'svelte/store'

// Camera state store
export const cameraError = writable(false)
export const videoDevices = writable<MediaDeviceInfo[]>([])
export const selectedDeviceId = writable('')
export const stream = writable<MediaStream | null>(null)
export const screenshotData = writable<string | null>(null)
export const showScreenshotPreview = writable(false)

// Canvas reference (not reactive, just a reference)
let screenshotCanvas: HTMLCanvasElement

// Initialize screenshot canvas
export function initScreenshotCanvas() {
  screenshotCanvas = document.createElement('canvas')
  return screenshotCanvas
}

// Get current screenshot canvas
export function getScreenshotCanvas() {
  return screenshotCanvas
}

// Initialize available video devices
export async function getVideoDevices() {
  try {
    // First request permission to access media devices
    await navigator.mediaDevices.getUserMedia({ video: true })

    // Then enumerate devices
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoInputs = devices.filter((device) => device.kind === 'videoinput')
    
    videoDevices.set(videoInputs)
    
    if (videoInputs.length === 0) {
      console.error('No video devices found')
      cameraError.set(true)
    } else {
      selectedDeviceId.set(videoInputs[0].deviceId)
    }
    
    return videoInputs
  } catch (err) {
    console.error('Error accessing devices:', err)
    cameraError.set(true)
    return []
  }
}