"use strict"

// Get the testing library.
var tape = require("tape")

// Get the library.
var convert_waterline_joi = require("../index")

// Create a pretty inclusive blueprint attributes to test.
var blueprint_attributes = {
  basic_string: "string",
  basic_int: "integer",
  basic_float: "float",
  basic_date: "date",
  basic_binary: "binary",

  basic_random: "evil",

  enum_string: {
    type: "string",
    enum: ["test1", "test2"]
  },

  size_string: {
    type: "string",
    size: 1
  },

  alphanumeric_string: {
    type: "string",
    alphanumeric: true
  },

  email_string: {
    type: "string",
    email: true
  },

  creditcard_string: {
    type: "string",
    creditcard: true
  },

  lowercase_string: {
    type: "string",
    lowercase: true
  },

  uppercase_string: {
    type: "string",
    uppercase: true
  },

  is_string: {
    type: "string",
    is: /[a-zA-Z0-9]/
  },

  regex_string: {
    type: "string",
    regex: /[a-zA-Z0-9]/
  },

  url_string: {
    type: "string",
    url: true
  },

  urlish_string: {
    type: "string",
    urlish: true
  },

  hexadecimal_string: {
    type: "string",
    hexadecimal: true
  },

  hexcolour_string: {
    type: "string",
    hexColor: true
  },

  date_before: {
    type: "date",
    before: "01/01/2970"
  },

  date_after: {
    type: "date",
    after: "01/01/1970"
  },

  date_default_now: {
    type: "date",
    default: "NOW"
  },

  date_default: {
    type: "date",
    default: new Date()
  },

  string_min: {
    type: "string",
    min: 1
  },

  string_minLength: {
    type: "string",
    minLength: 1
  },

  string_max: {
    type: "string",
    max: 1
  },

  string_maxLength: {
    type: "string",
    maxLength: 1
  },

  valid_in_string: {
    type: "string",
    in: ["test1", "test2"]
  },

  valid_not_in_string: {
    type: "string",
    notIn: ["test1", "test2"]
  },

  defaults_to_string: {
    type: "string",
    defaultsTo: "test3"
  },

  required_string: {
    type: "string",
    required: true
  },

  association: {
    model: "test"
  }
}

tape("Convert object.", function(test) {
  // Check the obvious.
  test.doesNotThrow(function() {
    convert_waterline_joi(blueprint_attributes)
  }, "Converting does not throw an error")

  test.end()
})
