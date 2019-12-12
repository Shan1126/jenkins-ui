const express = require('express'),http = require('http'),path = require('path'),compression = require('compression');

const app = express();
const forceSSL = function() {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    }
}
app.use(forceSSL());
app.use(express.static(path.join(__dirname, 'dist/jenkin-jobs/')));
app.use(compression()) //compressing dist folder
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/jenkin-jobs/index.html'));
    console.log(`Jenkins middleware Service running on port 8081`);
});

app.listen(8082, () => {
    console.log(`Jenkins UI running on port 8082`);
});
