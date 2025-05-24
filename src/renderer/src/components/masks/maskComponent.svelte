<script lang="ts">
  import AllMasks from './allMasks.svelte'
  import Preview from './masksPreview.svelte'
  import Layers from './masksLayers.svelte'

  import { ChevronLeft, ChevronRight } from 'lucide-svelte'

  export let masks: {
    white: string;
    blue: string;
    red: string;
    iWhite: string;
    iBlue: string;
    iRed: string;
  }[];

  export let imageIndex: number = 2
  let activeLayer: number = 0
  let activeInvert: boolean = false;

  const nextImage = (): void => {
    if (masks.length > 0) {
      imageIndex = imageIndex === masks.length - 1 ? 0 : imageIndex + 1
    }
  }

  const previousImage = (): void => {
    if (masks.length > 0) {
      imageIndex = imageIndex === 0 ? masks.length - 1 : imageIndex - 1
    }
  }

  // Update imageIndex if it's out of bounds after masks change
  $: imageIndex = masks.length === 0 ? 0 : Math.min(imageIndex, masks.length - 1)
</script>

<div class="w-full h-full flex items-center justify-center">
  <div class="ml-2 flex flex-col space-y-1">
    <Layers bind:activeLayer bind:activeInvert/>
  </div>
  <div class="w-full h-full flex items-center justify-center mr-6">
    <button class="mr-2" on:click={previousImage} disabled={masks.length === 0}>
      <ChevronLeft color="#272729" />
    </button>
    <Preview bind:masks {activeLayer} {activeInvert} {imageIndex} />
    <button class="ml-2" on:click={nextImage} disabled={masks.length === 0}>
      <ChevronRight color="#272729" />
    </button>
  </div>

  <AllMasks {masks} bind:imageIndex />
</div>
