<script lang="ts">
  import { Camera } from 'lucide-svelte'

  // Props
  export let capturePhoto: () => void
  export let hasStream: boolean = false
</script>

<button on:click={capturePhoto} title="Take and download photo" disabled={!hasStream}>
  <Camera size={22} />
</button>
