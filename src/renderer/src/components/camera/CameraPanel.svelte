<!-- Control panel component -->
<div
  class="absolute bottom-0 p-2 bg-black bg-opacity-60 backdrop-blur-sm flex justify-between items-center z-10 rounded-xl m-1 w-full"
>
  <!-- Camera selector -->
  <div class="flex items-center space-x-2 rounded-xl">
    <select
      class="bg-gray-900 text-white text-xs py-1 pl-2 pr-6 rounded border border-gray-700"
      bind:value={$selectedDeviceId}
      on:change={handleDeviceChange}
    >
      {#each $videoDevices as device}
        <option value={device.deviceId}>
          {device.label || `Camera ${$videoDevices.indexOf(device) + 1}`}
        </option>
      {/each}
    </select>
  </div>

  <!-- Camera controls -->
  <div class="flex items-right space-x-3 m-2">
    <button on:click={() => toggleFullscreen(cameraView)}>
      <Expand class="w-4 h-4 text-white" />
    </button>
    <button on:click={captureScreenshot}>
      <Camera class="w-4 h-4 text-white" />
    </button>
    <button on:click={openCameraSettings}>
      <Settings class="w-4 h-4 text-white" />
    </button>
  </div>
</div>
