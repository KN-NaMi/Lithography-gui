<script lang="ts">
  import './app.css'
  import Sidebar from './components/sidebar.svelte'
  import Panel from './components/panel.svelte'
  import MaskComponent from './components/masks/maskComponent.svelte'
  import UploadButton from './components/masks/masksUploadButton.svelte'
  import CameraComponent from './components/camera/cameraComponent.svelte'
  import { Camera, Expand } from 'lucide-svelte'

  type Mask = {
    white: string
    blue: string
    red: string
  }

  let masks: Mask[] = []

  // Camera reference and state
  let cameraComponentInstance: any = null
  let cameraStream: MediaStream | null = null
  let isFullscreen: boolean = false

  // Direct access to the camera functions
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
            <span slot="buttons">
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
