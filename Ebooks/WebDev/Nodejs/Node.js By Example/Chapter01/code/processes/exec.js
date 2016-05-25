var exec = require('child_process').exec;
exec('ls -l', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});

// var spawn = require('child_process').spawn;
// var command = spawn('git', ['push', 'original', 'master']);
// ls.stdout.on('data', function (data) {
// 	console.log('stdout: ' + data);
// });
// ls.stderr.on('data', function (data) {
// 	console.log('stderr: ' + data);
// });
// ls.on('close', function (code) {
// 	console.log('child process exited with code ' + code);
// });