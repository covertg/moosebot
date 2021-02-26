# moosebot

`Moosebot` is a quirky, serverless Slack chatbot built using [Autocode](https://autocode.com/). It was first built to help automate some tasks in a workspace channel called `#screaming_only`. That is, Moosebot would send the letter "a" a specified number of times on behest of users. Origins aside, the resulting project could serve as a flexible foundation for a variety of Slack bots. Have fun with it!

## Features, Usage

`moosebot` can interface with other users via Slack commands (prefixed by `/`) and mentions (`@username`). See the usage blurb for commands to try out.

```
slack> @Autocode help

slack> Autocode: Here's what I know how to do (so far):
    
@ commands: "at" me, followed by <cmd> <possible args>.
<cmd>   <args>        <description>
rps     <move>        Plays rock, paper, scissors! <move> is one of r(ock),
                      p(aper), or s(cissors).
help                  Prints this message.

/ commands: type /cmd, followed by <cmd> <possible args>.
<cmd>   <args>        <description>
a       <n>           A classic.
scream  <msg> <n>     Shouts your msg n times. If <msg> is upper and lower case,
                      it jumbles it all up for you. #screaming_only
```


## Atributions

* Thanks to Sajan R, who first coded a Discord chatbot (python server) to automate shouts;
* and thanks to all who have gotten to know Moosebot! :-)