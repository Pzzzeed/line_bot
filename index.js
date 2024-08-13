const line = require('@line/bot-sdk');
const express = require('express');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const app = express();

const lineConfig = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET_TOKEN,
};

const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log('event:', events);
    return events.length > 0
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send('OK');
  } catch (error) {
    console.log(error);

    res.status(500).end();
  }
});

const handleEvent = async (event) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  } else if (event.type === 'message') {
    if (event.message.text === 'location') {
      const text = {
        type: 'text',
        text: 'sent location',
      };
      // const location = {
      //   type: 'text',
      //   text: 'https://maps.app.goo.gl/srsToE8LRjZr7ggLA',
      // };
      const location = {
        type: 'location',
        title: 'Moonstar Convention Hall',
        address:
          '257 Soi Lat Phrao 80 Yaek 21, Wang Thonglang, Wang Thonglang, Bangkok 10310',
        latitude: 13.7765,
        longitude: 100.60099,
      };

      return client.replyMessage(event.replyToken, [text, location]);
    } else if (event.message.text === 'picture') {
      const text = {
        type: 'text',
        text: 'picture sent',
      };
      // const image = {
      //   type: 'image',
      //   originalContentUrl:
      //     'https://res.cloudinary.com/ddxogkdvm/image/upload/v1696998914/4178_uebhfd.png',
      //   previewImageUrl:
      //     'https://res.cloudinary.com/ddxogkdvm/image/upload/v1696998914/4178_uebhfd.png',
      // };
      return client.replyMessage(event.replyToken, [text]);
    } else if (event.message.text === 'schedule') {
      const text = {
        type: 'text',
        text: 'schedule sent',
      };
      return client.replyMessage(event.replyToken, [text]);
    } else if (event.message.text === 'QR') {
      const text = {
        type: 'text',
        text: 'QR sent',
      };
      return client.replyMessage(event.replyToken, [text]);
    } else {
      const text = {
        type: 'text',
        text: 'Reef Wow Wedding 💕',
      };
      return client.replyMessage(event.replyToken, [text]);
    }
  }
};

const port = process.env.port || 4000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
