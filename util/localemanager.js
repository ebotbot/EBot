const { readdirSync } = require('fs')
const { Collection } = require('discord.js')

module.exports = class LocaleManager {
  constructor () {
    this.langs = new Collection()
    
    this._loadLocales()
  }
  _loadLocales () {
    readdirSync(`${__dirname}/../locales/`).forEach((lang) => {
      const categoryObject = {}
      readdirSync(`${__dirname}/../locales/${lang}`).forEach((category) => {
        categoryObject[category.split('.')[0]] = require(`${__dirname}/../locales/${lang}/${category}`)
      })
      this.langs.set(lang, categoryObject)
    })
  }
  getT (langString) {
    const lang = this.langs.get(langString)
    if (!lang) return null
    else return function t (localeKey, placeholders) {
      let categoryAndLocale = localeKey.split(':')
      let category = lang[categoryAndLocale[0]]
      if (!category) return null
      let objectAndKey = categoryAndLocale[1].split('.')
      
      let locale = objectAndKey.length > 1 ? category[objectAndKey[0]][objectAndKey[1]] : category[objectAndKey[0]]
      if (!locale) return null
      
      if (placeholders) {
        for (const holder in placeholders) {
          locale = locale.split(`{{${holder}}}`).join(placeholders[holder])
        }
      }
      return locale
    }
  }
}
