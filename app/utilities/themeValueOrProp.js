const themeValueOrProp = (themeKey, prop) => props =>
  props.theme[themeKey][props[prop]] || props[prop];
export default themeValueOrProp;
