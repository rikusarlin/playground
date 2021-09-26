import React, { Component } from "react";
import {ROW_LENGTH, NEWLINE, textToEdit} from './constants';
import {wordWrapText} from './utils'
import './TextAreaForm.css';

class TextAreaOnChange extends Component {
    constructor(props) {
      super(props);
      this.state = {
        textAreaValue: wordWrapText(textToEdit),
      };
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

  export default TextAreaOnChange;
  