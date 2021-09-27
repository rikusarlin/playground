import {MAX_NEWLINES, ROW_LENGTH, NEWLINE, PARAGRAPH_MARKER} from './constants'

export function wordWrapText(inputData, cursorAt){
  var processedInput = "";
  var addedNewlineInBeginningOrEnd = false;
  if(inputData.length <= ROW_LENGTH){
    processedInput = inputData;
  } else {
    var inputData2 = inputData;
    // If the text starts with newline(s), replace with paragraph marker(s)
    for(var newlines=MAX_NEWLINES; newlines>0; newlines--){
      const paragraphSeparator = NEWLINE.repeat(newlines);
      const paragraphMarker = " "+PARAGRAPH_MARKER.repeat(newlines)+" ";
      if(inputData.substring(0,newlines) === paragraphSeparator){
        //console.log("First "+ newlines + " lines were found to be newlines");
        inputData2 = paragraphMarker+" " + inputData.substring(newlines, inputData.length);
        addedNewlineInBeginningOrEnd = true;
        break;
      }
    }

    var inputData3 = inputData2;
    // If the text ends with newline(s), replace with paragraph marker(s)
    for(newlines=MAX_NEWLINES; newlines>0; newlines--){
      const paragraphSeparator = NEWLINE.repeat(newlines);
      const strToCompare = inputData2.slice(-newlines);
      const paragraphMarker = " "+PARAGRAPH_MARKER.repeat(newlines)+" ";
      if( strToCompare === paragraphSeparator){
        //console.log("Last "+ newlines + " lines were found to be newlines");
        inputData3 =  inputData2.substring(0, (inputData2.length-newlines)) + " "+paragraphMarker;
        addedNewlineInBeginningOrEnd = true;
        break;
      }
    }

    // Replace repeated occurences of newlines with paragraph markers
    var inputWithParagraphMarkers = inputData3;
    for(newlines=MAX_NEWLINES; newlines>1; newlines--){
      const paragraphSeparator = NEWLINE.repeat(newlines);
      const paragraphMarker = " "+PARAGRAPH_MARKER.repeat(newlines)+" ";
      inputWithParagraphMarkers = inputWithParagraphMarkers.split(paragraphSeparator).join(paragraphMarker);
    }

    // Tokenize into words by any whitespace
    const inputWords1 = inputWithParagraphMarkers.split(/\s+/);

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
          // The word does not fit into row, move to next line
          processedInput = processedInput + NEWLINE + inputWords[i] + " ";
          charsInRow = inputWords[i].length + 1;
        }
      }
    }
  }
  // Add space as last character - except if we added a newline to end
  if(!addedNewlineInBeginningOrEnd){
    processedInput = processedInput + " ";
  }
  const returnValue = {processedInput, addedNewlineInBeginningOrEnd};
  return returnValue;
}
