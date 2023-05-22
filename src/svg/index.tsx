import {FC} from 'react';
import './index.less';
import {IconType} from './iconfont_util';

function dragStart(e:React.DragEvent,name:string,font_class:string,unicode:string) {
    const {  clientWidth, clientHeight } = e.target as HTMLDivElement;
    console.log(clientWidth);
    console.log(clientHeight);
    
    e.dataTransfer.setData('dataSource',JSON.stringify({
      name,
      font_class,
      unicode,
      width:clientWidth,
      height:clientHeight,
}))}

const SvgIcon: FC<IconType> = (props) => {

    const {name,font_class,unicode} = props;
    console.log(props);
    

    /* return (
        <i draggable aria-hidden='true'  onDragStart={e=>dragStart(e,svgName,unicode,icon_name)} >
            <svg className={`svg-class ${svgClass?svgClass:''}`}>
                <use xlinkHref={'#icon-' + svgName}/>
            </svg>
        </i>
    ); */
    return (
        <i draggable aria-hidden='true'  onDragStart={e=>dragStart(e,name,font_class,unicode)} >
            <span className={`iconfont icon-${font_class}`}></span>
        </i>
    );
};

export default SvgIcon;
