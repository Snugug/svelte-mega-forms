<script>
  import { imask } from '@imask/svelte';
  import { getContext } from 'svelte';
  import Label from '../core/Label.svelte';
  import Message from '../core/Message.svelte';

  export let field = {};
  export let name = '';

  const { values, disabled } = getContext('form');

  $: value = $values[name];

  $: {
    field.value = value;
  }
</script>

<div class="form--group {field.half ? 'form--half' : 'form--full'} {field.group || ''}">
  <Label {field} {name} />

  <input
    class="form--input"
    {name}
    id={name}
    required={field.required === true ? true : undefined}
    type={field.type}
    {value}
    use:imask={field.mask}
    {...field.attributes}
    disabled={$disabled}
  />

  <Message {field} {name} />
</div>
