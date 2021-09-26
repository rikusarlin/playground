import React, { Component } from "react";

class WrappingTextArea extends Component {
  constructor() {
    super();
    this.state = {
      textAreaValue:
      "0_________10________20________30________40________50________60__\n"+
      "0123456789012345678901234567890123456789012345678901234567890123\n"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ textAreaValue: event.target.value });
  }

  render() {
    return (
      <div>
        <textarea
          value={this.state.textAreaValue}
          onChange={this.handleChange}
          cols="63"
          rows="7"
          wrap="hard"
        />
      </div>
    );
  }
}

export default WrappingTextArea;