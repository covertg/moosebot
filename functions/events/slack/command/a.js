const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const channels = ['dev', 'screaming_only'];
const oops = process.env.ERROR_MSG;

function sendMsg (msg, channel_id) {
  return lib.slack.messages['@0.6.5'].create({
    id: channel_id,
    text: msg
  });
}

function sendErr (user, channel_id) {
  console.log(`Sending f`);
  return sendMsg(`${oops} <@${user}>`, channel_id,);
}

/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {
  let result = {slack: {}};
  
  console.log(`Getting Slack info`);
  // console.log('Event info', event)
  let user_id = event.user_id;
  let user = event.user_name;
  let channel_id = event.channel_id;
  result.slack.user = await lib.slack.users['@0.4.5'].retrieve({ user: user_id });
  result.slack.channel = await lib.slack.conversations['@0.2.15'].info({ id: channel_id });

  if (!channels.includes(event.channel_name)) {
    console.log("User sent command in the wrong channel");
    result.slack.messageResponse = await sendErr(user, channel_id);
    return result;
  }
  
  console.log('Constructing message');
  let n = parseInt(event.text);
  if (isNaN(n) || n < 1) {
    result.slack.messageResponse = await sendErr(user, channel_id);
    return result;
  }
  let aas = 'a'.repeat(n);
  
  console.log(`Sending message`);
  result.slack.messageResponse = await sendMsg(`<@${user}> screams: ${aas}`, channel_id);
  
  return result;
};