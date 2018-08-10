import React, { Component } from "react";
import { render } from "react-dom";

import Example from "../../src";

const options = [
  {
    value: "",
    label: "-select-"
  },
  {
    value: "volvo",
    label: "volvo"
  },
  {
    value: "mercedes",
    label: "mercedes"
  },
  {
    value: "audi",
    label: "audi"
  }
];

class Demo extends Component {
  render() {
    return (
      <main style={{ width: 640, margin: "15px auto" }}>
        <h1>react-accessible-select Demo</h1>
        <Example label="Select Options" options={options} />
      </main>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
