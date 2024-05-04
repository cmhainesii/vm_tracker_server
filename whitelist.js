// whitelist.js

const getTimestamp = require('./timestamp');




 const allowedIPs = ['10.0.0.30', '::1', '127.0.0.1', '10.0.0.43', '10.0.0.129', 'localhost'];
 const allowedIPRanges = ['192.168.100.'];

 function isIPInRange(ip, range) {
    return ip.startsWith(range);
 }

function whitelist(req, res, next) {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipv4Address = clientIP.includes('::ffff:') ? clientIP.split(':').pop() : clientIP;

    const isAllowed = allowedIPs.includes(ipv4Address) || allowedIPRanges.some(range => isIPInRange(ipv4Address, range));

    if (isAllowed) {
        console.log(getTimestamp() + " || Request approved for: " + ipv4Address);
        next();
    } else {
        console.log(getTimestamp() + " || Request denied for: " + ipv4Address);
        res.status(403).send(`Access Forbidden for ${ipv4Address}`);
    }
}

module.exports = whitelist;