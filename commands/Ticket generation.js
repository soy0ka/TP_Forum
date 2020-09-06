const Discord = require('discord.js');

module.exports.run = async (client, message, args,db,tp,webhookClient) => {
    message.delete()
    const ticket_number = Math.random().toString(36).substr(2,11).toUpperCase();
    const server = message.guild;
    let noticemessage = `\`\`\`
    1.신고하려는 이용자의 닉네임과 태그를 정확하게 알려주세요
    2.신고하려는 사유를 자세하게 적어주세요
    3.사건 발생 시간대를 알려주세요
    4.사건이 발생한 채널을 알려주세요 
    *3,4번의 경우 메세지가 살아있다면 해당 메세지의 링크를 알려주셔도 됩니다*
    4.관련 스크린샷을 첨부하실수 있다면 해주세요
    5.더 하고싶은 말씀은 없으신가요?
    \`\`\``

    db.collection('info').doc('info').get().then((database) =>{
        let nticket = database.data().ticket_count
        db.collection('info').doc('info').update({
            'ticket_count': nticket + 1
        }) 
    })
    server.channels.create(`🎫티켓-${ticket_number}`, {
        type: 'text',
        permissionOverwrites: [
            {
                id: '622795748941234199',
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: message.author.id,
                allow: ['VIEW_CHANNEL'],
            },
        ],
    }).then(channel => {
    let category = server.channels.cache.find(c => c.name == "티켓" && c.type == "category");
    db.collection('tickets').doc(ticket_number).set({
        'is_closed':false,
        'open_time':message.createdAt,
        'ticket_id':ticket_number,
        'user_id':message.author.id,
        'channel_id':channel.id,
        'ticket_log':[]
    }) 
    if (!category) throw new Error("Category channel does not exist");
    channel.setParent(category.id);
    const Ticketembed = new Discord.MessageEmbed()
	.setColor('#03cefc')
    .setTitle(`🎫티켓을 생성해 주셔서 감사합니다!\u200B\u200B\u200B\u200B\n티켓 고유번호 : ${ticket_number}`)
    .setThumbnail('https://cdn.discordapp.com/attachments/620101622772531246/745643259128184863/unknown.png')
    .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.displayAvatarURL())
    .setDescription(`티켓이용은 티켓채널을 참고해주세요\n🔐티켓은 다른 유저분들에게 비공개이니 안심하셔도 됩니다`)
	.addFields(
        { name: '🚨이용자 신고', value: noticemessage },
        { name: '\u200B', value: '\u200B'},
        { name: '📨문의/건의', value: '운영진 혹은 개발자에게 하고싶은말을 자유롭게 적어주세요'},
        { name: '\u200B', value: '\u200B'},
        { name: '🔐티켓 닫기', value: `충분한 문의가 끝났다면 __**%닫기**__ 로 티켓을 닫으실 수 있습니다`, inline:true},
        //{ name: '📬이메일로 티켓 받기', value: `티켓을 닫을때 __**%닫기 (메일주소)**__ 로 닫으시면 자동으로 이메일이 전송됩니다`}
	)
    // .setImage('https://i.pinimg.com/originals/71/c0/68/71c068478e7499d73ec005eacbe42c10.gif')
    // .setImage('https://thumbs.gfycat.com/KlutzyBlushingBoubou-size_restricted.gif')
    .setImage('https://mir-s3-cdn-cf.behance.net/project_modules/fs/9fd82860850557.5a6a84a53e561.gif')
	.setTimestamp()
	.setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
    channel.send(Ticketembed)
    //로깅
    const TicketLog = new Discord.MessageEmbed()
    .setTitle(`🎫티켓 생성됨`)
    .setAuthor(message.author.username + '#' + message.author.discriminator, message.author.displayAvatarURL())
    .setDescription(`티켓이 생성되었습니다\n채널 <#${channel.id}>`)
	.addFields(
        { name: '🎫티켓 번호', value: ticket_number },
        { name: '🧍오픈한 사람', value:`${message.author.username}#${message.author.discriminator} (id : ${message.author.id})`},
        { name: '⏲️오픈 시간', value: message.createdAt },
	)
	.setTimestamp()
	.setFooter('팀파스텔 포럼 봇', 'https://cdn.discordapp.com/avatars/738067051012161538/5ee906417882961762039658b6c15f56.png?size=256');
    webhookClient.send(TicketLog)
  }).catch(console.error);
}


module.exports.help = {
    name : "티켓",
    aliases: ['티켓열기', 'Ticket', 'Ticketopen', '생성']
}