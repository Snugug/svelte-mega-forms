<script>
  import { getContext } from 'svelte';
  import Label from '../core/Label.svelte';
  import Message from '../core/Message.svelte';

  export let field = {};
  export let name = '';

  const { values, disabled, elements } = getContext('form');

  $: value = $values[name];
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
      {disabled}
    />
  {:else if field.type === 'select'}
    <select {name} id={name} class="form--input form--select" bind:value {disabled}>
      {#each field?.options || [] as option}
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
      {disabled}
    />
  {/if}

  <Message {name} />
</div>
