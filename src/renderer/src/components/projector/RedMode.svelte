<script lang="ts">
  let intensity = 80
  let isOn = false
  const handleToggle = async () => {
    isOn = !isOn
  }
</script>

<div class="p-2 m-1 rounded-lg text-white bg-gray-900 border border-gray-800">
  <h3 class="text-sm mb-2">RED Mode</h3>

  <div class="flex items-center gap-2 my-2 text-sm">
    <label>Intensity:</label>
    <div class="flex items-center gap-1">
      <input
        type="number"
        bind:value={intensity}
        min="0"
        max="100"
        class="w-12 bg-gray-700 rounded p-1 text-white text-xs"
      />
      <span>%</span>
    </div>
  </div>

  <button
    class={`w-20 py-1 text-xs border-none rounded cursor-pointer text-white ${isOn ? 'bg-green-500' : 'bg-gray-600'}`}
    on:click={handleToggle}
  >
    {isOn ? 'ON' : 'OFF'}
  </button>
</div>
