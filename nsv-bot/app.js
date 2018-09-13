const {
  BotFrameworkAdapter,
  MemoryStorage,
  ConversationState
} = require("botbuilder");
const restify = require("restify");
require("dotenv").config();

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
  console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

// Listen for incoming requests
server.post("/api/messages", (req, res) => {
  // Route received request to adapter for processing
  adapter.processActivity(req, res, context => {
    if (context.activity.type === "message") {
      const state = conversationState.get(context);
      const count =
        state.count === undefined ? (state.count = 0) : ++state.count;
      if (count == 0) {
        return context.sendActivity(
          `${count} Please enter any other behaviors that concern you.`
          // let me suggest some resources that may help you understand these behaviors.
        );
      } else {
        return context.sendActivity(
          // "${context.activity.text}"
          `${count} I just posted some research and insights in the "Resources" section of the page. 
          Please check them out to learn more about these behaviors. Or, enter more behaviors.`
        );
      }
      // the model will make inferences based on these behaviors
      // Here is where nsv develops business logic.
      // the probability that these behaviors relate to violence based on the corpus of data that we trained the model on.
    } else {
      return context.sendActivity(`[${context.activity.type} event detected]`);
    }
  });
});
