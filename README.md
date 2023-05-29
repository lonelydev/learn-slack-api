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

## Convert to a Typescript project

Follow instructions from [TypescriptLang - Migrating from Javascript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)

1. `src` folder created and moved `app.js` to it
2. `tsconfig.json` created with barebones config
3. Specified to include all files in `src` directory to be compiled
4. Allow JS files to be included too - get it running first, then change things later
5. Create all compiled output into `outDir`
6. Translate newer constructs into older version of JS - ECMAScript 5 using `target`

### Choosing a build tool to help with tasks

I could use Gulp or Webpack and I remember Webpack being a massively powerful module bundler which evolved into a `can-do-it-all` thing.
So I decided to keep it simple and stick to Gulp simply because, it is easier to get started with. Also I don't remember much of my node development days.

The other advantage with gulp was that I could write configuration like I was writing javascript which I felt was easier to understand and read than a json configuration file.

### Import statements

As I am switching to typescript, I decided to move to a modern ES6 syntax to importing modules. So updated all the `require` statements in my `.ts` files.
 