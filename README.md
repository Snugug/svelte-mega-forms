# Svelte Mega Forms

Generative forms for Svelte.

## Installation & Usage

```bash
npm i svelte-mega-forms
```

```svelte
<script>
  import Form from 'svelte-mega-forms';

  // Form structure
  const form = [ /* ... */ ];

  // Attributes for the generated form
  const attributes = {
    method: 'POST',
    action: '/contact',
  };

  // Default values for the form
  const values = {
    'name': 'Cow McMoo',
    'message[0]': 'This is a test note',
  };

  // Function to call when the form is submitted after all fields have been validated. Can be async
  const submit = (values, form) => {};
</script>

<Form {form} {attributes} {values} {submit} />
```

## Creating a Form

Fields in a form are defined by an object with the following values:

- `label` - Form label. Either this, `attributes['aria-label']`, or `attributes['aria-labelledby']`, is **required** for each field.
- `name` - The unique name to identify the field. This is **required**.
- `type` - The type of field to display. This is **required** to display a field, but will be ignored if `fields` is present.
- `value` - The optional default value for the field
- `required` - Whether the field is required, either `true` or `false`
- `attributes` - Key/value pair of attributes to add directly to an input, good for adding things like `placeholder`, `min`, and `max`
- `fields` - If you want to add a group to your form, `fields` will take an array of field objects (including other groups!) and render them out.
- `validate` - A function with the signature of `(value, field, values)` that should return `true` if the field is valid, or a string or `false` if invalid. Can be async.
- `repeatable` - Either `true` or `false`, and can be used for either a group or an individual field. Makes either the field or group repeatable, appending an index to the field's (or contained fields') name (i.e. `name[0]`). Repeating items can't be nested.
- `if` - A function with the signature of `(values)` that returns either `true` or `false`. Will determine if the field or group should be displayed.
- `options` - Either an array of strings, or an array of `{label: '', value: ''}` objects for fields that have multiple options, for instance selects or radio groups.
- `_label` - Alternate label component to use. See [form register](#form-register)
- `_group` - Alternate group component to use. See [form register](#form-register)

## Form Register

You can register additional components to be used in the form, as well as default validation messages. To do so, import the `FormRegister` from the default component:

```svelte
<script>
  import Form, {FormRegister} from 'svelte-mega-forms';
  import CustomLabel from './lib/CustomLabel.svelte';
  import CustomInput from './lib/CustomInput.svelte';

  FormRegister.set.label('custom-label', FunLabel);
  FormRegister.set.input('custom-input', CustomInput);

  FormRegister.messages.invalid = 'Oops! Try again!';

  const form = [
    {
      label: 'Hello',
      _label: 'custom-label',
      type: 'custom-input',
      name: 'all-custom-field'
    }
  ]
</script>

<Form {form} />
```

To register a label, field, or group, use `FormRegister.set[label/field/group]` and pass in a name to identify the custom item and then the Svelte component to use. You can override the default component by using `'default'` for the component's name.

For messages, you can set them directly; the two that are available are `FormRegister.messages.required` and `FormRegister.messages.invalid`.

### Maskable input

Svelte Mega Form comes with an optional custom form, Masked Input, that uses [imask](https://www.npmjs.com/package/@imask/svelte) to provide a masked input field. It also exposes an additional field property, `mask`, for setting the field mask. To use it, you can import it and register like other custom fields:

```svelte
<script>
  import Form, {FormRegister} from 'svelte-mega-forms';
  import MaskedInput from 'svelte-mega-forms/fields/MaskedInput.svelte';

  FormRegister.set.input('masked', MaskedInput);

  const form = [
    {
      label: 'Masked Input',
      type: 'masked',
      name: 'duration',
      mask: {
        mask: '00:00:00',
        lazy: false,
      },
    }
  ]
</script>
```

### Custom labels, fields, and groups

When creating a custom field, label, or group, take a look at the existing ones for inspiration. A few key things to keep in mind are:

- **Label** - Should export `field` and `name` properties, which will map to the field definition and the name the field should use.
- **Group** - Should export `field` and `index` properties, which will map to the field definition and the current index, if it's being repeated. They should also import `svelte-mega-forms/Group.svelte` and `svelte-mega-forms/Input.svelte` and use those meta-components to render contained groups and inputs. `lib/fields/Fieldset.svelte` is the default group.
- **Inputs** - Should export `field` and `name` properties, which will map to the field definition and the name the field should use. They should also import `svelte-mega-forms/Label.svelte` and `svelte-mega-forms/Message.svelte` to render the input's label, and message to optionally render validation error messages. The input's value should also be bound to the [form context's](#form-context) `values` store based on the input's name. Check out the default input implementation in `lib/fields/Input.svelte` or the implementation in `lib/fields/MaskedInput.svelte`. Inputs should also be disabled when the form context's `disabled` store is true.

### Form context

Custom labels, fields, and groups also have access to the `form` [context](https://svelte.dev/tutorial/context-api) with the following properties:

- `fields` - Definition for each individual field in the form
- `values` - A Svelte store of all values of all inputs in the form. You can set the value of a field using `values.setField(name, value)`, remove a field using `values.removeField(name)`, and set multiple fields using `values.batchSetFields(values)` (with an object of field names/values).
- `disabled` - A boolean Svelte store denoting whether fields should be disabled
- `submitting` - A boolean Svelte store denoting whether the form is being submitted
- `validation` - A Svelte store for checking validation. You can use `validation.check(name, value)` to check the value of an individual field, or `validation.checkAll(values)` (with an object of field names/values) to check all the values for all passed in fields. Validations are async.
- `elements` - Registered components
