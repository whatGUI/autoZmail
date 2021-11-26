const { createZipStream } = require("./archiver")
const { sendEmail } = require('./nodemailer');
const fs = require('fs');

// let emailConfig = {
//     host: 'smtp.ethereal.email',
//     port: 587,
//     email: 'arturo.schneider40@ethereal.email',
//     password: 'JVn9pzcMeEPTeT4mED',
//     secure: false,
//     to: 'vip.s.u.n@qq.com',
//     subject: 'test',
//     text: 'jusst a test!!',
// }

// let attachments = {
//     filesDir: ['D:/learnProject/README.md'],
//     folder:'D:/learnProject/'
// }


async function zipMail(emailConfig, attachments) {
    if (attachments.pathType==='folder') {
        if (await isFolderEmpty(attachments.folder)) {
            throw '默认文件夹为空文件夹，请检查后重试'
        }
    }
    // compress the attachments
    const zipstream = await createZipStream(attachments);
    await zipstream.finalize()
    // send email
    await sendEmail(emailConfig, zipstream)
}

// zipMail(emailConfig, attachments)

async function isFolderEmpty(folder) {
    return fs.promises.readdir(folder).then(files => {
        return files.length === 0;
    });
}

module.exports = { zipMail }


