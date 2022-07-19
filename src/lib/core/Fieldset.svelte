<script>
  import Input from './Input.svelte';
  export let field;
  export let index = null;
</script>

<fieldset class="form--fieldset form--group">
  <legend class="form--legend">{field.label}</legend>
  {#each field.fields as f}
    {#if f.fields}
      <svelte:self field={f} />
    {:else}
      <Input field={f} name={index >= 0 ? field.name + `[${index}]` : field.name} />
    {/if}
  {/each}
</fieldset>
