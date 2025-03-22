<script lang="ts">
  import UVmode from './UVmode.svelte'
  import RedMode from './RedMode.svelte'
</script>

<main class="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden">
  <div class="text-white p-1 text-lg">Projector</div>
  <div class="flex-grow overflow-auto">
    <UVmode />
    <RedMode />
  </div>
</main>
