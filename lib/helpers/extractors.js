export function extractFields(form) {
  // Extract fields from form
  const fields = form
    .map((f) => flattenField(f))
    .flat()
    .reduce((acc, cur) => {
      for (const [key, value] of Object.entries(cur)) {
        if (!acc[key]) {
          acc[key] = value;
        } else {
          // Validate there are no duplicate field names
          throw new Error(`Field '${key}' already exists\n` + JSON.stringify(value));
        }
      }
      return acc;
    }, {});

  // Validate fields have a label
  for (const [key, value] of Object.entries(fields)) {
    const isButton = value.type === 'button' || value.type === 'submit';
    const hasLabel =
      value.label ||
      (isButton && value.value) ||
      (value.attributes && value.attributes['aria-label']) ||
      (value.attributes && value.attributes['aria-labelledby']);

    if (!hasLabel) {
      throw new Error(`Field '${key}' has no label\n` + JSON.stringify(value));
    }
  }

  return fields;
}

export function flattenField(field, holder = {}) {
  holder = typeof holder === 'object' ? holder : {};
  let suffix = '';

  if (field.fields) {
    for (const subField of field.fields) {
      flattenField(subField, holder);
    }
  } else {
    // Validate there are no duplicate field names
    if (!field.name) {
      throw new Error('Fields must have a name\n' + JSON.stringify(field));
    }
    if (
      Object.keys(holder).includes(field.name) ||
      Object.keys(holder).includes(field.name + suffix)
    ) {
      throw new Error(`Field '${field.name}' already exists\n` + JSON.stringify(field));
    }

    holder[field.name + suffix] = field;
  }

  return holder;
}

export function buildDefaultValues(form) {
  const values = [];
  for (const field of form) {
    values.push(flattenValues(field));
  }

  return values.flat().reduce((acc, cur) => {
    for (const [key, value] of Object.entries(cur)) {
      if (!acc[key]) {
        acc[key] = value;
      } else {
        // Validate there are no duplicate field names
        throw new Error(`Field '${key}' already exists\n` + JSON.stringify(value));
      }
    }
    return acc;
  }, {});
}

export function flattenValues(field, repeated = false, holder = {}) {
  if (field.repeatable && repeated) {
    throw new Error(`Repeatable fields can't be nested`);
  }

  // If the field is repeatable and not a group, add it to the holder
  if ((field.repeatable && !field.fields) || (repeated && !field.fields)) {
    holder[field.name + '[0]'] = '';
    // If the field is a group and it's repeatable, loop through the fields
  } else if (field.repeatable && field.fields) {
    for (let i = 0; i < field.fields.length; i++) {
      flattenValues(field.fields[i], true, holder);
    }
    // If the field is a group and not repeatable, loop through the fields
  } else if (field.fields) {
    for (let i = 0; i < field.fields.length; i++) {
      flattenValues(field.fields[i], true, holder);
    }
    // If the field is not repeatable, add it to the holder
  } else {
    holder[field.name] = '';
  }

  return holder;
}

export function extractValues(field, values) {
  const rxp = nameRegex(field);

  return Object.entries(values)
    .filter(([key]) => rxp.test(key))
    .sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    })
    .map(([key, value]) => value);
}

export function nameRegex(field) {
  return new RegExp(`^${field.name}(\\[(\\d+)\\])?$`);
}
