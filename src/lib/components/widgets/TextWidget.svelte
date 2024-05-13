<script>
    import { onMount } from 'svelte';
    import { beforeUpdate } from 'svelte';

    beforeUpdate(() => {
        //console.log('beforeUpdate');
    });
    export let config
    export let filter

    onMount(async () => {
        //console.log('onMount TEXT_widget');
    });

</script>
<div class="p-1 overflow-auto">
    {@html config.description}
</div>