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

<div id="layers">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="layer-dots" id="red" on:click={layer}></div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="layer-dots" id="blue" on:click={layer}></div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="layer-dots" id="black-white" on:click={layer}>
        <div id="black"></div>
    </div>
</div>

<style>
    #layers {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        aspect-ratio: 16/9;
        display: flex;
        flex-direction: column;
        padding: 10px 20px;
        gap: 5px;
    }

    .layer-dots {
        width: 20px;
        height: 20px;
        border: 1px solid var(--border-color);
        opacity: 90%;
        cursor: pointer;
        z-index: 11;
        border-radius: 8px;
    }

    #layers #red {
        background-color: #d83939;
    }

    #layers #blue {
        background-color: #3983d8;
    }

    #layers #black-white {
        background-color: #ffffff;
    }

    #layers #black-white #black {
        background-color: #1a1a1a;
        width: 10px;
        height: 100%;
        border-radius: 5px 0px 0px 5px;
    }
</style>