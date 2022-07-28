<script>
  import { getContext, tick } from 'svelte';
  import { extractValues } from '../helpers/extractors';

  export let field;
  export let index = null;

  const name = index !== null ? `${field.name}[${index}]` : field.name;

  const { elements, values, repeatables } = getContext('form');

  $: valueCount = extractValues(field, $values);

  const input = elements.inputs[field.type] || elements.inputs.default;

  function addValue(i) {
    return function adding() {
      values.setField(field.name + `[${i}]`, '');
    };
  }

  function removeValue(i) {
    return async function removing() {
      let current = structuredClone(valueCount);
      current.splice(i, 1);
      let newValues = {};
      for (let i = 0; i < current.length; i++) {
        newValues[field.name + `[${i}]`] = current[i];
      }
      values.removeField(field.name + `[${current.length}]`);
      await tick();
      values.batchSetFields(newValues);
    };
  }

  if (!field.fields) {
    if (!field.attributes) {
      field.attributes = {};
    }

    if (!field.attributes['data-touched']) {
      field.attributes['data-touched'] = false;
    }
  }
</script>

{#if field.repeatable}
  <div class="form--repeatable form--group">
    {#each Array(valueCount.length) as _, i}
      {#if !field.if || field.if($values, field.name + `[${i}]`)}
        <svelte:component this={input} {field} name={field.name + `[${i}]`} />
        <div class="form--repeatable-actions">
          {#if i > 0 || valueCount.length > 1}
            <button
              class="form--remove-repeatable form--repeatable-action"
              on:click|preventDefault={removeValue(i)}
              aria-label={repeatables.remove.label}
              >{#if repeatables.remove.html}{@html repeatables.remove.content}{:else}{repeatables
                  .remove.content}{/if}</button
            >
          {/if}
          {#if i === valueCount.length - 1}
            <button
              class="form--add-repeatable form--repeatable-action"
              on:click|preventDefault={addValue(i + 1)}
              aria-label={repeatables.add.label}
              >{#if repeatables.add.html}{@html repeatables.add.content}{:else}{repeatables.add
                  .content}{/if}</button
            >
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{:else if !field.if || field.if($values, name)}
  <svelte:component this={input} {field} {name} />
{/if}
