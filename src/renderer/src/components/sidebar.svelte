<script>
    import { Settings } from 'lucide-svelte';
    import namilogo from '../../../../resources/namilogo.svg';
</script>

<div class="h-screen w-[8vw] bg-primary text-white flex flex-col">
    <div class="p-4 flex flex-col items-center justify-center">
        <img src={namilogo || "/placeholder.svg"} alt="Logo" class="w-[6vw] h-[6vw]" />
    </div>
    
    <div class="flex-grow"></div>
    
    <div class="p-4 flex justify-center mb-2">
        <button class="p-2 rounded-lg hover:bg-secondary transition flex items-center justify-center">
            <Settings class="w-[3vw] h-[3vw]" />
        </button>
    </div>
</div>