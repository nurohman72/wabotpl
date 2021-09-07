const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
//const client = new Client();

const tujuan = "+6287800092039"
const chatId = tujuan.substring(1)+ "@c.us"

const groupId = "6287800092039-1630485408@g.us"                   // Group M&M                 kode : !mm
const groupIdIT = "6287828222620-1446193391@g.us"                 // Group IT Seluruh plasindo kode : !it
const groupIdInfra = "6287828222620-1507101233@g.us"              // Group Infra               kode : !itinfra
const groupIdITFactory = "6285775253375-1544858042@g.us"          // Group IT Factory          kode : !itfp
const groupIdLPMPrtPL1 = ""                                       // Group LPM PL1 Printing    kode : !lpmpl1prt


// Path penyimpanan session
const SESSION_FILE_PATH = './session.json';


let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)){
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({puppeteer: { headless: true }, session: sessionCfg });

client.initialize();

/* 
const client = new Client({
      puppeteer: {
          browseWSEndpoint: `ws://localhost:3000`
      }
});
*/

// Kalau sudah ada session bawah ini akan dilewati ga akan minta qrcode

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});


client.on('ready', () => {
    console.log('Client is ready!');
//    client.sendMessage(chatId,'Selamat Datang');
    client.sendMessage(groupId, 'Halo saya bot *Helpdesk IT* \nSilahkan gunakan perintah *!* seperti berikut :\nIT pabrik : !itfp pesan\nIT Infra: !itinfra pesan'+
      '\nIT All : !it pesan');
});

client.on('message', async msg=> {
    console.log("MESSAGE RECEIVED", msg);
    
    let chat  = await msg.getChat();
    //chat.sendSeen()
    let grname
     
    if (chat.isGroup) {
        let grpid = chat.id._serialized;
	    //let grname = chat.name;
        grname = chat.name;
        console.log("Group ID: " +grpid);
	    console.log("Group NM: " +grname); 
    }
    if (msg.body === '!ping reply') {
	    msg.reply('pong');
    } else if (msg === '!ping') {
	    client.sendMessage(msg.from, 'pong');
    } else if (msg.body.startsWith('!itinfra ')) {
	    //client.sendMessage(groupIdIT, msg.from  + '/' + grname +': ' + msg.body.slice(7));
	    client.sendMessage(groupIdITInfra, '@' + grname +': ' + msg.body.slice(7));
    } else if (msg.body.startsWith('!itfp')){
        //client.sendMessage(groupIdITFactory,msg.from + '/' + grname +': ' + msg.body.slice(6))
        client.sendMessage(groupIdITFactory,'@' + grname +': ' + msg.body.slice(6))
    } else if (msg.body.startsWith('!it')){
        client.sendMessage(groupIdIT, '@'+ grname+': '+msg.body.slice(7) )
    }

});


// Simpan jika berhasil authenticate
client.on('authenticated', (session) => {
    //console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});
