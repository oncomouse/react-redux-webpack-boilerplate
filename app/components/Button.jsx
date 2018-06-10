import PropTypes from 'prop-types';
import styled from 'styled-components';
import { color, space, themeGet } from 'styled-system';
import themeValueOrProp from '../utilities/themeValueOrProp';

const Button = styled.button`
  ${color};
  ${space};
  border: 1px solid ${themeValueOrProp('colors', 'color')};
  border-radius: ${themeGet('space.1')}px;
  cursor: pointer;
  outline: none;

  &:hover {
    background-color: ${themeValueOrProp('colors', 'color')};
    color: ${themeValueOrProp('colors', 'bg')};
  }
`;
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  ...color.propTypes,
  ...space.propTypes,
};
Button.defaultProps = {
  color: 'buttonColor',
  bg: 'buttonBgColor',
  my: 0,
  mx: 2,
  py: 2,
  px: 4,
};
Button.displayName = 'Button';

export default Button;
