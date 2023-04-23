var express = require('express')
var app = express()
const cors = require('cors');
app.use(cors())

const axios = require('axios')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


app.get('/', function (req, res) {
  res.json({res: 'Hello World!'})
})

app.post('/prompt', jsonParser, async (req, res) => {
  const completion = await openai.createCompletion({
    // "model": "text-davinci-003",
    "model": "gpt-3.5-turbo",
    "prompt": req.body.prompt,
    "max_tokens": 500,
    "temperature": 0.7
  });
  console.log(completion.data.choices[0].text);
  res.json({ data: completion.data.choices[0] })
})

app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
