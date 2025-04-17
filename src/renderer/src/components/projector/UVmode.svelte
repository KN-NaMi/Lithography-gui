<script lang="ts">
  let exposeTime = 3000
  let intensity = 30
</script>

<div class="p-1 m-1 rounded-lg bg-gray-900 text-white border border-gray-800">
  <h3 class="text-sm">UV Mode</h3>

  <div class="flex items-center gap-1">
    <p>Expose Time:</p>
    <input
      type="number"
      bind:value={exposeTime}
      min="0"
      step="100"
      class="w-16 bg-gray-700 p-1 text-xs text-white rounded"
    />
    <span>ms</span>
  </div>
  <div class="gap-2">
    <button
      class="flex-1 py-1 px-2 text-xs border-none rounded cursor-pointer bg-gray-700 hover:bg-gray-600"
    >
      Abort
    </button>
    <button
      class="flex-1 py-1 px-2 text-xs border-none rounded cursor-pointer bg-gray-700 hover:bg-gray-600"
    >
      Start
    </button>
  </div>

  <div class="flex items-center my-2 text-sm">
    <input type="range" bind:value={intensity} min="0" max="100" class="w-full" />
    <span class="ml-1 whitespace-nowrap">{intensity}%</span>
  </div>
</div>
