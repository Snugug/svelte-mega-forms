<script>
  import { getContext } from 'svelte';
  import Label from '../core/Label.svelte';
  import Message from '../core/Message.svelte';

  export let field = {};
  export let name = '';

  const { values, disabled } = getContext('form');

  $: value = $values[name] || field.value || '';

  // Set up options for select
  const options = (field.options || []).map((o) => {
    if (o?.label && o?.value) return o;
    if (o?.label) return { value: o.label, label: o.label };
    if (o?.value) return { value: o.value, label: o.value };
    return { value: o, label: o };
  });
</script>

<div class="form--group {field.half ? 'form--half' : 'form--full'} {field.group || ''}">
  {#if field.label}
    <Label {field} {name} />
  {/if}

  {#if field.type === 'textarea'}
    <textarea
      class="form--input"
      {name}
      id={name}
      placeholder={field.placeholder}
      required={field.required === true ? true : undefined}
      rows="3"
      {value}
      {...field.attributes}
      disabled={$disabled}
    />
  {:else if field.type === 'select'}
    <select {name} id={name} class="form--input form--select" bind:value disabled={$disabled}>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else}
    <input
      class="form--input"
      {name}
      id={name}
      placeholder={field.placeholder}
      required={field.required === true ? true : undefined}
      type={field.type}
      {value}
      {...field.attributes}
      disabled={$disabled}
    />
  {/if}

  <Message {name} />
</div>
