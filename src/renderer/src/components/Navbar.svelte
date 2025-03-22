<script>
    import { Settings } from 'lucide-svelte';
    import { settings } from '../../../config';
    import namilogo from '../../../../resources/namilogo.svg';
</script>

<div>
    <nav class="flex items-center justify-between p-4 bg-primary text-white">
        <div class="flex items-center">
            <img src={namilogo} alt="Logo" class="w-20 h-20 mr-8" />
            <span class="text-4xl font-semibold">{settings.appName}</span>
        </div>
        <button class="p-2 rounded-lg hover:bg-secondary transition">
            <Settings class="w-12 h-12" />
        </button>
    </nav>
</div>
