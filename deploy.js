const target = require('./deploy-config').target;
const ncp = require('ncp');
if (target) {
  ncp('./dist', target, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log(
          './dist deployed to ' + target + ' @ ' + new Date().toLocaleString()
      );
    }
  });
} else {
  console.log('No deployment target specified');
}
