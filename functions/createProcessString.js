function createProcessString(inputString) {
    if (typeof inputString != 'string'){
        console.table({input: inputString, input_type: typeof input})
    }
    const spacedDash = / ?- ?/g;
    const apos = String.fromCharCode(0x0027);
    const processedInput = inputString.replace(apos, "").replace(spacedDash, " ").replace("  ", " ").toLowerCase().trim();
    return processedInput;
}
module.exports = createProcessString;