<script>
    import { Settings } from 'lucide-svelte';
    import namilogo from '../../../../resources/logonami-slate-950.svg';
</script>

<div class="h-screen w-28 bg-slate-100 text-white flex flex-col rounded-r-[24px]">
    <div class="p-4 flex flex-col items-center justify-center">
        <img
          src={namilogo || "/placeholder.svg"}
          alt="Logo"
          class="w-18 h-18"
        />
      </div>
    
    <div class="flex-grow"></div>
    
    <div class="p-4 flex justify-center mb-2">
        <button class="p-2 rounded-lg hover:bg-slate-200 transition flex items-center justify-center">
            <Settings class="w-8 h-8 text-slate-950" />
        </button>
    </div>
</div>

