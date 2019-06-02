//Settings!
const yourID = process.env.YOUR_ID; //Instructions on how to get this: https://redd.it/40zgse
const setupCMD = "!createrolemessage"
let initialMessage = `**React to the messages below to receive the associated role. If you would like to remove the role, simply remove your reaction!**`;
const roles = ["Black Ops 4","Brawlhalla","Counter Strike","Destiny 2","Don't Starve Together","Dota 2","Fortnite","Hearthstone","League of Legends","Minecraft","Overwatch","Rocket League","Rust","Smash Bros: Ultimate","Smite","Spiral Knights","World of Warcraft"];
const reactions = ["🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶"];
const botToken = "hehe"; /*You'll have to set this yourself; read more
                     here https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token*/

// "🇦","🇧","🇨","🇩","🇪","🇫","🇬","🇭","🇮","🇯","🇰","🇱","🇲","🇳","🇴","🇵","🇶","🇷","🇸","🇹","🇺","🇻","🇼","🇽","🇾","🇿" array of all regonal indicators

//Load up the bot...
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.login(process.env.BOT_TOKEN);

//If there isn't a reaction for every role, scold the user!
console.log(roles.length);
console.log(reactions.length);
if (roles.length !== reactions.length) throw "Roles list and reactions list are not the same length!";

//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`React below to get the **"${role}"** role!`); //DONT CHANGE THIS
    return messages;
}


bot.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
									sent.react(mapObj[1]);
                }
            });
        }
    }
})


bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){

        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);

        if (msg.author.id == bot.user.id && msg.content != initialMessage){

            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];

            if (user.id != bot.user.id){

								var roleObj = msg.guild.roles.find(r => r.name === role);
								// rolecheck can go here

                var memberObj = msg.guild.members.get(user.id);

                if (event.t === "MESSAGE_REACTION_ADD"){
                    // memberObj.addRole(roleObj)
										if (roleObj === null){
											msg.guild.createRole({
												name: role,
												color: 'GREY',
												mentionable: true,
											})
											.then(() => roleObj = msg.guild.roles.find(r => r.name === role))
											// .then(() => console.log(roleObj))
											.then(() => memberObj.addRole(roleObj))
											.catch(error => {
												// handle failure of any Promise rejection inside here
											});
										}else{
											memberObj.addRole(roleObj);
										}
								} else {
									if (roleObj === null){
										console.log('No role to remove.')
									}else{
										memberObj.removeRole(roleObj);
                	}
            		}
        	}
			}

    })
}
});
