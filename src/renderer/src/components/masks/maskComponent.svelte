<script lang="ts">
  import AllMasks from './allMasks.svelte'
  import UploadButton from './masksUploadButton.svelte'
  import Preview from './masksPreview.svelte'
  import Layers from './masksLayers.svelte'

  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  type Mask = {
    white: string
    blue: string
    red: string
  }

  let masks: Mask[] = []

  let imageIndex: number = 0

  let activeLayer: number = 0

  const nextImage = (): void => {
    imageIndex = imageIndex === masks.length - 1 ? 0 : imageIndex + 1
  }

  const previousImage = (): void => {
    imageIndex = imageIndex === 0 ? masks.length - 1 : imageIndex - 1
  }
</script>

<div class="w-full h-full bg-blue-500 flex items-center justify-center">
  <div class="w-full flex absolute top-12 left-10">
    <UploadButton bind:masks />
  </div>
  <div class="w-full h-full flex items-center justify-center">
    <button class="mr-5" on:click={previousImage}>
      <ChevronLeft />
    </button>
    <Preview {masks} {activeLayer} {imageIndex} />
    <button class="ml-5"on:click={nextImage}>
      <ChevronRight />
    </button>
  </div>

  <AllMasks {masks} bind:imageIndex />
</div>



<!-- <div
  id="mask-wrapper"
  class="w-[600px] h-auto bg-[#0a0a0a] border-2 border-[#272729] rounded-lg flex flex-col p-2.5 relative overflow-hidden"
>
  <div id="controls" class="grid grid-cols-[auto_repeat(2,40px)] h-10 gap-2.5 mb-2.5">
    <h1 class="text-xl font-medium text-[#dddddd] flex items-center font-sans">Mask</h1>
    <UploadButton bind:masks />
  </div>
  <Preview {masks} {activeLayer} {imageIndex} />
  <div id="overlay" class="text-[#dddddd]">
    <Layers bind:activeLayer />
    <div
      id="previous-next"
      class="w-full aspect-video absolute bottom-0 left-0 flex justify-between p-5 items-center"
    >
      <button
        id="back"
        on:click={previousImage}
        class="flex p-1 h-fit bg-[#1818186b] shadow-[0px_0px_24px_10px_#18181898] rounded-lg cursor-pointer border-none outline-none"
        aria-label="Previous image"
      >
        <ChevronLeft color="#fff"  class="h-full"/>
      </button>
      <button
        id="forward"
        on:click={nextImage}
        class="flex p-1 h-fit bg-[#1818186b] shadow-[0px_0px_24px_10px_#18181898] rounded-lg cursor-pointer border-none outline-none"
        aria-label="Next image"
      >
        <ChevronRight color="#fff" class="h-full"/>
      </button>
    </div>
    <AllMasks {masks} bind:imageIndex />
  </div>
</div> -->
