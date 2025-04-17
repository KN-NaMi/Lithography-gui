<!-- AllMasks.svelte -->
<script lang="ts">
    export let masks: {
        white: string;
        blue: string;
        red: string;
    }[];
    export let imageIndex: number;

    function handleImageClick(index: number): void {
        imageIndex = index;
    }
</script>

<div id="all-masks" class="w-full flex justify-center items-end gap-[5px] p-[15px] absolute bottom-0 left-0 z-10">
    {#each masks as mask, index}
        <button
            aria-label={`Select mask ${index + 1}`}
            on:click={() => handleImageClick(index)}
            class={`h-[50px] w-[50px] p-0 border border-[#272729] rounded-md overflow-hidden cursor-pointer transition-transform duration-200 ease-in-out ${imageIndex === index ? 'scale-105' : ''}`}
        >
            <img 
                src={mask.white} 
                alt={`Mask ${index + 1}`} 
                class="h-full w-full object-cover opacity-70" 
            />
        </button>
    {/each}
</div>