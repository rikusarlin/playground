import {ROW_LENGTH, NEWLINE, MAX_NEWLINES, PARAGRAPH_MARKER} from './constants'

export function wordWrapText(inputData, cursorAt){
  if(inputData.length <= ROW_LENGTH){
    // Short input - no need to do anything
    return inputData;
  } else {
    const {inputWithParagraphMarkers}=replaceNewlineWithParagrapMarkers(inputData);
    return wrapText(inputWithParagraphMarkers);
  }
}

function replaceNewlineWithParagrapMarkers(inputData){
  var inputData2 = inputData;
  var addedNewline = false;
  // If the text starts with newline(s), replace with paragraph marker(s)
  for(var newlines=MAX_NEWLINES; newlines>0; newlines--){
    const paragraphSeparator = NEWLINE.repeat(newlines);
    const paragraphMarker = PARAGRAPH_MARKER.repeat(newlines);
    if(inputData.substring(0,newlines) === paragraphSeparator){
      //console.log("First "+ newlines + " lines were found to be newlines");
      inputData2 = paragraphMarker+" " + inputData.substring(newlines, inputData.length);
      addedNewline = true;
      break;
    }
  }
  var inputData3 = inputData2;
  // If the text ends with newline(s), replace with paragraph marker(s)
  for(newlines=MAX_NEWLINES; newlines>0; newlines--){
    const paragraphSeparator = NEWLINE.repeat(newlines);
    const strToCompare = inputData2.slice(-newlines);
    const paragraphMarker = PARAGRAPH_MARKER.repeat(newlines)+" ";
    if( strToCompare === paragraphSeparator){
      //console.log("Last "+ newlines + " lines were found to be newlines");
      inputData3 =  inputData2.substring(0, (inputData2.length-newlines)) + " "+paragraphMarker;
      addedNewline = true;
      break;
    }
  }
  // Replace repeated occurences of newlines within the input with paragraph markers
  var inputWithParagraphMarkers = inputData3;
  for(newlines=MAX_NEWLINES; newlines>1; newlines--){
    const paragraphSeparator = NEWLINE.repeat(newlines);
    const paragraphMarker = " "+PARAGRAPH_MARKER.repeat(newlines)+" ";
    inputWithParagraphMarkers = inputWithParagraphMarkers.split(paragraphSeparator).join(paragraphMarker);
  }
  return {inputWithParagraphMarkers, addedNewline};
}

function wrapText(inputData){
  const inputWords = inputData.split(/\s+/);
  var charsInRow = 0;
  var wrappedParagraph = "";
  // Add words to row one by one so that we get max ROW_LENGTH worth of charcters
  for(var i=0; i<inputWords.length; i++){
     // Paragraph markers are special case, add corresponding number of newlines
    const nParagraphMarkers = inputWords[i].split(PARAGRAPH_MARKER).length - 1;
    if(nParagraphMarkers > 0 ) {
      wrappedParagraph = wrappedParagraph + NEWLINE.repeat(nParagraphMarkers);
      charsInRow = 0;
    } else {
      //console.log("charsInRow: "+charsInRow);
      //console.log("input word: "+inputWords[i]+", len: "+inputWords[i].length);
      //console.log("wrappedParagraph: "+wrappedParagraph);
      if((charsInRow + inputWords[i].length) < ROW_LENGTH){
        // The word still fits into row
        wrappedParagraph = wrappedParagraph + inputWords[i];
        charsInRow = charsInRow + inputWords[i].length;
        // Add space - or newline if at the end of line, except if this was the last word
        if(i !== (inputWords.length-1)){
          if(charsInRow < ROW_LENGTH){
            wrappedParagraph = wrappedParagraph + " ";
            charsInRow++;
          } else {
            wrappedParagraph = wrappedParagraph + NEWLINE;
            charsInRow = 0;
          }
        }
      } else {
        // The word does not fit into row, move to next line (and remove space from previous line)
        wrappedParagraph = wrappedParagraph.substring(0,wrappedParagraph.length-1) + NEWLINE + inputWords[i] + " ";
        charsInRow = inputWords[i].length + 1; 
      }
    }
  }
  return wrappedParagraph;
}

export function wordWrapTextSimple(inputData, cursorAt){
  // As a starting point, let us use the input before cursor without modifications
  var processedInput = inputData.substring(0,cursorAt);

  // The paragraph before cursor
  var previousParagraphChangeIndex = processedInput.lastIndexOf(NEWLINE+NEWLINE);
  if((previousParagraphChangeIndex === -1) && (processedInput.charAt(0)===NEWLINE)){
    previousParagraphChangeIndex = 1;
  }
  var beginningOfParagraph = previousParagraphChangeIndex !==-1 ?
    processedInput.substring(previousParagraphChangeIndex+2, processedInput.length):
    processedInput.substring(0, processedInput.length);
  // If we pressed enter, we mean that we don't want to include the beginning of the paragraph
  if(inputData.charAt(cursorAt-1)===NEWLINE){
    beginningOfParagraph="";
    previousParagraphChangeIndex=cursorAt;
  }

  const theRest = inputData.substring(cursorAt, inputData.length);

  // The paragraph after cursor
  const nextParagraphChangeIndex = theRest.indexOf(NEWLINE+NEWLINE);
  //console.log("nextParagrapChangeIndex: "+nextParagraphChangeIndex);
  const restOfParagraph = (nextParagraphChangeIndex !==-1) ?
    theRest.substring(0, nextParagraphChangeIndex):
    theRest.substring(0, theRest.length);
  
  //console.log("processedInput: "+processedInput+",length: "+processedInput.length);
  //console.log("cursorAt: "+cursorAt);
  //console.log("charAt cursor-1:".concat("*").concat(inputData.charAt(cursorAt-1)).concat("*"));
  //console.log("theRest: "+theRest);
  //console.log("restOfParagraph: "+restOfParagraph+", length: "+restOfParagraph.length);
  //console.log("beginningOfParagraph: "+beginningOfParagraph+", length: "+beginningOfParagraph.length);
  //console.log("previouschangeindex: "+previousParagraphChangeIndex);
  //console.log("nextparagraphchange: "+nextParagraphChangeIndex);
  
  // No need to do anything if we just added a new newline in the beginning or in between paragraphs
  // The same applies is we add a newline in the end
  if((beginningOfParagraph === NEWLINE) || (beginningOfParagraph === (NEWLINE+NEWLINE)) 
    || (restOfParagraph.length === 0) || (restOfParagraph.charAt(0)===NEWLINE)){
    processedInput = inputData;
    return processedInput;
  }

  // Wrap the words in current paragraph
  const wrappedParagraph = wrapText(beginningOfParagraph+restOfParagraph);
  //console.log("wrappedParagraph:"+wrappedParagraph);
  // Wrapping algorithm has indicated that the word where cursor is was warped

  // Form output
  if(nextParagraphChangeIndex !== -1){
    if(previousParagraphChangeIndex !== 0){
      processedInput = inputData.substring(0, previousParagraphChangeIndex + 2) + wrappedParagraph + 
        inputData.substring(processedInput.length + nextParagraphChangeIndex, inputData.length);
    } else {
      processedInput = inputData.substring(0, previousParagraphChangeIndex) + wrappedParagraph + 
      inputData.substring(processedInput.length + nextParagraphChangeIndex, inputData.length);
    }
  } else {
    if(previousParagraphChangeIndex !== 0){
      processedInput = inputData.substring(0, previousParagraphChangeIndex + 2) + wrappedParagraph;
    } else {
      processedInput = inputData.substring(0, previousParagraphChangeIndex) + wrappedParagraph;
    }
  }
  //console.log("processedInput result: "+processedInput+",length: "+processedInput.length);
  //console.log("inputData len: "+inputData.length);
  //console.log("processedInput len: "+processedInput.length);
  return processedInput;
}


