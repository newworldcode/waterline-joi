"use strict"

function convert(blueprint) {
  // Get the Joi library.
  var Joi = require("joi")

  // Where we'll push keys to.
  var ret = {}

  // These will be set in the loop below.
  /* eslint-disable */
  var type, value, property_key, out
  /* eslint-enable */

  // Loop over the keys and build a schema.
  for (property_key in blueprint) {
    // Create a base out object.
    out = Joi

    // Set the value to keep the below easier to read.
    value = blueprint[property_key]

    // If it's an association, don't do anything just continue.
    if (value.model) {
      continue
    }

    // Get the type from the blueprint or if it's
    // not an object and is just a type. Set it.
    type = value.type || value

    // Sort the type conversion out.
    switch (type) {
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
          out = out.default(function() { return new Date() }, "Default Date Time")
        }
        else {
          out = out.default(value.default)
        }
      }
      break

    case "binary":
      out = out.binary()
      break
    case "boolean":
      out = out.boolean()
      break
    default:
      // Warn the dev.
      console.warn("'%s' not recognised. Not good, setting to .any()", value.type)

      // Set the type.
      out = out.any()

      // Don't do anything more with this value,
      // it doesn't have things like .min() or .default()
      continue
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

    // Check if the value has a default.
    if (value.hasOwnProperty("defaultsTo")) {
      out = out.default(value.defaultsTo, "Default Joi value").optional()
    }

    // Add the property to the return value.
    ret[property_key] = out

  } // </for

  // Return the schema.
  return Joi.object().keys(ret)
}

module.exports = convert
