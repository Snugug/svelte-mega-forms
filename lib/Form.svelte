<script context="module">
  import Label from './core/Label.svelte';
  import DefaultInput from './fields/Input.svelte';
  import Fieldset from './fields/Fieldset.svelte';
  import { get } from 'svelte/store';

  export const FormRegister = {
    _register: {
      labels: {
        default: Label,
      },
      inputs: {
        default: DefaultInput,
      },
      groups: {
        default: Fieldset,
      },
    },
    set: {
      label(name, element) {
        FormRegister._register.labels[name] = element;
      },
      input(name, element) {
        FormRegister._register.inputs[name] = element;
      },
      group(name, element) {
        FormRegister._register.groups[name] = element;
      },
    },
    messages: {
      required: 'This field is required',
      invalid: 'This field is invalid',
    },
    repeatables: {
      add: {
        label: 'Add item',
        content: '+',
        html: false,
      },
      remove: {
        label: 'Remove item',
        content: '-',
        html: false,
      },
    },
  };
</script>

<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { extractFields, nameRegex, buildDefaultValues } from './helpers/extractors';

  import Input from './core/Input.svelte';
  import Group from './core/Group.svelte';

  export let form = [];
  export let values = {};
  export let attributes = {};
  export let submit = (values, form) => {};
  export let disabled = false;

  // Create value store to save values across the form
  function valueStore(form) {
    const { subscribe, set, update } = writable(buildDefaultValues(form));

    return {
      subscribe,
      set,
      setField: (field, value) =>
        update((state) => {
          state[field] = value;
          return state;
        }),
      removeField: (field) =>
        update((state) => {
          delete state[field];
          return state;
        }),
      batchSetFields: (values) =>
        update((state) => {
          Object.assign(state, values);
          return state;
        }),
    };
  }

  // Creates a validation store for form fields
  function validationStore(fields, values) {
    const { subscribe, update } = writable(
      Object.keys(fields).reduce((acc, field) => {
        acc[field] = false;
        return acc;
      }, {}),
    );

    const validators = {};

    for (const [key, f] of Object.entries(fields)) {
      validators[key] = async (value, i) => {
        if (f.required && !value) {
          return FormRegister.messages.required;
        }
        if (f.validate) {
          const valid = await f.validate(value, f, i, get(values));
          if (typeof valid === 'string' || valid === false) {
            return valid || FormRegister.messages.invalid;
          }
        }

        return true;
      };
    }

    return {
      subscribe,
      check: async (field, value) => {
        const base = field.replace(/\[\d+\]$/, '');
        const index = nameRegex({ name: base }).exec(field)[2];

        let valid;

        if (Object.keys(validators).includes(base)) {
          valid = await validators[base](value, index);
        } else {
          valid = true;
        }

        return update((state) => {
          state[field] = valid;
          return state;
        });
      },
      checkAll: async (all) => {
        const toCheck = all
          .filter(({ name }) => {
            const base = name.replace(/\[\d+\]$/, '');
            if (Object.keys(validators).includes(base)) {
              return true;
            }
            return false;
          })
          .map(async ({ name, value }) => {
            const base = name.replace(/\[\d+\]$/, '');
            const index = nameRegex({ name: base }).exec(name)[2];
            return {
              name,
              valid: await validators[base](value, index),
            };
          });

        const valid = await (
          await Promise.all(toCheck)
        ).reduce((acc, { name, valid }) => {
          acc[name] = valid;
          return acc;
        }, {});

        return update((state) => {
          Object.assign(state, valid);
          return state;
        });
      },
    };
  }

  const fields = extractFields(form);
  const vs = valueStore(form);
  const validation = validationStore(fields, vs);
  const dis = writable(false);
  const submitting = writable(false);

  // Set values when they change
  $: {
    vs.batchSetFields(values);
  }

  setContext('form', {
    fields,
    values: vs,
    disabled: dis,
    submitting,
    validation,
    elements: FormRegister._register,
    repeatables: FormRegister.repeatables,
  });

  // Set disabled state when stuff changes
  $: {
    dis.set(disabled);
  }

  // Generic value setter for fields
  function setValues(e) {
    if (e?.target?.name) {
      if (e.target.type === 'checkbox') {
        vs.setField(e.target.name, e.target.checked);
      } else {
        vs.setField(e.target.name, e.target.value);
      }
    }

    if (e?.target?.dataset?.touched && e.target.dataset.touched === 'false') {
      e.target.dataset.touched = 'true';
    }
  }

  // Generic validator for fields
  function validateField(e) {
    if (e?.target?.name) {
      validation.check(e.target.name, e.target.value);
    }
  }

  // Handle submit event
  async function handleSubmit(e) {
    dis.set(true);
    submitting.set(true);

    const allFields = [...e.target.querySelectorAll('[name]')].map((f) => ({
      name: f.name,
      value: f.value,
    }));
    await validation.checkAll(allFields);
    const valid = Object.values($validation).every((v) => typeof v !== 'string');

    if (valid) {
      await submit($vs, e.target);
    }

    dis.set(false);
    submitting.set(false);
  }
</script>

<form
  class="form"
  {...attributes}
  on:input={setValues}
  on:change={validateField}
  on:submit|preventDefault={handleSubmit}
>
  {#each form as f}
    {#if f.fields}
      <Group field={f} />
    {:else}
      <Input field={f} />
    {/if}
  {/each}
</form>
