function dateformat(){
    let currentDate = new Date()
    let year = currentDate.getFullYear()
    let month = currentDate.getMonth() + 1
    let day = currentDate.getDate()
    let hour = currentDate.getHours()
    let minute = currentDate.getMinutes()
    return  year+'-'+month+'-'+day+'-'+hour+'-'+minute    
}

module.exports = {dateformat}