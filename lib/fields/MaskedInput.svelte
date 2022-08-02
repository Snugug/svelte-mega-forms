<script>
  import { imask } from '@imask/svelte';
  import { getContext } from 'svelte';
  import Label from '../core/Label.svelte';
  import Message from '../core/Message.svelte';
  import { isRequired } from '../helpers/fields';

  export let field = {};
  export let name = '';

  const { values, disabled } = getContext('form');

  $: value = $values[name];

  $: {
    field.value = value;
  }

  $: required = isRequired(field, $values, name);
</script>

<div class="form--group {field.half ? 'form--half' : 'form--full'} {field.group || ''}">
  <Label {field} {name} {required} />

  <input
    class="form--input"
    {name}
    id={name}
    {required}
    type={field.type}
    {value}
    use:imask={field.mask}
    {...field.attributes}
    disabled={$disabled}
  />

  <Message {field} {name} />
</div>
