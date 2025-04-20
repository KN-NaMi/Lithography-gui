<script>
  import './app.css';
  import Sidebar from "./components/sidebar.svelte";
  import Panel from "./components/panel.svelte";
  import MaskComponent from './components/masks/maskComponent.svelte'
</script>

<body class="text-primary h-screen overflow-hidden">
  <div class="flex h-full">
    <aside class="h-full flex-shrink-0">
      <Sidebar />
    </aside>

    <main class="flex-1 bg-slate-50 rounded-l-[24px] p-[4dvh] overflow-hidden">
      <div class="w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[2dvh] ">
          <Panel title="Camera">
            <p>Text</p>
          </Panel>
          <Panel title="Motion">
            <p>Text</p>
          </Panel>
          <Panel title="Mask">
            <MaskComponent />
          </Panel>
          <Panel title="Projector">
            <p>Text</p>
          </Panel>
        </div>
      </div>
    </main>
  </div>
</body>
