<script>
  import { getContext, tick } from 'svelte';
  import { extractValues, flattenValues } from '../helpers/extractors';
  export let field;
  export let index = null;

  const { elements, values } = getContext('form');

  const group = elements.groups[field._group] || elements.groups.default;

  const fields = Object.keys(flattenValues(field)).map((f) => f.replace(/\[\d+\]$/, ''));

  $: valueCount = fields.map((f) => extractValues({ name: f }, $values));

  function addValue(i) {
    return function adding() {
      let newValues = {};
      for (const field of fields) {
        newValues[`${field}[${i}]`] = '';
      }
      values.batchSetFields(newValues);
    };
  }

  function removeValue(i) {
    return async function removing() {
      let current = structuredClone(valueCount);
      let newValues = {};
      for (let j = 0; j < current.length; j++) {
        current[j].splice(i, 1);
        const f = fields[j];
        for (let k = 0; k < current[j].length; k++) {
          newValues[`${f}[${k}]`] = current[j][k];
        }

        values.removeField(`${f}[${current[j].length}]`);
      }
      await tick();
      values.batchSetFields(newValues);
      await tick();
    };
  }
</script>

{#if field.repeatable}
  <div class="form--repeatable form--group">
    {#each Array(valueCount[0].length) as _, i}
      <svelte:component this={group} {field} index={i} />
      <div class="form--repeatable-actions">
        {#if i > 0 || valueCount[0].length > 1}
          <button
            class="form--remove-repeatable form--repeatable-action"
            on:click|preventDefault={removeValue(i)}>-</button
          >
        {/if}
        {#if i === valueCount[0].length - 1}
          <button
            class="form--add-repeatable form--repeatable-action"
            on:click|preventDefault={addValue(i + 1)}>+</button
          >
        {/if}
      </div>
    {/each}
    <!-- <svelte:component this={group} {field} />
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
    </div> -->
  </div>
{:else}
  <svelte:component this={group} {field} {index} />
{/if}
