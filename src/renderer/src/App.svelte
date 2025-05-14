<script lang="ts">
  import './app.css'
  import Sidebar from './components/sidebar.svelte'
  import Panel from './components/panel.svelte'
  import MaskComponent from './components/masks/maskComponent.svelte'
  import UploadButton from './components/masks/masksUploadButton.svelte'
  import CameraComponent from './components/camera/cameraComponent.svelte'
  import { Camera, Expand } from 'lucide-svelte'

  // Import store and Svelte lifecycle hooks
  import { cameraStore } from './lib/cameraLogic' // Ensure this path is correct
  import { onDestroy } from 'svelte' // onMount might not be needed here if CameraComponent handles initial getDevices

  type Mask = {
    white: string
    blue: string
    red: string
  }

  let masks: Mask[] = []

  let cameraComponentInstance: any = null
  let cameraStream: MediaStream | null = null
  let isFullscreen: boolean = false

  // Variables for camera device selection
  let cameraDevices: MediaDeviceInfo[] = []
  let selectedCameraDeviceId: string | undefined = undefined
  let cameraError: string | null = null // To show "Searching..." or error related to devices

  // Subscribe to camera store values
  const unsubscribeCameraDevices = cameraStore.devices.subscribe((value) => (cameraDevices = value))
  const unsubscribeSelectedCameraDeviceId = cameraStore.selectedDeviceId.subscribe(
    (value) => (selectedCameraDeviceId = value)
  )
  const unsubscribeCameraError = cameraStore.error.subscribe((value) => (cameraError = value))

  function takePhoto() {
    console.log('Taking photo...', cameraComponentInstance)
    if (cameraComponentInstance) {
      cameraComponentInstance.capturePhoto()
    } else {
      console.error('Camera component not available')
    }
  }

  function toggleFullscreenMode() {
    console.log('Toggling fullscreen...', cameraComponentInstance)
    if (cameraComponentInstance) {
      cameraComponentInstance.toggleFullscreen()
    } else {
      console.error('Camera component not available')
    }
  }

  function handleCameraDeviceChange(event: Event) {
    const select = event.target as HTMLSelectElement
    if (select.value) {
      cameraStore.setSelectedDevice(select.value)
    }
  }

  onDestroy(() => {
    // Unsubscribe from store subscriptions
    unsubscribeCameraDevices()
    unsubscribeSelectedCameraDeviceId()
    unsubscribeCameraError()
  })
</script>

<body class="text-primary h-screen overflow-hidden">
  <div class="flex h-full">
    <aside class="h-full flex-shrink-0">
      <Sidebar />
    </aside>

    <main class="flex-1 bg-slate-50 rounded-l-[24px] p-[4dvh] overflow-hidden">
      <div class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[2dvh]">
          <Panel title="Camera">
            <span slot="buttons" class="flex items-center space-x-2">
              {#if cameraDevices.length > 0}
                <select
                  value={selectedCameraDeviceId}
                  on:change={handleCameraDeviceChange}
                  class="h-8 p-1 text-xs border border-gray-300 rounded bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                >
                  {#each cameraDevices as device}
                    <option value={device.deviceId}>
                      {device.label || `Camera ${device.deviceId.substring(0, 6)}`}
                    </option>
                  {/each}
                </select>
              {:else if !cameraError && cameraDevices.length === 0}
                <p class="text-xs text-gray-500">Searching...</p>
              {/if}
              <button
                on:click={toggleFullscreenMode}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <Expand size={22} />
              </button>
              <button
                class="ml-2"
                on:click={takePhoto}
                title="Take and download photo"
                disabled={!cameraStream}
              >
                <Camera size={22} />
              </button>
            </span>
            <CameraComponent
              bind:this={cameraComponentInstance}
              bind:stream={cameraStream}
              bind:isFullscreen
            />
          </Panel>
          <Panel title="Motion">
            <p>Text</p>
          </Panel>
          <Panel title="Mask">
            <span slot="buttons">
              <UploadButton bind:masks />
            </span>
            <MaskComponent bind:masks />
          </Panel>
          <Panel title="Projector">
            <p>Text</p>
          </Panel>
        </div>
      </div>
    </main>
  </div>
</body>
