<script lang="ts">
  import './app.css';
  import Sidebar from "./components/sidebar.svelte";
  import Panel from "./components/panel.svelte";
  import MaskComponent from './components/masks/maskComponent.svelte'
  import UploadButton from './components/masks/masksUploadButton.svelte'

  type Mask = {
    white: string
    blue: string
    red: string
  }

  let masks: Mask[] = []
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
            <span slot="buttons">
              <UploadButton bind:masks />
            </span>
            <MaskComponent bind:masks />
          </Panel>
          <Panel title="Projector">
            <p>Text</p>
          </Panel>
        </div>
      </div>
    </main>
  </div>
</body>