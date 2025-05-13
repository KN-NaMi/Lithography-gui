<script lang="ts">
  import { Expand } from 'lucide-svelte'

  // Props
  export let isFullscreen: boolean = false
  export let toggleFullscreen: () => void
</script>

<button on:click={() => toggleFullscreen()} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
  <Expand size={22} />
</button>
