<script>
  import './app.css'
  import Navbar from './components/navbar/Navbar.svelte'
  import CameraView from './components/camera/CameraView.svelte'
  import ProjectorPanel from './components/projector/ProjectorPanel.svelte'

  let box1Height
  let windowWidth
  let windowHeight

  const thresholdWidth = 1200
  const thresholdHeight = 800

  $: isLargeWindow = windowWidth > thresholdWidth && windowHeight > thresholdHeight
  $: bottomBoxesHeight = isLargeWindow ? 'auto' : box1Height ? box1Height * 0.35 + 'px' : 'auto'
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<body class="text-primary">
  <Navbar />
  <div class="flex flex-col h-screen p-4 space-y-4">
    <div class="flex flex-row space-x-4" class:flex-1={!isLargeWindow}>
      <div bind:clientHeight={box1Height} class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <CameraView />
      </div>
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 2</h2>
        <p>Content for box 2.</p>
      </div>
    </div>

    <div class="flex flex-row space-x-4" class:flex-1={isLargeWindow}>
      <div
        class="box border-2 border-primary flex-1 p-4 rounded-lg"
        style={isLargeWindow ? '' : `height: ${bottomBoxesHeight}`}
      >
        <ProjectorPanel />
      </div>
      <div
        class="box border-2 border-primary flex-1 p-4 rounded-lg"
        style={isLargeWindow ? '' : `height: ${bottomBoxesHeight}`}
      >
        <ProjectorPanel />
      </div>
    </div>
  </div>
</body>
