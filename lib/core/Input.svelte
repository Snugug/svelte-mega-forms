<script>
  import { getContext, tick } from 'svelte';
  import { extractValues } from '../helpers/extractors';

  export let field;
  export let index = null;

  const name = index !== null ? `${field.name}[${index}]` : field.name;

  const { elements, values } = getContext('form');

  $: valueCount = extractValues(field, $values);

  const input = elements.fields[field.type] || elements.fields.default;

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
</script>

{#if !field.if || field.if($values)}
  {#if field.repeatable}
    <div class="form--repeatable form--group">
      {#each Array(valueCount.length) as _, i}
        <svelte:component this={input} {field} name={field.name + `[${i}]`} />
        <div class="form--repeatable-actions">
          {#if i > 0 || valueCount.length > 1}
            <button
              class="form--remove-repeatable form--repeatable-action"
              on:click|preventDefault={removeValue(i)}>-</button
            >
          {/if}
          {#if i === valueCount.length - 1}
            <button
              class="form--add-repeatable form--repeatable-action"
              on:click|preventDefault={addValue(i + 1)}>+</button
            >
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <svelte:component this={input} {field} {name} />
  {/if}
{/if}
