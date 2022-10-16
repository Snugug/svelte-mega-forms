import { get } from 'svelte/store';

/**
 * Checks if the field is required
 * @param {Object} field - Field object
 * @param {Object} values - Values object
 * @param {String} name - Field name
 * @return {Boolean}
 */
export function isRequired(field, values, name) {
  if (field?.required) {
    if (typeof field?.required === 'function') {
      if (field.required(values, name) === true) return true;
    }

    if (typeof field?.if === 'function') {
      const fi = field.if(values, name);
      if (fi === true && field.required === true) return true;
    } else if (field.required === true) return true;
  }

  return undefined;
}

/**
 * Sets the default value of a field
 * @param {Object} field - Field object
 * @param {Object} values - Values object
 * @param {String} name - Field name
 */
export function setDefaultValue(field, values, name) {
  if ((get(values)[name] === '' || get(values)[name] === undefined) && field.value) {
    if (typeof field.value === 'function') {
      values.setField(name, field.value(get(values), name));
    } else {
      values.setField(name, field.value);
    }
  }
}

/**
 * Builds the options for a field
 * @param {Object} field - Field object
 * @param {Object} values - Values object
 * @param {String} name - Field name
 * @returns {Object[]} - Array of value/label objects
 */
export function fieldOptions(field, values, name) {
  let options = [];
  if (field.options) {
    if (typeof field.options === 'function') {
      options = field.options(values, name);
    } else {
      options = field.options;
    }
  }

  return options?.map((o) => {
    if (o?.label && o?.value) return o;
    if (o?.label) return { value: o.label, label: o.label };
    if (o?.value) return { value: o.value, label: o.value };
    return { value: o, label: o };
  });
}
