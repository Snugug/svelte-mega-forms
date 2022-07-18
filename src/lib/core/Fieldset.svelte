<script>
  import Input from './Input.svelte';
  export let field;
  export let index = null;
</script>

<fieldset class="form--fieldset form--group">
  <legend class="form--legend">{field.label}</legend>
  {#each field.fields as f}
    {#if f.fields}
      <svelte:self bind:field={f} />
    {:else}
      <Input bind:field={f} name={index >= 0 ? field.name + `[${index}]` : field.name} />
    {/if}
  {/each}
</fieldset>
