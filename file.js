var fs = fs || require('fs');

var myFile = (function fileFactory (path) {

	function getFile (path, response) {
		var calls = [];

		var read_file = new Promise(function(resolve, reject) {
			path = __dirname + '/' + path;

			fs.readFile(path, function (err, data) {
				if (err) {
					// console.warn('Error reading file at ', path);
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		});

		var write_file = serveFile(read_file, response, path);

		return [read_file, write_file];
	}


	function fileExists(path) {
		/**
		   @todo
		 */
		return true;
	}


	function serveFile(load_promise, resp, path) {
		load_promise
			.then(function writeFile(data) {
				var ext = path.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/);

				if (typeof ext === 'object') {
					console.log(ext);
					ext = ext[0];
				}

				console.log(ext);

				return new Promise(function(resolve, reject) {
					// write header
					writeHeader(resp, ext);

					resp.write(data);

					resolve(true);
				});
			})
			.catch (function (err) {
				return Promise.reject(err);
			});
	}


	function writeHeader (response, extension) {
		var mime_type;

		if (extension.substring(0,1) == '.') {
			extension = extension.substring(1);
		}

		console.log('Writing Header: ', extension);


		switch (extension) {

			case '/':
			case '':
			case null:
				mime_type = 'text/html';
				break;

			case 'text':
				mime_type = 'text/plain';
				break;

			case 'css':
				mime_type = 'text/css';
				break;

			case 'ico':
				mime_type = 'image/x-icon';
				break;

			case 'htm':
			case 'html':
				mime_type = 'text/html';
				break;

			case 'js':
				mime_type = 'application/javascript';
				break;

			case 'jpeg':
			case 'jpg':
				mime_type = 'image/jpeg';
				break;

			case 'gif':
				mime_type = 'image/gif';
				break;

			case 'png':
				mime_type = 'image/png';
				break;

			default:
				mime_type = 'text/plain';
		}

		// Output our header.
		response.writeHead(200, {'Content-Type': mime_type});
	}

	return {
		get: getFile
	};
})();

module.exports = {
	get: myFile.get
};