<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Expand, Camera, Settings } from 'lucide-svelte'

  let devices: MediaDeviceInfo[] = []
  let selectedDeviceId: string | undefined = undefined
  let videoElement: HTMLVideoElement
  let stream: MediaStream | null = null
  let error: string | null = null
  let isFullscreen = false
  let containerElement: HTMLDivElement
  let capturedPhoto: string | null = null

  // --- Funkcje obsługi kamery ---

  async function getDevices() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true }) // Poproś o uprawnienia najpierw
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      devices = allDevices.filter((device) => device.kind === 'videoinput')
      if (devices.length > 0 && !selectedDeviceId) {
        selectedDeviceId = devices[0].deviceId // Wybierz pierwszą domyślnie
      }
    } catch (err: any) {
      console.error('Error enumerating devices or getting permissions:', err)
      error = `Nie można uzyskać dostępu do kamery: ${err.message}. Sprawdź uprawnienia.`
      devices = [] // Wyczyść listę, jeśli nie ma uprawnień/urządzeń
    }
  }

  async function startStream(deviceId: string) {
    // Zatrzymaj poprzedni stream, jeśli istnieje
    stopStream()
    error = null // Resetuj błąd

    const constraints: MediaStreamConstraints = {
      video: {
        deviceId: { exact: deviceId }
      },
      audio: false // Zakładamy, że nie potrzebujesz audio
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoElement) {
        videoElement.srcObject = stream
        const videoTrack = stream.getVideoTracks()[0]
        const settings = videoTrack.getSettings()
        console.log(`Actual resolution: ${settings.width}x${settings.height}`)
        // videoElement.play(); // Atrybut autoplay powinien wystarczyć
      }
    } catch (err: any) {
      console.error(`Error starting stream for device ${deviceId}:`, err)
      error = `Nie można uruchomić kamery (${devices.find((d) => d.deviceId === deviceId)?.label || 'wybrane urządzenie'}): ${err.message}`
      stream = null
      if (videoElement) {
        videoElement.srcObject = null
      }
    }
  }

  function stopStream() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      stream = null
      if (videoElement) {
        videoElement.srcObject = null // Wyczyść źródło wideo
      }
    }
  }

  // --- Obsługa pełnego ekranu ---

  async function toggleFullscreen() {
    if (!containerElement) return

    if (!document.fullscreenElement) {
      try {
        await containerElement.requestFullscreen()
        isFullscreen = true
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err)
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
        isFullscreen = false
      }
    }
  }

  // --- Obsługa robienia zdjęć ---

  function capturePhoto() {
    if (!videoElement || !stream) {
      console.error('No video stream available')
      return
    }

    try {
      // Utwórz tymczasowy canvas do przechwycenia obrazu z wideo
      const canvas = document.createElement('canvas')
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Narysuj aktualną klatkę wideo na canvasie
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        // Konwertuj canvas do URL danych
        capturedPhoto = canvas.toDataURL('image/jpeg')

        // Automatycznie pobierz zdjęcie
        downloadPhoto()
      }
    } catch (err) {
      console.error('Error capturing photo:', err)
    }
  }

  function downloadPhoto() {
    if (!capturedPhoto) return

    // Utwórz element <a> do pobrania pliku
    const link = document.createElement('a')
    link.href = capturedPhoto

    // Ustaw nazwę pliku z datą i czasem
    const now = new Date()
    const fileName = `photo_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}.jpg`
    link.download = fileName

    // Symuluj kliknięcie, aby pobrać plik
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // --- Cykl życia komponentu ---

  onMount(async () => {
    await getDevices()

    // Dodajemy nasłuchiwanie na zmianę trybu pełnoekranowego
    document.addEventListener('fullscreenchange', () => {
      isFullscreen = !!document.fullscreenElement
    })
  })

  onDestroy(() => {
    stopStream() // Ważne: zwolnij kamerę przy niszczeniu komponentu
    document.removeEventListener('fullscreenchange', () => {})
  })

  // --- Reaktywność ---

  // Uruchom stream, gdy zmieni się wybrane urządzenie i mamy uprawnienia
  $: if (selectedDeviceId && devices.length > 0) {
    startStream(selectedDeviceId)
  }
</script>

<div class="flex flex-col h-full w-full" bind:this={containerElement}>
  <div class="flex items-center justify-between mb-2 flex-shrink-0">
    <div class="flex-1 mr-4">
      {#if devices.length > 0}
        <select
          bind:value={selectedDeviceId}
          class="w-full p-2 border border-gray-300 rounded bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {#each devices as device}
            <option value={device.deviceId}
              >{device.label || `Kamera ${device.deviceId.substring(0, 6)}`}</option
            >
          {/each}
        </select>
      {:else if !error}
        <p class="text-sm text-gray-500">Wyszukiwanie kamer...</p>
      {/if}
    </div>

    <div class="flex space-x-1">
      <button
        on:click={toggleFullscreen}
        title={isFullscreen ? 'Zamknij pełny ekran' : 'Pełny ekran'}
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Expand size={18} />
      </button>
      <button
        on:click={capturePhoto}
        title="Zrób i pobierz zdjęcie"
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        disabled={!stream}
      >
        <Camera size={18} />
      </button>
      <button
        title="Ustawienia"
        class="p-1.5 text-gray-600 hover:bg-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <Settings size={18} />
      </button>
    </div>
  </div>

  <div
    class="flex-grow w-full h-full relative overflow-hidden bg-black rounded"
    class:fullscreen-container={isFullscreen}
  >
    <div class="h-full w-full flex items-center justify-center">
      <video
        bind:this={videoElement}
        autoplay
        muted
        playsinline
        class="w-full h-full object-cover"
        class:fullscreen-video={isFullscreen}
      />
    </div>

    {#if error}
      <div
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
      >
        <p>{error}</p>
      </div>
    {:else if !stream && devices.length > 0 && !selectedDeviceId}
      <div
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
      >
        <p>Wybierz urządzenie wideo z listy powyżej.</p>
      </div>
    {:else if !stream && devices.length === 0 && !error}
      <div
        class="inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white p-4 text-center"
      >
        <p>Nie wykryto żadnych kamer lub brak uprawnień.</p>
      </div>
    {/if}
  </div>

  <!-- Zachowałem funkcję handleSettings jako placeholder -->
  <style>
    :global(body.fullscreen),
    :global(body.fullscreen .fullscreen-container) {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    :global(.fullscreen-container) {
      display: flex;
      flex-direction: column;
    }

    :global(.fullscreen-video) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Ensure container takes full available height */
    :global(html, body) {
      height: 100%;
    }

    :global(#app, :root) {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  </style>

  <script>
    function handleSettings() {
      console.log('Settings clicked')
      // Tutaj logika otwarcia ustawień kamery (np. rozdzielczość, klatki)
    }
  </script>
</div>
