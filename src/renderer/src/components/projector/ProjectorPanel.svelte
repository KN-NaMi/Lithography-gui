<script lang="ts">
  import UVmode from './UVmode.svelte'
  import RedMode from './RedMode.svelte'
  export let selectedPort: string = 'COM1'
  const ports = ['COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8']
</script>

<main>
  <div class="flex flex-col">
    <div class="flex justify-start">Projector</div>
    <div class="flex justify-end">
      <select class="bg-gray-900 text-white p-1 rounded text-xs" bind:value={selectedPort}>
        {#each ports as port}
          <option>{port}</option>
        {/each}
      </select>
    </div>
    <UVmode />
    <RedMode />
  </div>
</main>
