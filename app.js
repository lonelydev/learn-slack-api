const {App} = require('@slack/bolt');
require('dotenv').config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
});

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const webClient = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

// Find conversation ID using the conversations.list method
async function findConversation(name) {
    try {
      // Call the conversations.list method using the built-in WebClient
      const result = await app.client.conversations.list({
        // The token you used to initialize your app
        token: process.env.SLACK_BOT_TOKEN
      });
  
      for (const channel of result.channels) {
        if (channel.name === name) {
          var conversationId = channel.id;
  
          // Print result
          console.log("Found conversation ID: " + conversationId);
          return conversationId;
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  


async function postMessage(channelId, message){
  // Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
  const { WebClient, LogLevel } = require("@slack/web-api");

  // WebClient instantiates a client that can call API methods
  // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
  const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG
  });
  
  try {
    // Call the chat.postMessage method using the WebClient
    const result = await client.chat.postMessage({
      channel: channelId,
      text: message
    });
  
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }  
}

// read more on retrieving conversation history 
// https://api.slack.com/methods/conversations.history
async function fetchMessages(channelId, uptoTimeInEpoch, inclusive, limitTo){
    //fetch all messages from channel in the last 24 hours
    // WebClient instantiates a client that can call API methods
    // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
  try {
        // Call the conversations.history method using the built-in WebClient
        const result = await app.client.conversations.history({
            // The token you used to initialize your app
            token: process.env.SLACK_BOT_TOKEN,
            channel: channelId,
            // In a more realistic app, you may store ts data in a db
            latest: uptoTimeInEpoch,
            // Limit results
            inclusive: inclusive,
            limit: limitTo
          });
          return result.messages || [];
  }
  catch (error) {
    console.error(error);
  }  
}


// Your app can listen to events if you enable socket mode!
// https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events
// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Hey there <@${message.user}>! This is your test app speaking!`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "action_id": "button_click" // unique identifier for an action
          }
        }
      ],
      text: `Hey there <@${message.user}>!`
    });
  });  

app.action("button_click", async({body, ack, say}) => {
    await ack();
    await say(`<@${body.user.id}> clicked the button! Good stuff! Thanks for responding!`);
});


function getYesterday(){
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
}

function getTimeInPast(timeSinceInMilliSeconds){
    let today = new Date();
    let yesterday = new Date();
    yesterday.setTime(today.getTime() - timeSinceInMilliSeconds);
    return yesterday;
}

(async() => {
    // start app
    await app.start();

    console.log('⚡️ Bolt app is running!');
    var channelId = await findConversation("learn-slack-api");
    //await postMessage(channelId, "hello, I'm testing slack api");
    // Fetch message using a channel ID and message TS
    
    let yesterday = getTimeInPast(60*60*1000);
    let messagesSince = await fetchMessages(channelId, yesterday.getTime(), true, 100);
    console.log("retrieved " + messagesSince.length +  " messages: ");
    messagesSince.forEach(
            element => console.log(element)
          );
})();