<script>
    export let masks;
    export let activeLayer;
    export let imageIndex;
</script>

{#if masks.length !== 0}
    {#if activeLayer === 0}
        <img id="preview" src={masks[imageIndex].white} alt="" />
    {:else if activeLayer === 1}
        <img id="preview" src={masks[imageIndex].blue} alt="" />
    {:else if activeLayer === 2}
        <img id="preview" src={masks[imageIndex].red} alt="" />
    {/if}
{:else}
    <div id="umf"><h1>Upload mask first!</h1></div>
{/if}

<style>
    #preview,
    #umf {
        width: 100%;
        height: auto;
        aspect-ratio: 16/9;
        object-fit: cover;
        border-radius: 4px;
    }

    #umf {
        display: flex;
        align-items: center;
    }

    #umf > h1 {
        width: 100%;
        text-align: center;
        font-family: "Geist", sans-serif;
        font-weight: 500;
        font-size: 26px;
        color: var(--main-font-color);
    }
</style>
