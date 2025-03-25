<script lang="ts">
  let exposeTime = 3000
  let intensity = 30
  export let value: string
  const ports = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8']

  const handleStart = async () => {
    await projectorService.startUVExposure(exposeTime, intensity)
  }

  const handleAbort = async () => {
    await projectorService.abortUVExposure()
  }
</script>

<main class="p-2 m-1 rounded-lg bg-gray-900 text-white border border-gray-800">
  <div class="flex flex-row justify-between items-center">
    <h3 class="text-sm">UV Mode</h3>
    <select class="bg-gray-900 text-white border border-gray-700 p-1 rounded text-xs" bind:value>
      {#each ports as port}
        <option>{port}</option>
      {/each}
    </select>
  </div>

  <div class="my-2 flex items-center gap-2 text-sm">
    <label>Expose Time:</label>
    <div class="flex items-center gap-1">
      <input type="number" bind:value={exposeTime} min="0" step="100" class="w-16 p-1 text-xs" />
      <span>ms</span>
    </div>
  </div>

  <div class="flex items-center my-2 text-sm">
    <input type="range" bind:value={intensity} min="0" max="100" class="w-full" />
    <span class="ml-1 whitespace-nowrap">{intensity}%</span>
  </div>

  <div class="flex gap-2 mt-1">
    <button class="py-0.5 px-2 text-xs border-none rounded cursor-pointer bg-gray-700">Abort</button
    >
    <button class="py-0.5 px-2 text-xs border-none rounded cursor-pointer bg-gray-700">Start</button
    >
  </div>
</main>
