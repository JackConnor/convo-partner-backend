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
  try {
    const completion = await openai.createChatCompletion({
      // "model": "text-davinci-003",
      "model": "gpt-3.5-turbo",
      // "prompt": req.body.prompt,
      "messages": [
        { role: 'user', content: req.body.prompt}
      ],
      "max_tokens": 300,
      "temperature": 0.7
    });
    const completionTranslation = await openai.createChatCompletion({
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: 'user', content: `Please translate the following to spanish text to English: ${completion.data.choices[0].message.content}` }
      ],
      "max_tokens": 200,
      "temperature": 0.7
    });
    const completionCorrection = await openai.createChatCompletion({
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: 'user', content: `Please tell me one single grammatical corrections needed in this spanish text and quickly explain why it's grammatically wrong, in 30 words or less, and in the voice of a funny nice school teacher: ${req.body.originalText}` }
      ],
      "max_tokens": 200,
      "temperature": 0.7
    });
    // res.json({ data: completion })
    res.json({
      data: completion.data.choices[0].message.content,
      translation: completionTranslation.data.choices[0].message.content,
      correction: completionCorrection.data.choices[0].message.content,
    })
  } catch(err) {
    console.log(err)
    console.log(err.response)
    console.log('err.data')
    console.log('err.data')
    console.log('err.data')
    // res.json(err)
    throw new Error(err)
  }
})

app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
