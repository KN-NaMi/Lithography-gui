<script lang="ts">
  export let activeLayer: number

  const layer = (event: MouseEvent | KeyboardEvent): void => {
    // Only process keyboard events if they're Enter or Space
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }
    }

    const target = event.currentTarget as HTMLElement
    const id = target.id

    switch (id) {
      case 'black-white':
        activeLayer = 0
        break
      case 'blue':
        activeLayer = 1
        break
      case 'red':
        activeLayer = 2
        break
      default:
        activeLayer = 0
        break
    }
  }
</script>

<div
  id="layers"
  class="absolute bottom-0 left-0 w-full aspect-video flex flex-col p-2.5 px-5 gap-[5px]"
>
  <button
    class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#d83939]"
    id="red"
    on:click={layer}
    aria-label="Red layer"
  >
  </button>

  <button
    class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#3983d8]"
    id="blue"
    on:click={layer}
    aria-label="Blue layer"
  >
  </button>

  <button
    class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-white relative"
    id="black-white"
    on:click={layer}
    aria-label="Black and white layer"
  >
    <div id="black" class="bg-[#1a1a1a] w-[10px] h-full rounded-l-md absolute left-0 top-0"></div>
  </button>
</div>
