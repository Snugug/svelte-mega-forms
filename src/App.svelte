<script>
  import Form, { FormRegister } from './lib/Form.svelte';
  import FunLabel from './tests/FunLabel.svelte';

  FormRegister.set.label('fun', FunLabel);

  // formRegister.labels.foo = 'Foo';

  let attributes = {
    method: 'POST',
    action: 'https://google.com',
  };

  let form = [
    {
      label: 'Dosage',
      repeatable: true,
      fields: [
        {
          label: 'Medication',
          type: 'select',
          name: 'medication',
          options: ['One', 'Two', 'Three'],
        },
        {
          label: 'Amount',
          type: 'number',
          name: 'amount',
          placeholder: ' ',
          required: true,
          // if(values) {
          //   const { medication } = values;
          //   let [amount, units] = medication.replace(/-/g, ' ').replace(/‎,.*/, '').split(/‎\s‎/);
          //   amount = amount.replace(/‎/, '');

          //   if (amount === '0') {
          //     this.units = units;
          //     return true;
          //   }

          //   return false;
          // },
          attributes: {
            min: 0,
            value: 1,
          },
        },
        {
          label: 'Interval',
          fields: [
            {
              label: 'Interval',
              type: 'number',
              name: 'interval',
              placeholder: ' ',
              required: true,
              attributes: {
                min: 0,
                value: 1,
              },
            },
            {
              label: 'Units',
              type: 'select',
              name: 'units',
              options: ['Days', 'Weeks', 'Months', 'Years'],
              required: true,
            },
          ],
        },
      ],
    },
    {
      label: 'Notes',
      // _label: 'fun',
      type: 'textarea',
      name: 'notes',
      repeatable: true,
      validate(v, f, vs) {
        if (v.includes('!')) {
          return false;
        }
        return true;
      },
    },
    {
      label: 'Test',
      type: 'text',
      name: 'test',
    },
    {
      label: 'Submit!',
      type: 'submit',
      name: 'submit',
      value: 'Subm',
    },
    {
      label: 'Select a maintenance drone:',
      type: 'radio',
      name: 'drone',
      options: ['Drone 1', 'Drone 2', 'Drone 3'],
    },
    {
      label: 'Select a maintenance drone:',
      type: 'checkbox',
      name: 'drone2',
    },
  ];

  let values = {
    'notes[0]': 'This is a test note',
    drone: 'Drone 1',
  };
</script>

<Form {attributes} {form} {values} />
