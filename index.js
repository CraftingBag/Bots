const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true}); // botnya tidak akan bisa mention @everyone
const botconfig = require("./botconfig.json"); // Prefix
const tokenfile = require("./token.json"); // Token
const fs = require("fs");
bot.commands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {

	if(err) console.log(err);
  
	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0){
	  console.log("Couldn't find commands.");
	  return;
	}
  
	jsfile.forEach((f, i) =>{
	  let props = require(`./cmds/${f}`);
	  console.log(`${f} loaded!`);
	  bot.commands.set(props.help.name, props);
	});
  
  });

bot.on("ready", async () => {
	console.log(`${bot.user.username} sudah online di ${bot.guilds.size} servers!`);
	bot.user.setActivity("Blacksweet | ??help", {type: "STREAMING"});	
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
  
	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	let commandfile = bot.commands.get(cmd.slice(prefix.length));
	if(commandfile) commandfile.run(bot,message,args);

});


bot.login(tokenfile.token);