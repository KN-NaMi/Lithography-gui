<script>
  import './app.css';
  import Navbar from './components/Navbar.svelte';
</script>

<body class="text-primary">
  <Navbar />
  
  <div class="flex flex-col p-4 space-y-4 h-full">
    <div class="flex flex-row space-x-4 h-1/2">
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 1</h2>
        <p>Content for box 1.</p>
      </div>
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 2</h2>
        <p>Content for box 2.</p>
      </div>
    </div>

    <div class="flex flex-row space-x-4 h-1/2">
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 3</h2>
        <p>Content for box 3.</p>
      </div>
      <div class="box border-2 border-primary flex-1 p-4 rounded-lg">
        <h2 class="text-xl">Box 4</h2>
        <p>Content for box 4.</p>
      </div>
    </div>
  </div>
</body>