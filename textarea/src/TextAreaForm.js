import React, { Component } from "react";
import {ROW_LENGTH, textToEdit} from './constants';
import TextAreaOnBlur from './TextAreaOnBlur';
import TextAreaOnChange from './TextAreaOnChange';
import './TextAreaForm.css';

const rulerText =
  "0_________10________20________30________40________50________60__\n"+
  "0123456789012345678901234567890123456789012345678901234567890123\n";

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
        <TextAreaOnChange value={this.textToEdit}/>
        <p/>
        <label>Word wrapping with onBlur:</label>
        <p/>
        <TextAreaOnBlur value={this.textToEdit}/>
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