/* Note that this endpoint seems to only apply to mentions in a channel, not DMs. */
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const oops = process.env.ERROR_MSG;
const RPSOutcome = {
  WIN: 0,
  LOSS: 1,
  TIE: 2,
  FAIL: 3
};

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

function play_rps (opponent) {
  let bot = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
  console.log('Bot plays', bot);
  let outcome = RPSOutcome.FAIL;
  if (opponent.match(/^r.*/i)) { // rock
    console.log('Opponent plays rock');
    if (bot === 'rock') outcome = RPSOutcome.TIE;
    else if (bot === 'paper') outcome = RPSOutcome.WIN;
    else if (bot === 'scissors') outcome = RPSOutcome.LOSS;
  } else if (opponent.match(/^p.*/i)) { // paper
    console.log('Opponent plays paper');
    if (bot === 'rock') outcome = RPSOutcome.LOSS;
    else if (bot === 'paper') outcome = RPSOutcome.TIE;
    else if (bot === 'scissors') outcome = RPSOutcome.WIN;
  } else if (opponent.match(/^s.*/i)) { // scissors
    console.log('Opponent plays scissors');
    if (bot === 'rock') outcome = RPSOutcome.WIN;
    else if (bot === 'paper') outcome = RPSOutcome.LOSS;
    else if (bot === 'scissors') outcome = RPSOutcome.TIE;
  }
  return [bot, outcome];
}


/**
* An HTTP endpoint that acts as a webhook for Slack app_mention event
* @param {object} event
* @returns {object} result Your return value
*/
module.exports = async (event) => {
  let result = {slack: {}};

  console.log(`Getting slack info`);
  // console.log('Event info', event)
  let user_id = event.event.user;
  let channel_id = event.event.channel;
  result.slack.user = await lib.slack.users['@0.4.5'].retrieve({ user: user_id });
  result.slack.channel = await lib.slack.conversations['@0.2.15'].info({ id: channel_id });
  
  console.log('Parsing input');
  let txt = event.event.text.split(' ');
  let cmd = txt[1].toLowerCase();
  let args = txt.slice(2);
  if (cmd === 'rps') {
    // Rock, paper, scissors game
    console.log('Playing RPS');
    let [bot, outcome] = play_rps(args[0]);
    if (outcome == RPSOutcome.FAIL) {
      result.slack.messageResponse = await sendErr(result.slack.user.name, channel_id);
      return result;
    }
    let outcome_str = ['The bot wins!', 'You win!', "It's a tie!"][outcome];
    let msg = `The bot played ${bot}. ${outcome_str}`;
    result.slack.messageResponse = await sendMsg(msg, channel_id);
    return result;
  } else if (cmd === 'help') {
    console.log('Printing help');
    let msg = `\`\`\`Here's what I know how to do (so far):
    
@ commands: "at" me, followed by <cmd> <possible args>.
<cmd>   <args>        <description>
rps     <move>        Plays rock, paper, scissors! <move> is one of r(ock),
                      p(aper), or s(cissors).
help                  Prints this message.

/ commands: type /cmd, followed by <cmd> <possible args>.
<cmd>   <args>        <description>
a       <n>           A classic.
scream  <msg> <n>     Shouts your msg n times. If <msg> is upper and lower case,
                      it jumbles it all up for you. #screaming_only\`\`\``;
    result.slack.messageResponse = await sendMsg(msg, channel_id);
    return result;
  }
  
  result.slack.messageResponse = await sendErr(result.slack.user.name, channel_id);
  return result;
}
  