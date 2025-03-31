<script>
    import { Settings } from 'lucide-svelte';
    import { settings } from '../../../config';
    import namilogo from '../../../../resources/namilogo.svg';
</script>

<div>
    <nav class="flex items-center justify-between p-4 bg-primary text-white h-[12vh]">
        <div class="flex items-center">
            <img src={namilogo} alt="Logo" class="w-[5vw] h-[5vw] mr-4" />
            <span class="text-[2vw] font-semibold">
                {settings.appName}
            </span>
        </div>
        <button class="p-2 rounded-lg hover:bg-secondary transition">
            <Settings class="w-[3vw] h-[5vh]" />
        </button>
    </nav>
</div>