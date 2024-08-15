require('dotenv').config()
const axios = require('axios')
const { Telegraf } = require('telegraf')

const shorten = async url => {
    try {
        const result = await axios.put(
            'https://api.shorte.st/v1/data/url',
            { 'urlToShorten': url },
            { headers: { 'public-api-token': process.env.API_KEY } }
        )
        console.log(result.data)
        return {
            success: result?.data?.status === 'ok',
            link: result?.data?.shortenedUrl
        }
    } catch (e) {
        return {
            success: false,
            error: 'An error occurred while shortening your URL, please check if your URL is correct.'
                // +`\n(error: ${e.response.data.message})`
        }
    }
}

const bot = new Telegraf(process.env.BOT_TOKEN)

const welcomeMessage = 'Welcome to the URL Shortener bot !' +
    '\nWith this bot, you can shorten your URLs using shorte.st' +
    '\n\n👉️ Contact @TgBotsXyz to get your custom telegram bots !' +
    '\n\n*Bot Instructions :*' +
    '\n\n/short Create a short URL'

bot.start((ctx) => ctx.replyWithMarkdown(welcomeMessage))

bot.command('short', ctx => {
    ctx.reply('Please enter your long URL :')
    bot.hears(new RegExp(/.*/i), async replyCtx => {
        const result = await shorten(replyCtx.message.text)
        if(result.success && result.link) {
            replyCtx.reply('Here is your shortened URL :')
            replyCtx.reply(result.link)
        } else if(result.error) {
            replyCtx.reply(result.error)
        } else {
            replyCtx.reply('An unknown error occurred, please try again later')
        }
    })
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
