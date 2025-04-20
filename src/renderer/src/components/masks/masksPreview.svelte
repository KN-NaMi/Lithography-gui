<script lang="ts">
    export let masks: {
      white: string;
      blue: string;
      red: string;
    }[];
  
    export let activeLayer: number;
    export let imageIndex: number;
  </script>

<div class="bg-pink-500 h-[88%] aspect-video flex justify-center items-center overflow-hidden rounded-lg">
    {#if masks.length !== 0}
      <div class="w-full h-full border-4 border-green-300 overflow-hidden rounded-lg">
        {#if activeLayer === 0}
          <img
            id="preview"
            src={masks[imageIndex].white}
            alt="White Mask"
            class="w-full h-full object-cover"
          />
        {:else if activeLayer === 1}
          <img
            id="preview"
            src={masks[imageIndex].blue}
            alt="Blue Mask"
            class="w-full h-full object-cover"
          />
        {:else if activeLayer === 2}
          <img
            id="preview"
            src={masks[imageIndex].red}
            alt="Red Mask"
            class="w-full h-full object-cover"
          />
        {/if}
      </div>
    {:else}
      <h1 class="text-center font-sans font-medium text-2xl text-[#bbbbbb]">
        Upload mask first!
      </h1>
    {/if}
  </div>
  
