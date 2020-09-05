const Discord = require('discord.js');

module.exports.run = async (client, message, args, db, teampastel) => {
    const ticket_number = message.channel.name.slice(5).toUpperCase();
    const server = message.guild;
    db.collection('tickets').doc(ticket_number).get().then((database) =>{
        let userCheck = database.data().user_id
      if(userCheck === message.author.id || teampastel.includes(message.author.id)){
        db.collection('tickets').doc(ticket_number).update({
            'is_closed':true,
            'closed_time':message.createdAt,
            'closed_by':message.author.id
        }) 
      }else message.channel.send('티켓을 연 사람이나 운영진만 티켓을 닫을 수 있습니다')
      let category = server.channels.cache.find(c => c.name == "티켓 보관소" && c.type == "category");
      if (!category) throw new Error("Category channel does not exist");
    let channel = client.channels.cache.get(database.data().channel_id)
    channel.setParent(category)
    channel.overwritePermissions([
        {
           id: '622795748941234199',
           deny: ['VIEW_CHANNEL'],
        },
        {
            id: database.data().user_id,
            deny: ['VIEW_CHANNEL'],
        },
      ], 'Ticket Closed');
    })
    
}


module.exports.help = {
    name : "티켓닫기",
    aliases: ['닫기', 'Close', 'Ticketclose']
}
