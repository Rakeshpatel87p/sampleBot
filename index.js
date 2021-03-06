// fb page access token: EAAZAAK1tertABAFkfZBSwvPfOVsZCPZCJKSBqZAc3IKDkpA7ZBA4FzjM2cc0k6RZCpKBf3jli9w4ll8XbmgcIaahWizitNGT8TAG6dz4qZCHIr0svpvXeWf4wqXZBhgVGDolQtkqPQKber07zr1HhZAWSMMde4oC5xwqtyZBTjzMMYvmQZDZD

'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
// Testing comment
app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// Wit quickstart
const Wit = null;
const interactive = null;
// Heroku doesn't like - cross-browser reference
// try {
//     // if running from repo
//     Wit = require('../').Wit;
//     interactive = require('../').interactive;
// } 
// catch (e) {
//     Wit = require('botSample').Wit;
//     interactive = require('node-wit').interactive;
// }

// Wit quckstart - Does this conflict?
// Heroku doesn't like
// const accessToken = (() => {
//     if (process.argv.length !== 3) {
//         console.log('usage: node examples/quickstart.js ZEGOKEEGU5FC7QML32OLBHCCS3PQHYUU');
//         process.exit(1);
//     }
//     return process.argv[2];
// })();

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	// console.log(messageing_events);
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAZAAK1tertABAFkfZBSwvPfOVsZCPZCJKSBqZAc3IKDkpA7ZBA4FzjM2cc0k6RZCpKBf3jli9w4ll8XbmgcIaahWizitNGT8TAG6dz4qZCHIr0svpvXeWf4wqXZBhgVGDolQtkqPQKber07zr1HhZAWSMMde4oC5xwqtyZBTjzMMYvmQZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
// From Wit quickstart - heroku doesn't like either
// const client = new Wit({ accessToken, actions });
// interactive(client);

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})