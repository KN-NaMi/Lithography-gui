<script lang="ts">
  type Mask = {
    white: string
    blue: string
    red: string
    iWhite: string
    iBlue: string
    iRed: string
  }

  export let masks: Mask[]
  export let activeLayer: number
  export let activeInvert: boolean
  export let imageIndex: number

  // Reactive statement that updates whenever dependencies change
  $: imageSource = getImageSource(masks, activeLayer, activeInvert, imageIndex)
  $: altText = getAltText(activeLayer, activeInvert)

  // Function to get the correct image source based on layer and invert state
  let getImageSource = (
    masks: Mask[],
    activeLayer: number,
    activeInvert: boolean,
    imageIndex: number
  ): string => {
    if (masks.length === 0) return ''

    const mask = masks[imageIndex]
    if (!mask) return ''

    if (activeInvert) {
      // When inverted, show the inverted versions
      switch (activeLayer) {
        case 0: // White layer inverted
          return mask.iWhite
        case 1: // Blue layer inverted
          return mask.iBlue
        case 2: // Red layer inverted
          return mask.iRed
        default:
          return mask.iWhite
      }
    } else {
      // Normal mode
      switch (activeLayer) {
        case 0:
          return mask.white
        case 1:
          return mask.blue
        case 2:
          return mask.red
        default:
          return mask.white
      }
    }
  }

  let getAltText = (activeLayer: number, activeInvert: boolean): string => {
    const layerNames = ['White', 'Blue', 'Red']
    const layerName = layerNames[activeLayer] || 'Unknown'
    return activeInvert ? `${layerName} Mask (Inverted)` : `${layerName} Mask`
  }
</script>

<div class="h-[88%] aspect-video flex justify-center items-center overflow-hidden rounded-lg">
  {#if masks.length !== 0}
    <div class="w-full h-full border border-[#272729] overflow-hidden rounded-lg">
      <img id="preview" src={imageSource} alt={altText} class="w-full h-full object-cover" />
    </div>
  {:else}
    <h1 class="text-center font-sans font-medium text-2xl text-[#272729]">Upload mask first!</h1>
  {/if}
</div>
