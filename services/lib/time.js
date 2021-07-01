function extendTime(date, addInMilSeconds, format = "save_to_db") {
    // in milisec
    let time = new Date(date).getTime();
    time += addInMilSeconds;
    
    if(format != "save_to_db")
        return time;

    // db format YYYY:MM:DD HH:MM:SS.SSS
    let new_date  = new Date(time);

    let year = new_date.getFullYear();
    let month = new_date.getMonth()+1;// it starts from 0
    let day = new_date.getDate();
    let hours = new_date.getHours();
    let minutes = new_date.getMinutes();
    let sec = new_date.getSeconds();
    let ms = new_date.getMilliseconds();

    function addZeroes(dateMember) {
        if(dateMember<10)
            return `0${dateMember}`
        return dateMember;
    }

    month = addZeroes(month);
    day = addZeroes(day);
    hours = addZeroes(hours);
    minutes = addZeroes(minutes);
    sec = addZeroes(sec);

    if(ms<10)
        ms = "00"+ms; 
    if(ms<100)
        ms = addZeroes(ms)

    return `${year}-${month}-${day} ${hours}:${minutes}:${sec}.${ms}`;
}

module.exports = {
    extendTime: extendTime
}