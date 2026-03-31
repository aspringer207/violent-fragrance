function groupy(arr) {
  const supergroup = [];
  let currentGroup = [];
  let counter = 0;
  function buildGroup() {
    while (
      currentGroup.join(`
        `).length < 2000 &&
      counter <= arr.length - 1
    ) {
      let currentItem = arr[counter];
      currentGroup.push(currentItem.join("|"));
      counter++;
    }
  }

  while (counter < arr.length - 1) {
    buildGroup();
    supergroup.push(currentGroup.map(x => `\`${x}\``).join(`
`));
    currentGroup = [];
  }
  return supergroup;
}
module.exports = groupy;
