<script lang="ts">
  import './app.css'
  import CameraView from './components/camera/CameraView.svelte'
</script>

<main>
  <div class="m-1 rounded-xl border-2 border-gray-900">
    <div class="m-1 rounded-xl border-2 border-gray-900">NaMi Lithography GUI</div>
    <div class="m-1 rounded-xl border-2 border-gray-900">DASHBOARD</div>
    <div class="grid grid-cols-2 gap-4 h-full">
      <div class="m-1 rounded-xl border-2 border-gray-900 bg-gray-900"><CameraView /></div>
      <div class="m-1 rounded-xl border-2 border-gray-900">Component 2</div>
      <div class="m-1 rounded-xl border-2 border-gray-900">Component 3</div>
      <div class="m-1 rounded-xl border-2 border-gray-900">Component 4</div>
    </div>
  </div>
</main>
