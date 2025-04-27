<script>
  export let title = "Panel Title";
  const bgColor = "bg-slate-100";
</script>

<div 
  class="relative {bgColor} rounded-[16px] overflow-hidden w-full" 
  style="aspect-ratio: 16/9;"
>
  <div class="absolute top-0 left-0 right-0 flex items-center justify-between p-2 pl-4 text-slate-950 z-10">
    <h2 class="text-[24px] font-bold">{title}</h2>
    <div class="flex gap-2 pr-4">
      <slot name="buttons"></slot> 
    </div>
  </div>

  <div class="absolute inset-0 flex items-center justify-center pt-12">
    <slot></slot> 
  </div>
</div>