<script lang="ts">
    import AllMasks from "./allMasks.svelte";
    import UploadButton from "./masksUploadButton.svelte";
    import Preview from "./masksPreview.svelte";
    import Layers from "./masksLayers.svelte";

    import arrowIcon from "../assets/arrow.svg";
    import settingsIcon from "../assets/settings.svg";

    type Mask = {
        white: string;
        blue: string;
        red: string;
    };

    let masks: Mask[] = [];

    let imageIndex: number = 0;

    let activeLayer: number = 0;

    const nextImage = (): void => {
        imageIndex = imageIndex === masks.length - 1 ? 0 : imageIndex + 1;
    };

    const previousImage = (): void => {
        imageIndex = imageIndex === 0 ? masks.length - 1 : imageIndex - 1;
    };
</script>

<div id="mask-wrapper" class="w-[600px] h-auto bg-[#0a0a0a] border-2 border-[#272729] rounded-lg flex flex-col p-2.5 relative overflow-hidden">
    <div id="controls" class="grid grid-cols-[auto_repeat(2,40px)] h-10 gap-2.5 mb-2.5">
        <h1 class="text-xl font-medium text-[#dddddd] flex items-center font-sans">Mask</h1>
        <UploadButton bind:masks />
        <button class="flex p-1 cursor-pointer border-none bg-transparent outline-none appearance-none" aria-label="Settings">
            <img src="{settingsIcon}" alt="Settings" class="h-full"/>
        </button>
    </div>
    <Preview {masks} {activeLayer} {imageIndex} />
    <div id="overlay" class="text-[#dddddd]">
        <Layers bind:activeLayer/>
        <div id="previous-next" class="w-full aspect-video absolute bottom-0 left-0 flex justify-between p-5 items-center">
            <button 
                id="back" 
                on:click={previousImage} 
                class="flex p-1 h-fit bg-[#1818186b] shadow-[0px_0px_24px_10px_#18181898] rounded-lg cursor-pointer border-none outline-none"
                aria-label="Previous image"
            >
                <img src="{arrowIcon}" alt="Previous" class="rotate-180" />
            </button>
            <button 
                id="forward" 
                on:click={nextImage} 
                class="flex p-1 h-fit bg-[#1818186b] shadow-[0px_0px_24px_10px_#18181898] rounded-lg cursor-pointer border-none outline-none"
                aria-label="Next image"
            >
                <img src="{arrowIcon}" alt="Next" />
            </button>
        </div>
        <AllMasks {masks} bind:imageIndex />
    </div>
</div>