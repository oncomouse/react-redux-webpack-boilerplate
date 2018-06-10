import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Element = styled.button`
  background: ${props => props.color};
  border: 1px solid ${props => props.backgroundColor};
  color: ${props => props.backgroundColor};
  padding: 10px 30px;
  margin: 0 10px;
  outline: none;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    color: ${props => props.color};
    background-color: ${props => props.backgroundColor};
  }
`

const Button = ({ action, children, color, backgroundColor }) => (
  <Element color={color} backgroundColor={backgroundColor} onClick={action}>
    {children}
  </Element>);
Button.propTypes = {
  action: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  color: PropTypes.string,
};
Button.defaultProps = {
  backgroundColor: '#673AB7',
  color: '#FFF',
};
Button.displayName = 'Button';

export default Button;
