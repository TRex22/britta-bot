//Description:
//  Generates help commands for Hubot.
//
//Commands:
//  :help - Displays all of the help commands that Hubot knows about.
//  :help <query> - Displays all help commands that match <query>.
//
//URLS:
//  /hubot/help
//
//Notes:
//  These commands are grabbed from comment blocks at the top of each file.

var helpContents = function( name, commands ) {
	return "\
		<html>\n\
		  <head>\n\
		  <title>" + name + " Help</title>\n\
		  <style type=\"text/css\">\n\
		    body {\n\
		      background: #d3d6d9;\n\
		      color: #636c75;\n\
		      text-shadow: 0 1px 1px rgba(255, 255, 255, .5);\n\
		      font-family: Helvetica, Arial, sans-serif;\n\
		    }\n\
		    h1 {\n\
		      margin: 8px 0;\n\
		      padding: 0;\n\
		    }\n\
		    .commands {\n\
		      font-size: 13px;\n\
		    }\n\
		    p {\n\
		      border-bottom: 1px solid #eee;\n\
		      margin: 6px 0 0 0;\n\
		      padding-bottom: 5px;\n\
		    }\n\
		    p:last-child {\n\
		      border: 0;\n\
		    }\n\
		  </style>\n\
		  </head>\n\
		  <body>\n\
		    <h1>" + name + " Help</h1>\n\
		    <div class=\"commands\">\n\
		      " + commands + "\n\
		    </div>\n\
		  </body>\n\
		</html>\n";
};

module.exports = function(robot) {
	robot.respond( /help\s*(.*)?$/i, function(msg) {
		var cmds = robot.helpCommands();

		if( msg.match[1] ) {
			cmds = cmds.filter(function( cmd ) {
				cmd.match( new RegExp( msg.match[1] , 'i') );
			});
		}

		var emit = cmds.join("\n");

		if( robot.name.toLowerCase() !== 'hubot' ) {
			emit = emit.replace( /hubot/ig, robot.name );
		}

		 msg.send( emit );
	});

	robot.router.get( '/help', function(req, res) {
		var cmds = robot.helpCommands(),
			emit = "<p>" + cmds.join( "</p><p>" ) + "</p>";

		emit = emit.replace( /hubot/ig, "<b>" + robot.name + "</b>" );

		res.setHeader( 'content-type', 'text/html' );
		res.end( helpContents( robot.name, emit ) );
	});
};