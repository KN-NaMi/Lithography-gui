<!-- AllMasks.svelte -->
<script>
    export let masks;
    export let imageIndex;
</script>

<div id="all-masks" class="w-full flex justify-center items-end gap-[5px] p-[15px] absolute bottom-0 left-0 z-10">
    {#each masks as mask, index}
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <img 
            src={mask.white} 
            alt="Image" 
            on:click={() => imageIndex = index}
            class={`h-[50px] w-[50px] object-cover cursor-pointer transition-transform duration-200 ease-in-out opacity-70 border border-[#272729] rounded-md ${imageIndex === index ? 'scale-105' : ''}`} 
        />
    {/each}
</div>