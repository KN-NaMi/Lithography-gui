<script>
    import AllMasks from "./allMasks.svelte";
    import UploadButton from "./masksUploadButton.svelte";
    import Preview from "./masksPreview.svelte";
    import Layers from "./masksLayers.svelte";

    import arrowIcon from "../assets/arrow.svg";
    import settingsIcon from "../assets/settings.svg";

    let masks = [];

    let imageIndex = 0;

    let activeLayer = 0;

    let nextImage = () => {
        imageIndex = imageIndex === masks.length - 1 ? 0 : imageIndex + 1;
    };

    let previousImage = () => {
        imageIndex = imageIndex === 0 ? masks.length - 1 : imageIndex - 1;
    };

</script>

<div id="mask-wrapper">
    <div id="controls">
        <h1>Mask</h1>
        <UploadButton bind:masks />
        <button>
            <img src="{settingsIcon}" alt="" />
        </button>
    </div>
    <Preview {masks} {activeLayer} {imageIndex} />
    <div id="overlay">
        <Layers bind:activeLayer/>
        <div id="previous-next">
            <button id="back" on:click={previousImage}>
                <img src="{arrowIcon}" alt="arrow" />
            </button>
            <button id="forward" on:click={nextImage}>
                <img src="{arrowIcon}" alt="arrow" />
            </button>
        </div>
        <AllMasks {masks} bind:imageIndex />
    </div>
</div>

<style>
    :root {
        --main-bgc: #0a0a0a;
        --main-font-color: #dddddd;
        --border-color: #272729;
    }

    #mask-wrapper * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border-radius: 6px;
        color: var(--main-font-color);
    }

    #mask-wrapper {
        background-color: var(--main-bgc);
        width: 600px;
        height: auto;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        padding: 10px;
        position: relative;
        overflow: hidden;
    }

    #controls {
        display: grid;
        grid-template-columns: auto repeat(2, 40px);
        height: 40px;
        gap: 10px;
        margin-bottom: 10px;
    }

    #controls h1 {
        font-size: 20px;
        font-family: "Geist", sans-serif;
        font-weight: 500;
        display: flex;
        align-items: center;
    }

    #controls > button {
        all: unset;
        display: flex;
        padding: 4px;
    }

    #previous-next {
        width: 100%;
        aspect-ratio: 16/9;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        padding: 20px;
        align-items: center;
    }

    #previous-next > button {
        all: unset;
        height: fit-content;
        background-color: #1818186b;
        box-shadow: 0px 0px 24px 10px #18181898;
        border-radius: 8px;
        display: flex;
        padding: 4px;
        cursor: pointer;
    }

    #previous-next > #back > img {
        rotate: 180deg;
    }
</style>
