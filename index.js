"use strict"

// Get some tools.
const Joi = require("joi")

/**
 * Return a new Date instance.
 * Used in the schema for default date/time/datetime values.
 * @return {Date} current date and time.
 */
/* istanbul ignore next : Untestable */
const get_new_date = () => new Date()

/**
 * Convert a Waterline blueprint into
 * a Joi schema for validation.
 * @param  {Object} blueprint to convert to Joi schema.
 * @param  {Boolean} wrap_joi_object, whether to wrap the output in Joi.object()
 * @return {Object} converted Waterline blueprint.
 */
function convert(blueprint, wrap_joi_object) {
  // Should we wrap the output schema in Joi.object()?
  const wrap = typeof wrap_joi_object === "undefined" ? true : wrap_joi_object

  // Where we'll push keys to.
  const ret = {}

  // These will be set in the loop below.
  /* eslint-disable */
  let type, value, property_key, out
  /* eslint-enable */

  // Loop over the keys and build a schema.
  for (property_key in blueprint) {
    // Create a base out object.
    out = Joi

    // Set the value to keep the below easier to read.
    value = blueprint[property_key]

    // If it's a function, exit.
    if (property_key === "toJSON" || value instanceof Function) {
      /* eslint-disable */
      continue
      /* eslint-enable */
    }

    // If it's an association, just check prescence.
    if (value.model || value.collection) {
      const base_types = Joi.alternatives().try(Joi.string(), Joi.number(), Joi.object().unknown(true))
      // Create an alternatives for varying types
      // of id or just an object (since we can't see into the future. Yet.)
      if (value.model)
        ret[property_key] = base_types
      else
        ret[property_key] = Joi.array().items(base_types)

      if (value.required)
        ret[property_key] = ret[property_key].required()
      else
        ret[property_key] = ret[property_key].optional().allow(null, "")

      /* eslint-disable */
      continue
      /* eslint-enable */
    }

    // Get the type from the blueprint or if it's
    // not an object and is just a type. Set it.
    type = value.type || value

    // Sort the type conversion out.
    switch (type) {
    case "object":
      out = out.object()
      break
    case "string":
    case "text":
    case "email":
      // Set the type.
      out = out.string()

      // Check if it's an enum and apply it.
      if (value.hasOwnProperty("enum")) {
        out = out.valid(value.enum)
      }

      // See if we have a size.
      if (value.hasOwnProperty("size")) {
        out = out.max(value.size)
      }

      // Is it alphanumeric only?
      if (value.alphanumeric) {
        out = out.alphanum()
      }

      // Is it an email address?
      if (type === "email" || value.email) {
        out = out.email()
      }

      // Is it a credit card type?
      if (value.creditcard) {
        out = out.creditCard()
      }

      // Check the case.
      if (value.lowercase) {
        out = out.lowercase()
      }

      if (value.uppercase) {
        out = out.uppercase()
      }

      // Is it also a regex?
      if (value.is || value.regex) {
        out = out.regex(value.is || value.regex)
      }

      // Is it an url.
      if (value.hasOwnProperty("url") || value.hasOwnProperty("urlish")) {
        out = out.uri()
      }

      // Is it a hex string?
      if (value.hexadecimal) {
        out = out.hex()
      }

      // Or a hex colour?
      if (value.hexColor) {
        out = out.min(3).max(6).hex()
      }

      break

    case "integer":
    case "float":
    case "int":
    case "bigint":
    case "serial":
      out = out.number()
      break

    case "date":
    case "time":
    case "datetime":
      out = out.date()

      if (value.hasOwnProperty("before")) {
        out = out.max(value.before)
      }

      if (value.hasOwnProperty("after")) {
        out = out.min(value.after)
      }

      if (value.hasOwnProperty("default")) {
        if (value.default === "NOW") {
          /* istanbul ignore next: Untestable */
          out = out.default(get_new_date, "Default Date Time")
        }
        else {
          out = out.default(value.default)
        }
      }
      break

    case "array":
      out = out.array()
      break

    case "json":
      out = out.object()
      break

    case "binary":
      out = out.binary()
      break
    case "boolean":
      out = out.boolean()
      break
    default:
      // Warn the dev.
      /* eslint-disable */
      console.log("LINT: '%s' not a recognised type. Setting to .any(), please resolve.", value.type || value)
      /* eslint-enable */

      // Set the type.
      out = out.any()

      // Don't do anything more with this value,
      // it doesn't have things like .min() or .default()
      /* eslint-disable */
      continue
      /* eslint-enable */
    } // </switch

    // Check for various length arguments.
    if (value.hasOwnProperty("min") || value.hasOwnProperty("minLength")) {
      out = out.min(value.hasOwnProperty("min") ? value.min : value.minLength)
    }

    if (value.hasOwnProperty("max") || value.hasOwnProperty("maxLength")) {
      out = out.max(value.hasOwnProperty("max") ? value.max : value.maxLength)
    }

    // Check for more `.valid()` cases.
    if (value.in && value.in.length > 0) {
      out = out.valid(value.in)
    }

    // Check for more `.invalid()` cases.
    if (value.notIn && value.notIn.length > 0) {
      out = out.invalid(value.notIn)
    }

    // Is it required?
    if (value.required) {
      out = out.required()
    }
    else {
      out = out.optional().allow(null, "")
    }

    // Check if the value has a default.
    if (value.hasOwnProperty("defaultsTo")) {
      out = out.default(value.defaultsTo, `Default ${property_key} value`).optional()
    }

    if (value.hasOwnProperty("metadata")) {
      Object.keys(value.metadata).forEach(key => {
        switch (key.toLowerCase()) {
        case "label":
          out.label(value.metadata.label)
          break
        case "notes":
        case "description":
          out.description(value.metadata.notes || value.metadata.description)
          break
        case "example":
          out.example(value.metadata.example)
        }
      })
    }

    // Add the property to the return value.
    ret[property_key] = out

  } // </for

  // Return the schema.
  return wrap ? Joi.object(ret) : ret
}

module.exports = convert
