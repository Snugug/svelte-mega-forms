<script>
  import { imask } from '@imask/svelte';
  import { getContext } from 'svelte';
  import Message from '../core/Message.svelte';

  export let field = {};
  export let name = '';

  const { values, disabled } = getContext('form');

  $: value = $values[name];
</script>

<div class="form--group {field.half ? 'form--half' : 'form--full'} {field.group || ''}">
  {#if field.label}
    <label
      for={name}
      class="form--label"
      data-required={field.required === true ? true : undefined}
    >
      {field.label}
    </label>
  {/if}

  <input
    class="form--input"
    {name}
    id={name}
    required={field.required === true ? true : undefined}
    type={field.type}
    {value}
    use:imask={field.mask}
    {...field.attributes}
    {disabled}
  />

  <Message {name} />
</div>
