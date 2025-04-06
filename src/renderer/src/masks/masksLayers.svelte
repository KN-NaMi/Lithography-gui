<script>
    export let activeLayer;

    let layer = (event) => {
        switch (event.target.id) {
            case "black-white":
                activeLayer = 0;
                break;
            case "blue":
                activeLayer = 1;
                break;
            case "red":
                activeLayer = 2;
                break;
            default:
                activeLayer = 0;
                break;
        }
    };
</script>

<div id="layers" class="absolute bottom-0 left-0 w-full aspect-video flex flex-col p-2.5 px-5 gap-[5px]">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#d83939]" id="red" on:click={layer}></div>
    
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-[#3983d8]" id="blue" on:click={layer}></div>
    
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="w-5 h-5 border border-[#272729] opacity-90 cursor-pointer z-[11] rounded-lg bg-white" id="black-white" on:click={layer}>
        <div id="black" class="bg-[#1a1a1a] w-[10px] h-full rounded-l-md"></div>
    </div>
</div>