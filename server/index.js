const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = require('./secrets');

const app = express();

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.json());

webpush.setVapidDetails('mailto:yat.kwan@globalrelay.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
const subscriptions = {}; //TODO: Replace with proper data store

app.post('/subscribe', (req, res)=>{
  const subscription = req.body;
  subscriptions[subscription.endpoint] = subscription;
  
  res.status(201);
})

app.post('/unsubscribe', (req, res) => {
  subscriptions[subscription.endpoint] = undefined;

  res.status(201);
});

app.post('/broadcast', (req, res) => {
  const payload = JSON.stringify({title: 'PWA Subscribed', body: req.body.message});

  Object.values(subscriptions).forEach(async (subscription) => {
    if (subscription) {
      const response = await webpush.sendNotification(subscription, payload).catch(err=> console.error(err));
      console.log(response);
    }
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});