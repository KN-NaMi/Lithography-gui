<script>
    import { Settings } from 'lucide-svelte';
    import { settings } from '../../../config';
    import namilogo from '../../../../resources/namilogo.svg';
</script>

<div>
    <nav class="flex items-center justify-between p-4 bg-primary text-white">
        <div class="flex items-center">
            <img src={namilogo} alt="Logo" class="w-16 h-16 mr-8" />
            <span class="text-3xl font-semibold">{settings.appName}</span>
        </div>
        <button class="p-2 rounded-lg hover:bg-secondary transition">
            <Settings class="w-10 h-10" />
        </button>
    </nav>
</div>
