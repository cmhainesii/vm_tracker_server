const getTimestamp = () => {
    const timeStamp = new Date();
    return `${timeStamp.getFullYear()}-${(timeStamp.getMonth() + 1).toString().padStart(2, '0')}-${timeStamp.getDate().toString().padStart(2, '0')} ${timeStamp.getHours().toString().padStart(2, '0')}:${timeStamp.getMinutes().toString().padStart(2, '0')}:${timeStamp.getSeconds().toString().padStart(2, '0')}`;

}

module.exports = getTimestamp;