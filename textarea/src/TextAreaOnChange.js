import React, { Component } from "react";
import {ROW_LENGTH, NEWLINE, textToEdit} from './constants';
import {wordWrapText} from './utils'
import debounce from 'lodash.debounce';
import './TextAreaForm.css';

class TextAreaOnChange extends Component {
  constructor(props) {
      super(props);
      this.state = {
        textAreaValue: "",
      };
      var processedInput = wordWrapText(textToEdit,0);
      this.state.textAreaValue = processedInput;
      this.handleInputChange = this.handleInputChange.bind(this);
      // Delay action 500 msec
      this.onChangeDelayed = debounce(this.onChangeDelayed, 500)
    }

    handleInputChange = (event) => {
      this.setState(
        {textAreaValue: event.target.value}
      );
      // Execute the debounced onChange method
      this.onChangeDelayed(event);
    }
  
    onChangeDelayed = (event) => {
      const inputData = event.target.value;
      const cursorAt = event.target.selectionStart;
      var processedInput = wordWrapText(inputData, cursorAt);
      this.setState(
        {textAreaValue: processedInput},
        () => {
          event.target.selectionStart = event.target.selectionEnd = cursorAt;
        }
      );
    }
  
    render() {
      return (
        <textarea
          className="TextArea"
          value={this.state.textAreaValue}
          onChange={this.handleInputChange}
          cols={ROW_LENGTH}
          rows={this.state.textAreaValue.split(NEWLINE).length}
          spellCheck="false"
        />
    )};
  }

  export default TextAreaOnChange;
  