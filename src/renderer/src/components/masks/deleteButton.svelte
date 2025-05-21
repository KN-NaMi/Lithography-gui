<script lang="ts">
  import { Trash } from "lucide-svelte"

  export let masks: {
    white: string
    blue: string
    red: string
  }[]
  
  export let imageIndex: number;

  let triggerDelete = () => {
    if (masks.length > 0) {
      masks = [...masks.slice(0, imageIndex), ...masks.slice(imageIndex + 1)];
      
      if (imageIndex >= masks.length && imageIndex > 0) {
        imageIndex = masks.length - 1;
      }
    }
  }
</script>

<button on:click={triggerDelete} class={`flex border-none bg-transparent ${masks.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
  disabled={masks.length === 0} title="Delete current mask">
  <Trash color={masks.length === 0 ? "#c7ced1" : "#272729"} class="h-full" />
</button>