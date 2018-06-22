import { path } from 'ramda';
/*
  Returns the theme value stored at `themeKey` named in the prop `prop` OR return the value of the
  prop `prop`
 */
const themeValueOrProp = (themeKey, prop) => props =>
  path(
    ['theme', ...themeKey.split('.'), props[prop]],
    props,
  ) || props[prop];
export default themeValueOrProp;
