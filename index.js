var graphqlTag = require("graphql-tag")
var _ = require('lodash');


// Helper
function generateMutator(operation, model, body) {

	var input = generateInput(body);

	console.log(JSON.stringify(input, null, 2));

	input = JSON.stringify(input);

	// We're simply building a string.

	// Mutator keyword and operation name we're performing
	var string = 'mutation ' + operation + '{';

	string += operation + '(input:' + input + '){';

	string += '' + model + '{';

	// Mapping will go on here

	string += '}';

	string +=  '}';

	// End query
	string += '}';

	return string;

}


// Recursive method that will go through each json body object. camelCase everything
function generateInput (json_body) {

	return _.reduce(json_body, function (acc, value, key) {

		// CAMEL CASE ALL KEYS
		key = _.camelCase(key);

		// IF ARRAY , CALL GENERATE INPUT AGAIN
		if (_.isArray(value)) {
			acc[key] = generateInput(value);
		} else if (_.isPlainObject(value)) {
			acc[key] = generateInput(value);
		} else {
			acc[key] = value;
		}

		return acc;

	}, {});

}

// Test input from workflow
var test_body = {
	first_name: 'foo_bar',
	test_body: {
		another_test: 'yo',
		foo_bar: {
			foo_boo: 'hello',
			foo_boo_two: 'whatsup'
		}
	},
	test_array: [{
		text_value: 'foo_bar',
		foo_bar: 'foo_bar'
	}, {
		text_value: 'foo_bar',
		foo_bar: 'foo_bar'
	}]
};

// 1 - OPERATION NAME USED BY PIPELINER, 2 - THE MODEL THAT WILL BE EDITED 3 - BODY THAT USER HAS DEFINED
var query = generateMutator('addAccount', 'account', test_body);

console.log(query);
