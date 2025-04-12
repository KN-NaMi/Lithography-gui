<script lang="ts">
    export let masks: {
        white: string;
        blue: string;
        red: string;
    }[];
    export let activeLayer: number;
    export let imageIndex: number;
</script>

{#if masks.length !== 0}
    {#if activeLayer === 0}
        <img id="preview" src={masks[imageIndex].white} alt="" class="w-full h-auto aspect-video object-cover rounded" />
    {:else if activeLayer === 1}
        <img id="preview" src={masks[imageIndex].blue} alt="" class="w-full h-auto aspect-video object-cover rounded" />
    {:else if activeLayer === 2}
        <img id="preview" src={masks[imageIndex].red} alt="" class="w-full h-auto aspect-video object-cover rounded" />
    {/if}
{:else}
    <div id="umf" class="w-full h-auto aspect-video flex items-center rounded">
        <h1 class="w-full text-center font-sans font-medium text-2xl text-[#dddddd]">Upload mask first!</h1>
    </div>
{/if}