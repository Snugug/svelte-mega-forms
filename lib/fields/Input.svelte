<script>
  import { getContext } from 'svelte';
  import Label from '../core/Label.svelte';
  import Message from '../core/Message.svelte';
  import { isRequired } from '../helpers/fields';

  export let field = {};
  export let name = '';

  const { values, disabled } = getContext('form');

  const isButton = field.type === 'button' || field.type === 'submit';

  $: value = $values[name] || field.value || (isButton && field.label ? field.label : '');

  let f;

  $: {
    if (f) {
      if (f.type === 'checkbox') {
        f.checked = value;
      } else if (f.type === 'radio') {
        f.checked = f.value === value;
      } else {
        f.value = value;
      }
    }
  }

  // Set up options for select
  const options = (field.options || []).map((o) => {
    if (o?.label && o?.value) return o;
    if (o?.label) return { value: o.label, label: o.label };
    if (o?.value) return { value: o.value, label: o.value };
    return { value: o, label: o };
  });

  $: required = isRequired(field, $values, name);
</script>

<div class="form--group {field.half ? 'form--half' : 'form--full'} {field.group || ''}">
  {#if field.label && !isButton && field.type !== 'checkbox' && field.type !== 'radio'}
    <Label {field} {name} {required} />
  {/if}

  {#if field.type === 'textarea'}
    <textarea
      class="form--input"
      bind:this={f}
      {name}
      id={name}
      {required}
      rows="3"
      {value}
      {...field.attributes}
      disabled={$disabled}
    />
  {:else if field.type === 'select'}
    <select
      {name}
      id={name}
      class="form--input form--select"
      bind:value
      disabled={$disabled}
      bind:this={f}
    >
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  {:else if field.type === 'radio'}
    {#each options as option}
      <div class="form--{field.type}">
        <label for="{name} - {option.value}" class="form--label">{option.label}</label>
        <input
          class="form--input"
          type={field.type}
          value={option.value}
          id="{name} - {option.value}"
          {name}
          bind:this={f}
          checked={value === option}
          {required}
          {...field.attributes}
          disabled={$disabled}
        />
      </div>
    {/each}
  {:else if field.type === 'checkbox'}
    <div class="form--{field.type}">
      <label for={name} class="form--label">{field.label}</label>
      <input
        class="form--input"
        type={field.type}
        id={name}
        {name}
        bind:this={f}
        checked={value}
        {required}
        {...field.attributes}
        disabled={$disabled}
      />
    </div>
  {:else}
    <input
      class="form--input"
      {name}
      id={name}
      bind:this={f}
      {required}
      type={field.type}
      {value}
      {...field.attributes}
      disabled={$disabled}
      on:click={isButton && field.action ? field.action : undefined}
    />
  {/if}

  <Message {field} {name} />
</div>
