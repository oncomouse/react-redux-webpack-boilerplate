import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import Button from './Button';
import theme from '../containers/theme';

const NUMBER_OF_BUTTONS = 2;

describe('<Button/>', () => {
  let wrapper;
  let action;
  beforeEach(() => {
    action = sinon.spy();
    wrapper = mount(<div>
      <Button onClick={action} theme={theme}>Click Me</Button>
      <Button onClick={action} theme={theme}>Reset List</Button>
    </div>);// eslint-disable-line react/jsx-closing-tag-location
  });
  it('should render two <Button/>', () => {
    expect(wrapper.find('Button')).to.have.length(NUMBER_OF_BUTTONS);
  });
  it('should respond to being clicked (first button)', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(action.calledOnce).to.be.true;
  });
  it('should respond to being clicked (second button)', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(action.calledOnce).to.be.true;
  });
  it('should contain the proper text', () => {
    expect(wrapper.find('Button').at(0).text()).to.equal('Click Me');
    expect(wrapper.find('Button').at(1).text()).to.equal('Reset List');
  });
});