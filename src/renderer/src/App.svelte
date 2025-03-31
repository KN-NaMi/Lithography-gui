<script lang="ts">
  import './app.css'
  import Navbar from './components/navbar/Navbar.svelte'
  import CameraView from './components/camera/CameraView.svelte'
  import ProjectorPanel from './components/projector/ProjectorPanel.svelte'
</script>

<main class="h-screen flex flex-col p-2 overflow-hidden">
  <div class="flex-grow flex flex-col rounded-xl border-2 border-gray-900 overflow-hidden">
    <div><Navbar /></div>
    <div class="grid grid-cols-[2fr_3fr] grid-rows-2 gap-2 flex-grow overflow-hidden">
      <div
        class="m-1 rounded-xl border-2 border-gray-900 bg-gray-900 text-white pl-1 overflow-hidden"
      >
        <CameraView />
      </div>
      <div class="m-1 rounded-xl border-2 border-gray-900 overflow-auto">sterowanie</div>
      <div class="m-1 rounded-xl border-2 border-gray-900 overflow-auto">maski</div>
      <div class="m-1 rounded-xl overflow-hidden">
        <ProjectorPanel />
      </div>
    </div>
  </div>
</main>
