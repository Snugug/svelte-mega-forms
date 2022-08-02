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
