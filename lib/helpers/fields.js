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
