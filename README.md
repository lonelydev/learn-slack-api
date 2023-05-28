# Slack app using Bolt framework

Sign into a slack workspace or create a new one.
Then head over to api.slack.com
Click on the *create app* button.

Check out https://youtu.be/Rufh3MjJz9g 

Follow the tutorial instructions below:
https://api.slack.com/tutorials/tracks/scheduling-messages

An app lives in a workspace and is bound to it. You’ll generally build and test your changes against a development workspace.

Every application, is owned by a single workspace and is created by a user within that workspace. Once you create the app, you cannot change which workspace it belongs to.

At a minimum you are going to need at least two instances of your app. A production app and a development/sandbox version where you get to test your changes. The sandbox app is one per dev - so that the main slack workspace isn’t affected.
Sandbox workspace is something you can sign up for from slack’s website. however, that is an enterprise feature. For learning things, you can just use your dummy workspace.

Anyway, once you click create and choose the start from scratch option, you’ll be led to a page with displaying your appId, clientId and much more.

*Best practice*

When you create an app, add a collaborator so that the app doesn’t become inaccessible when you go on holiday or whatever - especially if your app settings have to be changed.

Now that you have created an app, go to the *OAuth and Permissions* link on the navigation side-bar and generate a *Bot Token* with `command` permissions, `write` and `write.public` permissions.

Use BoltJS to build slack apps using javascript and get started really quickly. https://api.slack.com/start/building/bolt-js

Following instructions on the website's tutorial, let's you mess with the application on glitch.com to practise development. It doesn’t host your app. You can pick an alternative hosting location later.

Using bolt framework for js might be the best way to start if you want to write the app in js and start developing with source control and things. https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events

That tutorial is a great way to start working on something concrete.

I’ve listened to events - enabling socket mode - this is not recommended for production apps.
Then responded to events, sent a button and responded to button click.
`action_id`, a property of a button accessory is a string! I didn’t see that coming!

https://slack.dev/bolt-js/tutorial/getting-started#next-steps



