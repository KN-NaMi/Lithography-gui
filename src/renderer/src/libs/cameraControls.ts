import { get } from 'svelte/store'
import {
  stream,
  selectedDeviceId,
  cameraError,
  screenshotData,
  showScreenshotPreview,
  getScreenshotCanvas
} from './cameraStore'

export async function initializeWebcam(videoElement: HTMLVideoElement) {
  try {
    const currentStream = get(stream)
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop())
    }
    cameraError.set(false)

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: get(selectedDeviceId) ? { exact: get(selectedDeviceId) } : undefined,
        aspectRatio: 16 / 9
      },
      audio: false
    })

    if (videoElement) {
      videoElement.srcObject = newStream

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
          resolve()
        }
      })
    }

    stream.set(newStream)
  } catch (err) {
    console.error('Error accessing webcam:', err)
    cameraError.set(true)
  }
}

export function toggleFullscreen(element: HTMLElement) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    element.requestFullscreen()
  }
}

export function takeScreenshot(videoElement: HTMLVideoElement) {
  if (!videoElement) return

  const canvas = getScreenshotCanvas()

  const width = videoElement.videoWidth
  const height = videoElement.videoHeight
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(videoElement, 0, 0, width, height)

  const screenshot = canvas.toDataURL('image/png')
  screenshotData.set(screenshot)
  showScreenshotPreview.set(true)
}

export function downloadScreenshot() {
  const currentScreenshot = get(screenshotData)
  if (!currentScreenshot) return

  const downloadLink = document.createElement('a')
  downloadLink.href = currentScreenshot

  const date = new Date()
  const timestamp = date.toISOString().replace(/[:.]/g, '-')
  downloadLink.download = `screenshot-${timestamp}.png`

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

export function openCameraSettings() {
  if (window.electronAPI?.openNewWindow) {
    window.electronAPI.openNewWindow()
  } else {
    console.warn('Electron API not available')
  }
}
