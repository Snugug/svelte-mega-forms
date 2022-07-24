<script>
  import { getContext } from 'svelte';

  export let name;

  const { validation } = getContext('form');
  $: valid = $validation[name];
</script>

{#await valid then}
  {#if typeof valid === 'string'}
    <h1>{valid}</h1>
  {/if}
{/await}
