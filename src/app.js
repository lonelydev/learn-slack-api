import { sayHello } from './main';
import {App} from "@slack/bolt";
import * as dotenv from "dotenv";
import {WebClient, LogLevel} from "@slack/web-api";

console.log(sayHello("Typescript"));

dotenv.config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: process.env.PORT || 3000
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
            //latest: uptoTimeInEpoch,
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

async function fetchMessagesWithReactionSince(reactionName, since, channelId, limitTo){
  let messagesSince = await fetchMessages(channelId, since, true, limitTo || 100);
  let messagesWithReaction = [];
  messagesWithReaction = messagesSince.filter((message) => {
    return message.reactions && message.reactions
    .some((reaction) => reaction.name === reactionName)
  });
  return messagesWithReaction;
}

async function createWeeklyStatsMessage(messages, channelId){
let message = [
  {
    "type": "header",
    "text": {
      "type": "plain_text",
      "text": ":calendar: Weekly Support Highlights :traffic_light:",
      "emoji": true
    }
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:sos: Help Troubleshoot*"
      },
      {
        "type": "mrkdwn",
        "text": "*10*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:question: How to*"
      },
      {
        "type": "mrkdwn",
        "text": "*5*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:merge: Pull request*"
      },
      {
        "type": "mrkdwn",
        "text": "*19*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:secret: Credential Request*"
      },
      {
        "type": "mrkdwn",
        "text": "*1*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:i_heart_admin: Admin request*"
      },
      {
        "type": "mrkdwn",
        "text": "*1*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:bug: Bug*"
      },
      {
        "type": "mrkdwn",
        "text": "*0*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:new: New Feature*"
      },
      {
        "type": "mrkdwn",
        "text": "*1*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:lock: Security Compliance*"
      },
      {
        "type": "mrkdwn",
        "text": "*1*"
      }
    ]
  },
  {
    "type": "section",
    "fields": [
      {
        "type": "mrkdwn",
        "text": "*:info: Info/announcement*"
      },
      {
        "type": "mrkdwn",
        "text": "*1*"
      }
    ]
  }
];
  return message;
}

(async() => {
    // start app
    await app.start();

    console.log('⚡️ Bolt app is running!');
    var channelId = await findConversation("team-support");
    // Fetch message using a channel ID and message TS
    let yesterday = getTimeInPast(24*7*60*60*1000);
    let messagesSinceTimeWithQuestionReaction = await fetchMessagesWithReactionSince('question', yesterday.getTime(), channelId);

    console.log("retrieved " + messagesSinceTimeWithQuestionReaction.length +  " messages with question reaction: ");
    messagesSinceTimeWithQuestionReaction.forEach(
            element => console.log(element)
          );

    let messagesSinceTimeWithWarningReaction = await fetchMessagesWithReactionSince('warning', yesterday.getTime(), channelId);
    console.log("retrieved " + messagesSinceTimeWithWarningReaction.length +  " messages with warning reaction ");
    messagesSinceTimeWithWarningReaction.forEach(
            element => console.log(element)
          );
    let summaryMessageToPost = await createWeeklyStatsMessage(messagesSinceTimeWithQuestionReaction, channelId);
    console.log(summaryMessageToPost);
    console.log(JSON.stringify(summaryMessageToPost));
    try {
      await app.client.chat.postMessage({
        channel: channelId,
        text: "summary of statistics!",
        blocks: JSON.stringify(summaryMessageToPost)
      });
    } catch(error){
      console.error(error);
    }
})();