// React regression entry point; uses isolated fixtures and never writes to a live API.
const {spawnSync}=require('node:child_process');
const path=require('node:path');
const result=spawnSync(process.execPath,['--test','--test-name-pattern=service pages',path.resolve(__dirname,'../../test/browser.test.mjs')],{stdio:'inherit'});
process.exitCode=result.status??1;
