var file_system = require('fs');
var archiver = require('archiver');


var Comment = function(file) {

    if (!file)
        file = 'index.html';


    file_system.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }

        var line_data = data.split("\n");

        for (var i = 0; i < line_data.length; i++) {

            if (line_data[i].split('<!-- !@@').length > 1 || line_data[i].split('@@! -->').length > 1) {

                line_data[i] = line_data[i].split('<!-- !@@').join('<!-- !@ -->').split('@@! -->').join('<!-- @! -->');

            } else if (line_data[i].split('<!-- !@ -->').length > 1 || line_data[i].split('<!-- @! -->').length > 1) {

                line_data[i] = line_data[i].split('<!-- !@ -->').join('<!-- !@@').split('<!-- @! -->').join('@@! -->');

            }
        }

        data = line_data.join("\n");

        // write file
        file_system.writeFile(file, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("The file was saved!");
            }
        });
    });
};



Comment('src/index.html');

// Удаляем файл предыдущего архива
file_system.unlink('Src.zip', function(err) {
    if (err)
        console.log('file Src.zip Not found... Sorry');
    else
        console.log('file Src.zip DELETED!!!');
});

setTimeout(function() {

    var output = file_system.createWriteStream('Src.zip');
    var archive = archiver('zip');

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    archive.bulk([{
        src: ['src/**'],
        data: {
            date: new Date()
        }
    }, {
        expand: true,
        cwd: 'mydir',
        src: ['**'],
        dest: 'newdir'
    }]);

    archive.finalize();

}, 300);

setTimeout(function() {
    Comment('src/index.html');
}, 1000);