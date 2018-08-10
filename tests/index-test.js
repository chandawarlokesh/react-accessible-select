import expect from 'expect'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'

import Component from 'src/'

const options = [
  {
    value: "",
    label: "-select-"
  },
  {
    value: "volvo",
    label: "volvo"
  }
];

describe('Component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<Component label="Select Options" options={options}/>, node, () => {
      expect(node.innerHTML).toContain('Select Options')
    })
  })
})
