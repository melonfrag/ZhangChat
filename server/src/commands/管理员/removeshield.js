import * as UAC from '../utility/UAC/_info';
export function init(core){
  if (!core.config.shield){
    core.config.shield = []
  }
}
// module main
export async function run(core, server, socket, data) {
  // increase rate limit chance and ignore if not admin or mod
  if (!UAC.isModerator(socket.level)) {
    server.reply({
      cmd:'warn',
      text:'权限不足，无法操作'
    },socket)
    return server.police.frisk(socket.address, 10);
  }
  if (typeof data.text !== 'string'){
    return server.reply({
      cmd:'warn',
      text:'数据无效'
    },socket)
  }
  if (!data.text){
    return server.reply({
      cmd:'warn',
      text:'数据无效'
    },socket)
  }
  if (core.config.shield.indexOf(data.text) === -1){
    return server.reply({
      cmd:'warn',
      text:'该内容没有被屏蔽了，无需重复操作！'
    },socket)
  }
  core.config.shield = core.config.shield.filter((text) => text !== data.text)
  server.broadcast({
    cmd:'info',
    text:`已取消屏蔽所有包含 ${data.text} 的内容`
  },{level:(level) => level < UAC.levels.moderator})
  server.broadcast({
    cmd:'info',
    text:`${socket.nick} 已取消屏蔽所有包含 ${data.text} 的内容`
  },{level:UAC.isModerator})
  if (!core.configManager.save()) {
    return server.broadcast({
      cmd: 'warn',
      text: '保存文件失败，请检查日志。',
    }, {level:UAC.isModerator});
  }
  return true;
}
export const requiredData = ['text'];
export const info = {
  name: 'removeshield',
  description: '该命令用于删除屏蔽的内容。',
  usage: `
    API: { cmd: 'removeshield', text: '<要取消屏蔽的内容>' }
    文本：以聊天形式发送 /removeshield 要取消屏蔽的内容`,
  fastcmd:[
    {
      name:'text',
      len:0
    }
  ]
};
