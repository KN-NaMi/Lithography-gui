<script lang="ts">
  export let masks: {
    white: string;
    blue: string;
    red: string;
    iWhite: string;
    iBlue: string;
    iRed: string;
  }[];

  import { processImage } from '../../lib/imageProcessor'
  import { Upload } from 'lucide-svelte'

  let fileInput: HTMLInputElement

  // Handle button click to trigger file input
  function triggerFileInput(): void {
    fileInput.click()
  }

  // Handle file selection and display
  async function handleFileSelect(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement
    const selectedFiles = Array.from(target.files || []) // Convert FileList to array

    if (selectedFiles.length > 0) {
      // Process each file and create mask objects
      const recentlyAddedMasks = await Promise.all(
        selectedFiles.map(async (file) => {
          // Create original image URL (keeping original colors including white)
          const whiteImageURL = URL.createObjectURL(file)

          // Process image, change white to blue
          const blueImageURL = await processImage(file, 1, false)
          // Process image, change white to red
          const redImageURL = await processImage(file, 2, false)

          const whiteInvertedImageURL = await processImage(file, 3, true)
          const redInvertedImageURL = await processImage(file, 2, true)
          const blueInvertedImageURL = await processImage(file, 1, true)

          return {
            white: whiteImageURL,
            blue: blueImageURL,
            red: redImageURL,
            iWhite: whiteInvertedImageURL,
            iBlue: blueInvertedImageURL,
            iRed: redInvertedImageURL
          }
        })
      )

      // Add all new masks to the existing array
      masks = [...masks, ...recentlyAddedMasks]
    }
  }
</script>

<button on:click={triggerFileInput} class="flex cursor-pointer border-none bg-transparent">
  <Upload color="#272729" class="h-full" />
</button>

<input
  type="file"
  bind:this={fileInput}
  on:change={handleFileSelect}
  accept="image/svg+xml"
  class="hidden"
  multiple />