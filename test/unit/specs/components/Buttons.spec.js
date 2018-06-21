import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import Button from 'APP/components/Button';

describe('<Button/>', () => {
  let wrapper;
  const action = sinon.spy();
  afterEach(() => {
    action.resetHistory();
  });
  beforeEach(() => {
    wrapper = mount(<div>
      <Button action={action}>Click Me</Button>
    </div>); // eslint-disable-line react/jsx-closing-tag-location
  });
  it('should render one <Button/>', () => {
    expect(wrapper.find('Button')).to.have.length(1);
  });
  it('should respond to being clicked', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(action.calledOnce).to.be.true;
  });
  it('should contain the proper text', () => {
    expect(wrapper.find('Button').at(0).text()).to.equal('Click Me');
  });
});
