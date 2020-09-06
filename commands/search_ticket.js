const Discord = require('discord.js');

module.exports.run = async (client, message, args,db) => {
  if(args[0] === "") return message.channel.send('조회할 티켓번호를 입력해주세요')
  let search_query = args[0].toUpperCase();

  db.collection('tickets').doc(search_query).get().then((database) =>{
    if(!database.exists) return message.channel.send(`\`${search_query}\`의 고유번호를 가진 티켓을 찾을수 없습니다`)
    if(message.author.id != database.data().user_id && !message.member.hasPermission("ADMINISTRATOR")) return message.reply("관리자만 타인의 티켓을 조회할수 있어요");
    if(database.data().is_closed){
      client.users.fetch(database.data().user_id).then(user =>{
        let search_data_CLOSED = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`[CLOSED] 🎫티켓 조회 시스템\u200B\u200B\u200B\u200B\n티켓 고유번호 : ${search_query}`)
        .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL())
        .setDescription(`🔐비밀보장을 위해 DM으로 티켓을 전송합니다🔐`)
        .addFields(
            { name: '⏲️열린 시각', value: new Date(database.data().open_time._seconds) },
            { name: '⏲️닫힌 시각', value: new Date(database.data().closed_time._seconds)  },
            { name: '\u200B', value: '\u200B'},
            { name: '📝티켓 내용', value: database.data().ticket_log },
            { name: '\u200B', value: '\u200B'},
            { name: '🧍티켓 작성자', value: `<@${database.data().user_id}>`},
            { name: '🎫티켓 채널', value: `<#${database.data().channel_id}>`},
      )
        .setTimestamp()
        .setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
        message.author.send(search_data_CLOSED)
      }).catch(err => {
        console.log(err)
      })

           
    }else{
      if(!message.member.hasPermission("ADMINISTRATION")) return message.channel.send(`오픈상태의 티켓은 조회할 수 없습니다\n아래 채널로 직접 들어가세요 : <#${database.data().channel_id}>`)
      client.users.fetch(database.data().user_id).then(user =>{
        let search_data_OPEN = new Discord.MessageEmbed()
        .setColor('#29e39c')
        .setTitle(`[OPEN] 🎫티켓 조회 시스템\u200B\u200B\u200B\u200B\n티켓 고유번호 : ${search_query}`)
        .setAuthor(user.username + '#' + user.discriminator, user.displayAvatarURL())
        .setDescription(`🔐비밀보장을 위해 DM으로 티켓을 전송합니다🔐`)
        .addFields(
            { name: '⏲️열린 시각', value: new Date(database.data().open_time._seconds) },
            { name: '\u200B', value: '\u200B'},
            { name: '📝티켓 내용', value: database.data().ticket_log },
            { name: '\u200B', value: '\u200B'},
            { name: '🧍티켓 작성자', value: `<@${database.data().user_id}>`},
            { name: '🎫티켓 채널', value: `<#${database.data().channel_id}>`},
      )
        .setTimestamp()
        .setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
        message.author.send(search_data_OPEN)
      }).catch(err => {
        console.log(err)
      })
    }
    
  }).catch(err => {
    console.log(err)
  })
}


module.exports.help = {
    name : "티켓조회",
    aliases: ['조회', '검색', '티켓검색']
}