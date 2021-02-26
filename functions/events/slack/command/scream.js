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
  // console.log('Event info', event);
  let user_id = event.user_id;
  let user = event.user_name;
  let channel_id = event.channel_id;
  result.slack.user = await lib.slack.users['@0.4.5'].retrieve({ user: user_id });
  result.slack.channel = await lib.slack.conversations['@0.2.15'].info({ id: channel_id });
  // console.log(result.slack.user);

  if (!channels.includes(event.channel_name)) {
    console.log('User sent command in the wrong channel');
    result.slack.messageResponse = await sendErr(user, channel_id);
    return result;
  }
  
  console.log('Parsing input')
  let args = event.text.split(/\s(?=\S+$)/);
  let base_msg = args[0];
  let n = parseInt(args[1]);
  if (args.length != 2 || !base_msg || isNaN(n) || n < 1) {
    result.slack.messageResponse = await sendErr(user, channel_id);
    return result;
  }
  
  console.log('Constructing message');
  console.log(base_msg, n);
  let full_msg = base_msg.repeat(n);
  if (base_msg !== base_msg.toLowerCase() && base_msg !== base_msg.toUpperCase()) {
    full_msg = full_msg.split('');
    full_msg = full_msg.map(c => {
      if (Math.random() < 0.5) return c.toUpperCase();
      else return c.toLowerCase();
    });
    full_msg = full_msg.join('');
  }
  let quoted_msg = `> ${full_msg}\n_—${user}_`
  
  console.log(`Sending message`);
  result.slack.messageResponse = await sendMsg(quoted_msg, channel_id);
  
  return result;
};