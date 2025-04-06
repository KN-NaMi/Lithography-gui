<script>

    export let masks

    import { processImage } from "../lib/imageProcessor.ts";

    import uploadIcon from "../assets/upload.svg";
    
    let fileInput;

    // Handle button click to trigger file input
    function triggerFileInput() {
        fileInput.click();
    }

    // Handle file selection and display
    async function handleFileSelect(event) {
        const selectedFiles = Array.from(event.target.files); // Convert FileList to array

        if (selectedFiles.length > 0) {
            // Process each file and create mask objects
            const recentlyAddedMasks = await Promise.all(
                selectedFiles.map(async (file) => {
                    // Create black-white image URL
                    const wbImageURL = URL.createObjectURL(file);

                    // Process image, change white to blue
                    const blueImageURL = await processImage(file, 1);
                    // Process image, change white to red
                    const redImageURL = await processImage(file, 2);

                    return {
                        white: wbImageURL,
                        blue: blueImageURL,
                        red: redImageURL,
                    };
                }),
            );

            // Add all new masks to the existing array
            masks = [...masks, ...recentlyAddedMasks];
        }
    }
</script>

<button 
  on:click={triggerFileInput}
  class="flex p-1 cursor-pointer border-none bg-transparent"
>
  <img src="{uploadIcon}" alt="" class="h-auto" /> 
</button>

<input
    type="file"
    bind:this={fileInput}
    on:change={handleFileSelect}
    accept="image/svg+xml"
    class="hidden"
    multiple
/>