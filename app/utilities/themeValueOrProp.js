import { path } from 'ramda';
const themeValueOrProp = (themeKey, prop) => props =>
  path(
    ['theme', ...themeKey.split('.'), props[prop]],
    props
  ) || props[prop];
export default themeValueOrProp;
