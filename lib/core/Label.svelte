<script>
  import { getContext } from 'svelte';

  export let field;
  export let name;
  export let required = false;

  const { elements } = getContext('form');
</script>

{#if field._label && elements.labels[field._label]}
  <svelte:component this={elements.labels[field._label]} {field} {name} />
{:else}
  <label for={name} class="form--label" data-required={required === true ? true : undefined}>
    {field.label}
  </label>
{/if}
