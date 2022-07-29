<script>
  import { getContext } from 'svelte';

  export let field;
  export let name;

  const { validation, elements } = getContext('form');
  $: valid = $validation[name];
</script>

{#await valid then}
  {#if typeof valid === 'string'}
    {#if field._message && elements.messages[field._message]}
      <svelte:component this={elements.messages[field._message]} {name} />
    {:else}
      <p class="form--error-message">{valid}</p>
    {/if}
  {/if}
{/await}
