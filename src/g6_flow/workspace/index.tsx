import styled from "@emotion/styled";
import {Stencil} from "./stencil";
import {Canvas} from "./canvas";
import {SideBar} from "./sidebar";
import React, { useEffect } from "react";
import G6,{ Graph, Item } from "@antv/g6";
import {Minimap} from "@antv/g6-plugin";
import {getIconByClass} from "../../svg/iconfont_util";



export const Workspace = () => {

  const canvasRef = React.useRef(null)
  const miniMapRef = React.useRef(null)
  let graph :Graph ;
  let minimap: Minimap ;

  useEffect(() => {
    if(!graph) {
      // 实例化 Minimap
      if(miniMapRef.current!=null){
        minimap = new G6.Minimap({
          size:[(miniMapRef.current as HTMLDivElement).clientWidth,(miniMapRef.current as HTMLDivElement).clientHeight],
          container:miniMapRef.current,
        });
      }
      
      
      // 实例化 Graph
      if(canvasRef.current!=null){
        const grid = new G6.Grid();

        graph = new G6.Graph({
          container: canvasRef.current,
          width: (canvasRef.current as HTMLDivElement).clientWidth,
          height: (canvasRef.current as HTMLDivElement).clientHeight,
          plugins: [grid,minimap],
          fitView:true,
          defaultNode: {
            type:  'rect',
            style: {
              width:  60,
              height: 30,
              radius: 4,
              fill:   '#fff',
              stroke: '#ccc',
            },
            labelCfg: {
              style: {
                fontSize: 14,
              },
            },
          },
          modes: {
            default: [
              'drag-canvas',
              'zoom-canvas',
              'drag-node'
            ]
          },
        });
    }
  }
    
    graph.render();
   

    graph.on('node:mouseenter', evt => {
      if(evt.item!=null)
        graph.setItemState(evt.item, 'hover', true)
    })

    graph.on('node:mouseleave', evt => {
      if(evt.item!=null)
        graph.setItemState(evt.item, 'hover', false)
    })

    graph.on('edge:mouseenter', evt => {
      if(evt.item!=null)
        graph.setItemState(evt.item, 'hover', true)
    })

    graph.on('edge:mouseleave', evt => {
      if(evt.item!=null)
        graph.setItemState(evt.item, 'hover', false)
    })

    

    graph.on('drop', evt => {
      evt.stopPropagation();
      const {clientX, clientY,originalEvent} = evt;
      const e =originalEvent as DragEvent;
      if (e.dataTransfer) {
        const data = e.dataTransfer.getData('dataSource');
        if(data){
          const {width, height,name,font_class} = JSON.parse(data);

          e.dataTransfer.clearData();
            
          const node = graph.addItem('node', {
            x:     clientX-148,
            y:     clientY-25,
            style: {
              width,
              height,
              strokeOpacity: 0.5,
            },
          }) as Item;

          const group = node.getContainer();
          
          const icon=group.addShape('text', {
            attrs: {
              fontFamily: 'iconfont',
              text:       getIconByClass(font_class).unicode,
              fill:       'black',
              fontSize:   16, 
              textAlign: 'center',
              textBaseline: 'middle',
            },
            name,
            draggable: true,
          });
          setTimeout(() => {
            icon.attr({ });
          },0);
      }}
    })

  }, [])
 
  return (
    <>
    <WorkspaceWrapper>
      <StencilWrapper>
        <Stencil/>
      </StencilWrapper>
      <CanvasWrapper>
        <Canvas ref={canvasRef}/>
      </CanvasWrapper>
      <SidebarWrapper>
        <SideBar ref={miniMapRef}/>
      </SidebarWrapper>
    </WorkspaceWrapper>
    </>
  );
};

const WorkspaceWrapper = styled.div`
  display: grid;
  grid-template-columns: 15rem 1fr 20rem;
  grid-template-areas: "stencil canvas sidebar";
  height:100%;
`;

const StencilWrapper = styled.div`
  grid-area: stencil;
`;

const CanvasWrapper = styled.div`
  grid-area: canvas;
`;


const SidebarWrapper = styled.div`
  grid-area: sidebar;
`;



