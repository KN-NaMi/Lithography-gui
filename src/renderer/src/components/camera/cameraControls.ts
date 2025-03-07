import { get } from 'svelte/store'
import { 
  stream, 
  selectedDeviceId, 
  cameraError, 
  screenshotData, 
  showScreenshotPreview,
  getScreenshotCanvas
} from './cameraStore'

// Initialize webcam with the selected device
export async function initializeWebcam(videoElement: HTMLVideoElement, cameraViewElement: HTMLElement) {
  try {
    // Stop any existing stream
    const currentStream = get(stream)
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop())
    }

    // Get stream with selected device
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: get(selectedDeviceId) ? { exact: get(selectedDeviceId) } : undefined },
      audio: false
    })

    videoElement.srcObject = newStream
    videoElement.play()
    
    stream.set(newStream)
    cameraError.set(false)
  } catch (err) {
    console.error('Error accessing webcam:', err)
    cameraError.set(true)
  }
}

// Request fullscreen for camera view
export function toggleFullscreen(element: HTMLElement) {
  element.requestFullscreen()
}

// Take a screenshot of the current video frame
export function takeScreenshot(videoElement: HTMLVideoElement) {
  if (!videoElement) return

  const canvas = getScreenshotCanvas()
  
  // Set canvas dimensions to match the video
  const width = videoElement.videoWidth
  const height = videoElement.videoHeight
  canvas.width = width
  canvas.height = height

  // Draw the current video frame to the canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Draw the video frame to the canvas
  ctx.drawImage(videoElement, 0, 0, width, height)

  // Convert canvas to data URL
  const screenshot = canvas.toDataURL('image/png')
  screenshotData.set(screenshot)
  showScreenshotPreview.set(true)
}

// Download the current screenshot
export function downloadScreenshot() {
  const currentScreenshot = get(screenshotData)
  if (!currentScreenshot) return

  // Create a temporary anchor element to trigger download
  const downloadLink = document.createElement('a')
  downloadLink.href = currentScreenshot

  // Create filename with timestamp
  const date = new Date()
  const timestamp = date.toISOString().replace(/[:.]/g, '-')
  downloadLink.download = `screenshot-${timestamp}.png`

  // Trigger download
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

// Open camera settings (for Electron apps)
export function openCameraSettings() {
  if (window.electronAPI?.openNewWindow) {
    window.electronAPI.openNewWindow()
  } else {
    console.warn('Electron API not available')
  }
}