<script lang="ts">
  import UVmode from './UVmode.svelte'
  import RedMode from './RedMode.svelte'
  export let selectedPort: string = 'COM1'
  const ports = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8']
</script>

<main>
  <div class="flex flex-col w-full">
    <div class="flex justify-between">
      <p>Projector</p>
      <UVmode />
      <RedMode />
      <select class="bg-gray-900 text-white p-1 rounded text-xs h-8" bind:value={selectedPort}>
        {#each ports as port}
          <option>{port}</option>
        {/each}
      </select>
    </div>
  </div>
</main>
