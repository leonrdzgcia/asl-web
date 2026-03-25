const FtpDeploy = require('ftp-deploy');
const path = require('path');
const ftpConfig = require('./.ftpconfig.json');

const ftpDeploy = new FtpDeploy();

// Resolver ruta local absoluta
const config = {
  ...ftpConfig,
  localRoot: path.resolve(__dirname, ftpConfig.localRoot),
};

ftpDeploy.on('uploading', function (data) {
  const pct = Math.round((data.transferredFileCount / data.totalFilesCount) * 100);
  process.stdout.write(
    `\r[${pct}%] Subiendo (${data.transferredFileCount}/${data.totalFilesCount}): ${data.filename}`.padEnd(80)
  );
});

ftpDeploy.on('uploaded', function (data) {
  // progreso actualizado por 'uploading'
});

ftpDeploy.on('upload-error', function (data) {
  console.error(`\n✗ Error subiendo ${data.filename}:`, data.err);
});

console.log('🚀 Iniciando deploy por FTP...');
console.log(`   Origen : ${config.localRoot}`);
console.log(`   Destino: ${config.host}${config.remoteRoot}`);
console.log('');

ftpDeploy
  .deploy(config)
  .then((res) => {
    console.log('\n');
    console.log('✅ Deploy completado correctamente.');
    console.log(`   Archivos subidos: ${res.length}`);
  })
  .catch((err) => {
    console.error('\n❌ Error durante el deploy:', err);
    process.exit(1);
  });
