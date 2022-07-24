<script>
  import Group from '../core/Group.svelte';
  import Input from '../core/Input.svelte';

  export let field;
  export let index;
</script>

<fieldset class="form--fieldset form--group">
  <legend class="form--legend">{field.label}</legend>
  {#each field.fields as f}
    {#if f.fields}
      <Group field={f} {index} />
    {:else}
      <Input field={f} {index} />
    {/if}
  {/each}
</fieldset>
