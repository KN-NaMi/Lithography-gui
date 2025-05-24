<script lang="ts">
  export let activeLayer: number
  export let activeInvert: boolean

  const layer = (event: MouseEvent | KeyboardEvent): void => {
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
      case 'invert':
        activeInvert = !activeInvert
        break
      default:
        activeLayer = 0
        break
    }
  }
</script>

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

<button
  class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#fff] flex items-center justify-center"
  id="invert"
  on:click={layer}
  aria-label="Blue layer"
>
  <i class="font-serif">i</i>
</button>
