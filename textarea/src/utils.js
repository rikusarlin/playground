import {MAX_NEWLINES, ROW_LENGTH, NEWLINE, PARAGRAPH_MARKER} from './constants'
// eslint-disable-next-line no-control-regex
const wordSeparatorRegexp = new RegExp('[ \n]');

export function wordWrapText(inputData){
  var processedInput = "";
  if(inputData.length <= ROW_LENGTH){
    processedInput = inputData;
  } else {
    // Replace newlines with paragraph markers
    var inputWithParagraphMarkers = inputData;
    for(var newlines=MAX_NEWLINES; newlines>1; newlines--){
      const paragraphSeparator = NEWLINE.repeat(newlines);
      const paragraphMarker = " "+PARAGRAPH_MARKER.repeat(newlines)+" ";
      inputWithParagraphMarkers = inputWithParagraphMarkers.split(paragraphSeparator).join(paragraphMarker);
    }

    // Tokenize into words
    const inputWords1 = inputWithParagraphMarkers.split(wordSeparatorRegexp);

    // Get rid of empty words
    const inputWords = inputWords1.filter(s => s);

    var charsInRow = 0;
    // Add words to row one by one so that we get max ROW_LENGTH worth of charcters
    for(var i=0; i<inputWords.length; i++){
      // Paragraph markers are special case, add corresponding number of newlines
      const nParagraphMarkers = inputWords[i].split(PARAGRAPH_MARKER).length - 1;
      if(nParagraphMarkers > 0 ) {
        processedInput = processedInput + NEWLINE.repeat(nParagraphMarkers);
        charsInRow = 0;
      } else {
        if((charsInRow + inputWords[i].length) < ROW_LENGTH){
          // The word still fits into row
          processedInput = processedInput + inputWords[i];
          charsInRow = charsInRow + inputWords[i].length;
          // Add space - or newline if at the end of line, except if this was the last word
          if(i !== (inputWords.length-1)){
            if(charsInRow < ROW_LENGTH){
              processedInput = processedInput + " ";
              charsInRow++;
            } else {
              processedInput = processedInput + NEWLINE;
              charsInRow = 0;
            }
          }
        } else {
          //The word does not fit into row, move to next line
          processedInput = processedInput + NEWLINE + inputWords[i] + " ";
          charsInRow = inputWords[i].length + 1;
        }
      }
    }
  }
  // Without this cannot append to end
  processedInput = processedInput + " ";
  return processedInput;
}
