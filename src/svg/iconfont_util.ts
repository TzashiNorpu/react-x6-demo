import fonts from './iconfont.json';

export interface IconType{
  name: string,
  'font_class':string,
  unicode: string,
}

const icons = fonts.glyphs.map((icon) => {
  return {
    name: icon.name,
    'font_class':icon.font_class,
    unicode: String.fromCodePoint(icon.unicode_decimal), // `\\u${icon.unicode}`,
  };
});
/* const getIcon = (type: string) => {
  const matchIcon = icons.find((icon) => {
    return icon.font_class === type;
  }) || {unicode: '', name: 'default'};
  return matchIcon.unicode;
}; */

const getIconByClass = (font_class:string):IconType=>{
  const matchIcon = icons.find((icon) => {
    return icon.font_class === font_class;
  }) || {unicode: '', 'font_class':'',name: 'default'};
  return matchIcon;
}

export {getIconByClass};