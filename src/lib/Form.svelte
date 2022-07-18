<script context="module">
  import Label from './core/Label.svelte';
  import DefaultInput from './fields/Input.svelte';
  import Fieldset from './core/Fieldset.svelte';
  import { get } from 'svelte/store';

  export const FormRegister = {
    _register: {
      labels: {
        default: Label,
      },
      fields: {
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
      field(name, element) {
        FormRegister._register.fields[name] = element;
      },
      group(name, element) {
        FormRegister._register.groups[name] = element;
      },
    },
    messages: {
      required: 'This field is required',
      invalid: 'This field is invalid',
    },
  };
</script>

<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  import { extractFields, nameRegex } from './helpers/extractors';

  import Input from './core/Input.svelte';

  export let form = [];
  export let values = {};
  export let attributes = {};

  // Create value store to save values across the form
  function valueStore() {
    const { subscribe, set, update } = writable({});

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
    const { subscribe, update } = writable(Object.keys(fields));

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
        const valid = await validators[base](value, index);

        return update((state) => {
          state[field] = valid;
          return state;
        });
      },
    };
  }

  const fields = extractFields(form);
  const vs = valueStore();
  const validation = validationStore(fields, vs);

  vs.set(values);

  setContext('form', {
    fields,
    values: vs,
    disabled: false,
    submitting: false,
    validation,
    elements: FormRegister._register,
  });

  // Generic value setter for fields
  function setValues(e) {
    if (e?.target?.name) {
      vs.setField(e.target.name, e.target.value);
    }
  }

  // Generic validator for fields
  function validateField(e) {
    if (e?.target?.name) {
      validation.check(e.target.name, e.target.value);
    }
  }
</script>

<form {...attributes} on:input={setValues} on:change={validateField}>
  <h1>Hello World</h1>
  <Input field={fields.notes} />
  <button>Hello</button>
</form>
