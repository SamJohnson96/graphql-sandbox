var graphqlTag = require("graphql-tag")
var _ = require('lodash');


// Helper
function generateMutator(operation, model, body) {


	var input = generateInput(body);

	input = JSON.stringify(input);

	console.log(input);


	// We're simply building a string.

	// Mutator keyword and operation name we're performing
	var string = 'Mutator ' + operation + ' { \n';

	string += '\t' + operation + '(input:' + input + ') { \n';

	string += '\t\t' + model + '{ \n';

	// Mapping will go on here

	string += '\t\t' + '} \n';

	string += '\t' + '} \n';
	// End query
	string += '}';

	return string;

}


// Recursive method that will go through each json body object. camelCase everything
function generateInput(json_body) {

	return _.reduce(json_body, function(acc, value, key) {

		// CAMEL CASE ALL KEYS
		key = _.camelCase(key);

		// IF ARRAY , CALL GENERATE INPUT AGAIN
		if (_.isArray(value)) {
			acc[key] = generateInput(value);
		} else if (_.isPlainObject(value)) {
			acc[key] = generateInput(value)
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
		foo_bar: 'test'
	},
	test_array: [{
		text_value: 'foo_bar',
		foo_bar: 'foo_bar'
	}, {
		text_value: 'foo_bar',
		foo_bar: 'foo_bar'
	}]
}

// 1 - OPERATION NAME USED BY PIPELINER, 2 - THE MODEL THAT WILL BE EDITED 3 - BODY THAT USER HAS DEFINED
var query = generateMutator('addAccount', 'account', test_body);

console.log(query);
