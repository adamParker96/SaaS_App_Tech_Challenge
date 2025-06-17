const fetch = require('node-fetch');

async function sendSlackMessage(text) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: CHANNEL_ID,
      text: text,
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    console.error('Slack API Error:', data.error);
  } else {
    console.log('Message sent:', data.ts);
  }
}
module.exports = sendSlackMessage;
