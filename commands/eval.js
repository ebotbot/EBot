const Command = require('../src/structures/Command')
const { MessageEmbed } = require('discord.js')

module.exports = class EvalCommand extends Command {
  constructor (...args) {
    super(...args, {
      name: 'eval',
      devCommand: true
    })
  }
  async run (message, args, t) {
    let m = await message.channel.send('Executando...')
    try {
      let beforeRunning = Date.now()
      let result = eval(this.parse(args.join(' ')))

      if (result instanceof Promise) {
        m.edit('O código retornou uma promise - aguardando ela ser resolvida...')
        await result
      }
      if (typeof result !== 'string') result = require('util').inspect(result)
      let end = (Date.now() - beforeRunning)
      let embed = new MessageEmbed(message.author)
        .setTitle('Sucesso!')
        .setDescription('```js\n' + result.slice(0, 2000) + '```')
        .addField('Tempo de execução', (end / 60).toFixed(5) + 's').setColor(0x0000ff)
      m.edit('Sucesso!', { embed: embed })
    } catch (e) {
      let embed = new MessageEmbed(message.author)
        .setTitle('Erro!')
        .setDescription('```js\n' + e.stack.slice(0, 2000) + '```')
      m.edit('Falha...', { embed: embed })
    }
  }
  parse (text) {
    if (!['/*', '*/'].some(a => text.includes(a))) return text
    let pureContent = text.split('/*')[1].split('*/')[0].split(' ').join('')
    let instruction = pureContent.split(':')
    if (instruction[0] === 'require') {
      let packagesStr = ''
      instruction[1].split(',').forEach(packageName => {
        packagesStr += `const ${packageName.split('.').join('')} = require('${packageName}')\n`
      })
      return packagesStr +'\n'+ text.replace('require:', 'Imported packages')
    }
  }
}