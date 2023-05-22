import styled from "@emotion/styled";
import SvgIcon from "../../../svg";
import { Collapse } from 'antd';
import {getIconByClass} from "../../../svg/iconfont_util";


export const Stencil = () => {
  const { Panel } = Collapse;
  const stencils = [
    {id:1,class:'rectangle'},
    {id:2,class:'rounded-rectangle'},
    {id:3,class:'circle'},
    {id:4,class:'parallelogram'},
    {id:5,class:'triangle'},
    {id:6,class:'diamond'},
    {id:7,class:'trapezoid'},
    {id:8,class:'pentagram'},
    {id:9,class:'left-arrow'},
    {id:10,class:'right-arrow'},
  ];
  
  return (
    <Collapse size ={"small"} ghost={true} defaultActiveKey={['1']} >
      <Panel header="基础图标" key="1">
        <Container>
          {
            stencils.map(item=><SvgIcon key={item.id} {...getIconByClass(item.class)} />)
          }
        </Container>
      </Panel>
      <Panel header="软件图标" key="2">
        <Container>
        </Container>
      </Panel>
    </Collapse>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

