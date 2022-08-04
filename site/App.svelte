<script>
  import Form, { FormRegister } from '../lib/Form.svelte';
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
      if(values) {
        return values.test.includes('!');
      },
      fields: [
        {
          label: 'Medication',
          type: 'select',
          name: 'medication',
          options: ['One', 'Two', 'Three'],
        },
        {
          label: 'Notes',
          // _label: 'fun',
          type: 'textarea',
          name: 'notes2',
        },
        {
          label: 'Amount',
          type: 'number',
          name: 'amount',
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
          value: 1,
          attributes: {
            placeholder: ' ',
            min: 0,
          },
        },
        {
          label: 'Interval',
          fields: [
            {
              label: 'Select a maintenance drone:',
              type: 'radio',
              name: 'drone5',
              options: ['Drone 1', 'Drone 2', 'Drone 3'],
            },
            {
              label: 'Select a maintenance drone:',
              type: 'checkbox',
              name: 'drone7',
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
      value: 'Hello',
      repeatable: true,
      validate(v, f, vs) {
        if (v.includes('!')) {
          return false;
        }
        return true;
      },
    },
    {
      label: 'Number',
      name: 'number',
      type: 'number',
      repeatable: true,
    },
    {
      label: 'Test',
      type: 'text',
      name: 'test',
    },
    {
      label: 'If test',
      type: 'text',
      name: 'test2',
      if(values) {
        return values.test.includes('!');
      },
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
    'amount[0]': 3,
    drone: 'Drone 2',
  };
</script>

<Form {attributes} {form} {values} />
