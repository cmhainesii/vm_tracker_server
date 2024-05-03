// whitelist.js

const getTimestamp = require('./timestamp');
const checkRange = require('ip-range-check');



 const allowedIPs = ['10.0.0.30', '::1', '127.0.0.1', '10.0.0.43', '10.0.0.129', 'localhost', '192.168.100.0/24'];

function whitelist(req, res, next) {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipv4Address = clientIP.includes('::ffff:') ? clientIP.split(':').pop() : clientIP;

    const isAllowed = allowedIPs.some(ip => checkRange(ip, ipv4Address));

    if (isAllowed) {
        console.log(getTimestamp() + " || Request approved for: " + ipv4Address);
        next();
    } else {
        console.log(getTimestamp() + " || Request denied for: " + ipv4Address);
        res.status(403).send(`Access Forbidden for ${ipv4Address}`);
    }
}

module.exports = whitelist;