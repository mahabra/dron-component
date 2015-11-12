var fs = require('fs'),
prompt = require('prompt'),
schemas = require('./schemas.js'),
Creator = function(task) {
	/*
	Init dialog schema
	*/
	this.schema = schemas('creating');
	this.task = task;
	this.json = {
		"name": "",
		"repository": "http://github.com/",
		"description": "...",
		"version": "0.0.1",
		"keywords": [],
		"styles": "style.css",
		"template": "template.html",
		"dependencies": {
		},
		"scripts": ["index.js"],
		"styles": ["style.css"],
		"license": "MIT",
		"remotes": ["github"]
	};
	prompt.start();
	this.route('name');
};
Creator.prototype = {
	constructor: Creator,
	route: function(step) {
		
		prompt.get(this.schema[step], function (err, result) {
			if (err) {
				throw 'Error 21'
			} else {
				this.finish(step, result);
			}
		}.bind(this));
	},
	finish: function(step, result) {
		switch(step) {
			case 'name':
				this.json.name = result.name;
				this.json.description = result.description;
				this.route('isabs');
			break;
			case 'isabs':
				this.json.repo = result.org+"/"+this.json.name;
				this.route('tags');
			break;
			case 'tags':
				this.json.tags = result.tags;
				this.render();
			break;
		}
	},
	render: function() {
		try {
				var stringified = JSON.stringify(this.json, null, 2);
		} catch(e) {
			this.task.dron.warn('Bad object!');
			return;
		}

		fs.writeFile(this.task.componentFile, stringified, function(err) {
				if (err) {
					this.task.dron.warn('Error writing file');
				} else {
					this.task.dron.log('Successful creation component.json');
				}
		}.bind(this));

		// Create js
		fs.writeFile(this.task.indexjs, "define(function() {\n\n\n});", function(err) {
			if (err) {
				this.task.dron.warn('Error writing js file');
			} else {
				this.task.dron.log('Successful creation index.js');
			}
		}.bind(this));

		// Create css
		fs.writeFile(this.task.indexcss, this.json.name+"{\n\n\n}", function(err) {
			if (err) {
				this.task.dron.warn('Error writing css file');
			} else {
				this.task.dron.log('Successful creation index.css');
			}
		}.bind(this));

		// Create template
		fs.writeFile(this.task.templatefile, "", function(err) {
			if (err) {
				this.task.dron.warn('Error writing template file');
			} else {
				this.task.dron.log('Successful creation template.html');
			}
		}.bind(this));
	}
}

module.exports = function(dron) {
	dron.registerTask('component', function(dron) {
		this.dron = dron;
		this.componentFile = process.cwd()+'/component.json';
		this.indexjs = process.cwd()+'/index.js';
		this.indexcss = process.cwd()+'/index.css';
		this.templatefile = process.cwd()+'/template.html';
		this.process();
	}, {
		process: function() {

			fs.exists(this.componentFile, function(exists) {

				if (exists) {
					this.dron.warn('Component.json already exists');
				} else {
					new Creator(this);
				}
			}.bind(this));
		}
	})
}