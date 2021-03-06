const { exec } = require('child_process');
const core = require('@actions/core');

exec(`cd ${core.getInput('path')} && git fetch --tags --all`, (err, res, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', `Couldn't fetch`);
        console.log('\x1b[31m%s\x1b[0m', stderr);
        process.exit(1);
    }
    exec(`cd ${core.getInput('path')} && git rev-list --tags --max-count=1`, (err, rev, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
        }
        rev = rev.trim()
        exec(`cd ${core.getInput('path')} && git describe --tags ${rev}`, (err, tag, stderr) => {
            if (err) {
                console.log('\x1b[33m%s\x1b[0m', rev)
                console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
                console.log('\x1b[31m%s\x1b[0m', stderr);
                process.exit(1);
            }
            tag = tag.trim()
            exec(`cd ${core.getInput('path')} && git describe --abbrev=0 HEAD^`, (err, pastTag, stderr) => {
                pastTag = pastTag.trim()
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
                console.log('\x1b[32m%s\x1b[0m', `Found past tag: ${pastTag}`);
                console.log(`::set-output name=tag::${tag}`);
                console.log(`::set-output name=pastTag::${pastTag}`);

                process.exit(0);
            });
        });
    });
});