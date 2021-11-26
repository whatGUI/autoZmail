// require modules
const archiver = require('archiver');
const path = require('path');

// listen for all archive data to be written
// 'close' event is fired only when a file descriptor is involved
// output.on('close', function () {
//   console.log(archive.pointer() + ' total bytes');
//   console.log('archiver has been finalized and the output file descriptor has closed.');
// });

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
// output.on('end', function () {
//   console.log('Data has been drained');
// });

async function createZipStream(attachments) {
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  archive.on('error', function (err) {
    throw err;
  });

  if (attachments.pathType === 'folder') {
    archive.directory(attachments.folder, false);
  }

  if (attachments.pathType === 'files') {
    attachments.filesDir.forEach(dir => {
      archive.file(dir, { name: path.basename(dir) });
    });
  }

  return archive
}

module.exports = { createZipStream }