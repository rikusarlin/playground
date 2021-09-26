import React, { Component } from "react";
import './TextAreaForm.css';

const ROW_LENGTH = 63;
const NEWLINE = "\n";
const MAX_NEWLINES = 10;
const PARAGRAPH_MARKER = "<p>";
// eslint-disable-next-line no-control-regex
const wordSeparatorRegexp = new RegExp('[ \n]');

function wordWrapText(inputData){
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

const rulerText =
  "0_________10________20________30________40________50________60__\n"+
  "0123456789012345678901234567890123456789012345678901234567890123\n";

const textToEdit = 
"Enimmäisasumismenot on määrä, joka yleisestä asumistuesta\n"+
"annetun lain perusteella voidaan ottaa huomioon asumistukea\n"+
"laskettaessa. Enimmäisasumismenoihin vaikuttavat ruokakunnassa\n"+
"asuvien henkilöiden määrä ja asunnon sijaintikunta.\n"+
"\n"+
"Asumismenoiksi ei asumistuessa hyväksytä esimerkiksi sähkö-,\n"+
"sauna- ja autopaikkamaksua eikä internetliittymän maksua.";

class TextAreaOnChange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: textToEdit,
    };
    this.state.textAreaValue = wordWrapText(this.state.textAreaValue);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const inputData = event.target.value;
    const cursorAt = event.target.selectionStart;
    const newlinesInPreviousText = this.state.textAreaValue.split(NEWLINE).length;
    var processedInput = wordWrapText(inputData);
    const newlinesInProcessedInput = processedInput.split(NEWLINE).length;
    this.setState(
      {textAreaValue: processedInput},
      () => {
        event.target.selectionStart = event.target.selectionEnd = 
          cursorAt + newlinesInProcessedInput - newlinesInPreviousText;;
      });
  }

  render() {
    return (
      <textarea
        className="TextArea"
        value={this.state.textAreaValue}
        onChange={this.handleChange}
        cols={ROW_LENGTH}
        rows="8"
        spellCheck="false"
      />
  )};
}

class TextAreaOnBlur extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: wordWrapText(textToEdit),
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange (event) {
    const inputData = event.target.value;
    const cursorAt = event.target.selectionStart;
    this.setState(
      {textAreaValue: inputData},
      () => {
        event.target.setSelectionRange(cursorAt, cursorAt);
      });
  }

  handleBlur(event) {
    const inputData = event.target.value;
    const cursorAt = event.target.selectionStart;
    const newlinesInPreviousText = this.state.textAreaValue.split(NEWLINE).length;
    const processedInput = wordWrapText(inputData);
    const newlinesInProcessedInput = processedInput.split(NEWLINE).length;
    this.setState(
      {textAreaValue: processedInput},
       () => {
         event.target.selectionStart = event.target.selectionEnd = 
          cursorAt + newlinesInProcessedInput - newlinesInPreviousText;;
      });
  }

  render() {
    return (
      <textarea
        className="TextArea"
        value={this.state.textAreaValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        cols={ROW_LENGTH}
        rows="8"
        spellCheck="false"
      />
  )};
}

class TextAreaForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: textToEdit,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({textAreaValue: event.target.value});
  }

  handleSubmit(event) {
    console.log('TextArea3: ' + this.state.textAreaValue);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p/>
        <textarea
          className="TextArea"
          defaultValue={rulerText}
          cols="63"
          rows="2"
          disabled
        />
        <p/>
        <label>Word wrapping with onChange:</label>
        <p/>
        <TextAreaOnChange />
        <p/>
        <label>Word wrapping with onBlur:</label>
        <p/>
        <TextAreaOnBlur />
        <p/>
        <label>Standard textarea:</label>
        <p/>
        <textarea
          className="TextArea"
          value={this.state.textAreaValue}
          onChange={this.handleChange}
          cols={ROW_LENGTH}
          rows="8"
          spellCheck="false"
        />
        <p/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default TextAreaForm;