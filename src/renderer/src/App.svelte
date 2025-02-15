<script lang="ts">
  function handleOpenNewWindow() {
    if (window.electronAPI) {
      window.electronAPI.openNewWindow();
    } else {
      console.error('Electron API is not available.');
    }
  }
</script>

<main>
  <h1>NaMi!</h1>
  <button on:click={handleOpenNewWindow}>Open New window</button>
</main>

<style>
  main {
    padding: 2rem;
  }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
</style>