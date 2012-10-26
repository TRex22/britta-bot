var gm = require('gm').subClass({ imageMagick: true });

module.exports = function(robot) {

    var usercount = {};

	robot.adapter.bot.on( 'names', function(chan, names) { usercount[chan] = Object.size(names); } );

    setInterval( function() {
        // every 120 seconds, ask for the NAMES of a random channel
        var chans = robot.adapter.bot.opt.channels,
            r = Math.floor( Math.random() * Object.size(chans) );
        robot.adapter.bot.send('NAMES', robot.adapter.bot.opt.channels[r]);
    }, 30000);

    robot.router.get( "/status.png\?channel=:channel", function(req, res) {
        var channel = req.params.channel.replace( /\$/g, '#' );
        gm(25, 20, "#ffffff")
            .fontSize(13)
            .fill("#000")
            .drawText(5,15, usercount[channel])
            .setFormat('png')
            .stream(function (err, stdout, stderr) {
                if (err) console.log(' boo! ', err);
                else {
                    stdout.pipe(res);
                }
            });
    });

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

};