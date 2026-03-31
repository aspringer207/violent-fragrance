function chunky(str) {
  const chunks = [];
  const splitters = /(?<=:) |,/g;

  const manyChunks = str.split(splitters);
  let chunkCount = 0;
  function addChunk(chunkBuilder) {
    if (chunkCount >= manyChunks.length) {
      chunks.push(chunkBuilder);
      return;
    }
    if (chunkBuilder.length >= 1000) {
      chunks.push(chunkBuilder);
      chunkBuilder = manyChunks[chunkCount];
      chunkCount++;

      return addChunk(
        chunkBuilder.concat(
    `
    `),
      );
    }
    chunkBuilder = chunkBuilder.concat(
      manyChunks[chunkCount],
    `
    `,
    );
    chunkCount++;
    return addChunk(chunkBuilder);
  }
  addChunk("");
  return chunks;
}
module.exports = chunky;