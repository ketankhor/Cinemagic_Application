const fs = require('fs')
const path = require('path')


const target = __dirname + '/movies.json';
const sources = ['/animation.json', '/classic.json', '/comedy.json', '/drama.json', '/family.json', '/horror.json', '/mystery.json', '/western.json']

sources.forEach(async source => {

    let data = await fs.promises.readFile(__dirname + source, 'utf-8');
    data=data.slice(1,data.length-2);
    data+=','
    console.log(data)

    await fs.promises.appendFile(target, data);
})