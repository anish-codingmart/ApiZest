const request = require('request');
const { input } = require('./input.json');

function traverse(tree, parentData) {

	return new Promise(async (resolve, reject)=>{

		try {	

			const newData = await send(tree.url, tree.method, tree.queryData, parentData);

			console.log(JSON.stringify(newData, null, 4));

			if(newData.responseCode !== 200) {

				return;
			}

			parentData.push(newData);

			for(const node of tree.children) {

				await traverse(node, parentData);
			}

			parentData.pop();
		}
		catch(err) {

			console.log(err);
		}

		resolve();

	});
}

function send(url, method, queryData, parentData) {

	return new Promise((resolve, reject)=>{

		const body = createBody(queryData, parentData);

		if(queryData.type === 'query') {

			url += '?' + body;
		}
		else if(queryData.type === 'param') {

			url += '/' + body;
		}

		const startTime = new Date();

		request({
			url: url,
			method: method,
			body: body,
			headers: {'content-type' : 'application/x-www-form-urlencoded'},
		}, (err, response, body)=>{

			const responseTime = ((new Date() - startTime) / 1000 % 60) + ' s';

			if(err) {

				resolve({ url: url, error: err.toString(), responseTime: responseTime });
			}
			else {

				resolve({ url: url, responseCode: response.statusCode, responseTime: responseTime, body: body });
			}

		});

	});
}

function createBody(queryData, parentData) {

	if(queryData === '') {

		return '';
	}

	let body = '';
	const tokens = queryData.data.split('&');

	for(const token of tokens) {

		const key = token.split('=')[0];
		let value = token.split('=')[1];

		if(value.startsWith("{") && value.endsWith("}")) {

			const dataIndex = Number(value.substring(
			    value.indexOf("[") + 1, 
			    value.indexOf("]")
			));

			const dataKey = value.substring( value.indexOf('.') + 1, value.length - 1 );

			const jsonify = JSON.parse(parentData[dataIndex].body);

			value = jsonify[dataKey];
		}

		if(queryData.type === 'param') {

			body += value + '/';
		}
		else {

			body += key + '=' + value + '&';
		}
	}

	return body;
}

traverse(input, []);