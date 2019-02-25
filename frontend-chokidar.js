const chokidar = require('chokidar');
const { exec } = require('child_process');
chokidar.watch('./src').on('all', (event, path) => {
  exec('npm run start_app', (e, out, err) => {
    console.log('Error', e);
    console.log('Out', out);
    console.log('STD Error', err);
  });
});
