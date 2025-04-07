<script>
  import './app.css'
  import Navbar from './components/navbar/Navbar.svelte'
  import CameraView from './components/camera/CameraView.svelte'
  import ProjectorPanel from './components/projector/ProjectorPanel.svelte'
</script>

<body class="text-primary">
  <Navbar />

  <div class="flex flex-col p-4 space-y-4">
    <div class="flex flex-row space-x-4">
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <CameraView />
      </div>
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 2</h2>
        <p>Content for box 2.</p>
      </div>
    </div>

    <div class="flex flex-row space-x-4">
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 3</h2>
        <p>Content for box 3.</p>
      </div>
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <ProjectorPanel />
      </div>
    </div>
  </div>
</body>
