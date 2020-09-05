const Discord = require('discord.js');
const webhookClient = new Discord.WebhookClient('746264953278693436 ', 'H0Gz86kzh7NekbPsIbj-A6rdnuuMCiogAc6S7LSuh6du6wFXziMGTnHd0zOtT-BJ4uOS');
const regexr = /^\d+$/;

module.exports.run = async (client, message, args,db) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("메세지를 청소할 권한이 없어요\n`메세지 관리` 권한이 필요해요");
  if(args.length === 0) return message.channel.send('청소할 메세지 개수를 입력해 주세요')
  if (regexr.test(args[0]) === false) return('개수는 숫자만 입력해 주세요')
  message.delete()
  if(args[0] > 100) return args[0] = 99

  message.channel.bulkDelete(args[0], true)
  .then(deleted => message.channel.send(`메세지 \`${deleted.size}개\`를 청소했어요`)).then(msg =>{
    msg.delete({ timeout: 5000 })
  })
}


module.exports.help = {
    name : "청소",
    aliases: ['clear', 'clean']
}