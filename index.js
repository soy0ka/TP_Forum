const Discord = require('discord.js')
const fs = require('fs')
const Canvas = require('discord-canvas')
const { token, prefix, allowed_guild, teampastel , webhook_id , webhook_token } = require('./config.json')
const client = new Discord.Client()
const webhook = new Discord.WebhookClient(webhook_id, webhook_token);

client.commands = new Discord.Collection();
client.aliases =  new Discord.Collection();

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount)
})

const db = admin.firestore();

fs.readdir('./commands/', (err,files) => {
    if (err) {
        console.log(err);
    }
    
    let cmdFiles = files.filter(f => f.split(".").pop() === "js");
    console.log("========명령어========")
    
    if (cmdFiles.length === 0){
        console.log("불러올 파일이 없습니다");
        return;
    }
    
        cmdFiles.forEach((f,i) => {
            let props = require(`./commands/${f}`);
            console.log(`${i+1}: ${f} 로드됨 ✅`);
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name)
                            
                });
        })
    })
    

client.on('message',msg => {
        if (msg.channel.type === "dm") return;
        if (!allowed_guild.includes(msg.guild.id)) return;
        if (msg.author.bot) return;
        let messageArray = msg.content.split(" ");
        let cmd = messageArray[0].toLowerCase();
        let args = messageArray.slice(1);
        if(!msg.content.startsWith(prefix)) return;
        let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
        if(commandfile) commandfile.run(client,msg,args,db,teampastel,webhook);   
});

client.on('message',msg => {
    if (msg.channel.type === "dm") return;
    if (msg.channel.name.length < 14) return
    let ticket_number = msg.channel.name.slice(5).toUpperCase();
    db.collection('tickets').doc(ticket_number).get().then((database) =>{
        if(!database.exists) return
            db.collection('tickets').doc(ticket_number).update({
                "ticket_log":`${database.data().ticket_log} \n [${msg.author.tag}] : ${msg}`
            }) 
        
    })
});

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === "👋입장");
    let role = member.guild.roles.cache.find(r => r.name === "유저");
    member.roles.add(role)
    if (!channel) return;
    const welcome = new Discord.MessageEmbed()
	.setColor('#03cefc')
	.setTitle('멤버 입장!')
	.setDescription(`<@${member.user.id}>님 ${member.guild.name}에 오신것을 환영합니다\n멤버수 : ${member.guild.memberCount}`)
    .setThumbnail(member.user.displayAvatarURL())
    .addField(`📖서버규칙`,`<#694170217047130172>`)
    .addField(`💬이용자분들과 소통`,`<#694175025011622002>`)
    .addField('📧지원', `<#745651726178189433>`)
	.setTimestamp()
	.setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
    channel.send(welcome);
});

client.on('guildMemberRemove', async member => {
	const channel = member.guild.channels.cache.find(ch => ch.name === "👋퇴장");
    if (!channel) return;
    const goodbye = new Discord.MessageEmbed()
	.setColor('#f70f3d')
	.setTitle('멤버 퇴장!')
	.setDescription(`<@${member.user.id}>님 만나서 반가웠어요 안녕히가세요(꾸벅)\n멤버수 : ${member.guild.memberCount}`)
    .setThumbnail(member.user.displayAvatarURL())
	.setTimestamp()
	.setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
    channel.send(goodbye);
});

client.on('ready', () => {
    console.log(`${client.user.tag} 로 로그인됨`);
    client.user.setActivity('초아봇 포럼', { type: 'WATCHING' });
});

  
client.login(token)