var file_system = require('fs');
var archiver = require('archiver');

// TODO: change the index file function


var output = file_system.createWriteStream('Src.zip');
var archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);

archive.bulk([
  { src: ['src/**'], data: { date: new Date() } },
  { expand: true, cwd: 'mydir', src: ['**'], dest: 'newdir' }
]);

archive.finalize();