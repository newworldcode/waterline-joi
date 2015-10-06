# Waterline Joi

[![Build Status](https://travis-ci.org/newworldcode/waterline-joi.svg)](https://travis-ci.org/newworldcode/waterline-joi)
[![Coverage Status](https://coveralls.io/repos/newworldcode/waterline-joi/badge.svg?branch=master&service=github)](https://coveralls.io/github/newworldcode/waterline-joi?branch=master)

`npm i --save waterline-joi`

Waterline Blueprint to Joi validation converter.

```js
// Get Waterline.
var Waterline = require('waterline')

// Get the function to convert schemas.
var waterline_to_joi = require("waterline-joi")

// Define your schema.
var schema = {
  attributes: {
    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    }
  }
}

// Create a Joi schema.
var joi_schema = waterline_to_joi(schema.attributes)

// Create the user
var User = Waterline.Collection.extend(schema)
```
