<!-- AllMasks.svelte -->
<script>
    export let masks;
    export let imageIndex;
</script>

<div id="all-masks">
    {#each masks as mask, index}
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img 
            src={mask.white} 
            alt="Image" 
            on:click={() => imageIndex = index}
            class={imageIndex === index ? 'selected' : ''} 
        />
    {/each}
</div>

<style>
    #all-masks {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        gap: 5px;
        padding: 15px;

        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
    }

    #all-masks > img {
        height: 50px;
        width: 50px;
        object-fit: cover;
        cursor: pointer;
        transition: transform 0.2s ease;
        opacity: 70%;
        border: 1px solid var(--border-color);
        border-radius: 6px;
    }

    #all-masks > img:hover {
        transform: scale(1.05);
    }
</style>
