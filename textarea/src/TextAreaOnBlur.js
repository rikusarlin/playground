import React, { Component } from "react";
import {ROW_LENGTH, NEWLINE, textToEdit} from './constants';
import {wordWrapText} from './utils'
import './TextAreaForm.css';

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

export default TextAreaOnBlur;
  