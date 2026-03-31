function createProcessString(inputString) {
    const spacedDash = / ?- ?/g;
    const apos = String.fromCharCode(0x0027);
    const processedInput = inputString.replace(apos, "").replace(spacedDash, " ").replace("  ", " ").toLowerCase().trim();
    return processedInput;
}
module.exports = createProcessString;