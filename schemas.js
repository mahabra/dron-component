var extend = require('extend'),
path = require('path'),
schemas = {
	'creating': {
		'name' : {
		    properties: {
		      name: {
		        pattern: /^[a-zA-Z\s\-]+$/,
		        message: 'Enter the name of component',
		        default: '',
		        required: true
		      },
		      description: {
		        message: 'Enter description',
		        default: "",
		   		required: true
		      }
		    }
		},
		"isabs": {
			properties: {
				org: {
					pattern: /^[a-zA-Z\s\-]+$/,
					message: "Organization",
					default: "abstudio",
					required: false
				}
			}
		},
		"tags": {
			properties:{
				tags: {
					message: 'Tags',
					type: 'array',
					required: true
				}
			}
		},
		'init': function() {
			var probablyName = process.cwd().split(path.sep).pop().replace(/[^a-zA-Z\s\-]*/ig, "");
			
			this.name.properties.name.default = probablyName;
		}
	}
}

module.exports = function(schemaName) {
	var schema = schemas[schemaName];
	schemas[schemaName].init.call(schema);
	return schema;
}