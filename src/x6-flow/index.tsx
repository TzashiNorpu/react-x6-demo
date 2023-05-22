import React from "react";
import { Graph } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { Stencil } from "@antv/x6-plugin-stencil";
import styled from "@emotion/styled";
import { Transform } from "@antv/x6-plugin-transform";
import { Clipboard } from "@antv/x6-plugin-clipboard";
import { Selection } from '@antv/x6-plugin-selection'

import "./index.less";
import { ToolBox } from "./toolbox";
const commonAttrs = {
  body: {
    fill: "#fff",
    stroke: "#8f8f8f",
    strokeWidth: 1,
  },
};

export default class X6_Flow extends React.Component {
  private container: HTMLDivElement | undefined;
  private stencilContainer: HTMLDivElement | undefined;

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: "#F2F7FA",
      },
    });


    graph.use(
      new Selection({
        enabled: true,
        showNodeSelectionBox: true,
      })
    );

    graph.use(
      new Clipboard({
        enabled: true,
        useLocalStorage: true,
      })
    );
    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      })
    );

    const resizingOptions: {
      enabled: true;
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
      orthogonal?: boolean;
      restrict?: boolean;
      preserveAspectRatio?: boolean;
    } = {
      enabled: true,
      minWidth: 1,
      maxWidth: 200,
      minHeight: 1,
      maxHeight: 150,
      orthogonal: false,
      restrict: false,
      preserveAspectRatio: false,
    };

    const rotatingOptions: {
      enabled: true;
      grid?: number;
    } = { enabled: true, grid: 10 };

    graph.use(
      new Transform({
        resizing: resizingOptions,
        rotating: rotatingOptions,
      })
    );



    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      label: "Hello",
      attrs: {
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    });

    const target = graph.addNode({
      x: 320,
      y: 240,
      width: 100,
      height: 40,
      label: "World",
      attrs: {
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    });

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
        },
      },
    });

    graph.centerContent();

    const stencil = new Stencil({
      title: "Components",
      target: graph,
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1;
      },
      placeholder: "Search by shape name",
      notFoundText: "Not Found",
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 100,
      groups: [
        {
          name: "group1",
          title: "Group(Collapsable)",
        },
        {
          name: "group2",
          title: "Group",
          collapsable: false,
        },
      ],
    });

    if (this.stencilContainer != undefined)
      this.stencilContainer.appendChild(stencil.container);

    const n1 = graph.createNode({
      shape: "rect",
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: "rect",
      attrs: commonAttrs,
    });

    const n2 = graph.createNode({
      shape: "circle",
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: "circle",
      attrs: commonAttrs,
    });

    const n3 = graph.createNode({
      shape: "ellipse",
      x: 280,
      y: 40,
      width: 80,
      height: 40,
      label: "ellipse",
      attrs: commonAttrs,
    });

    const n4 = graph.createNode({
      shape: "path",
      x: 420,
      y: 40,
      width: 40,
      height: 40,
      // https://www.svgrepo.com/svg/13653/like
      path: "M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z",
      attrs: commonAttrs,
      label: "path",
    });

    stencil.load([n1, n2], "group1");
    stencil.load([n3, n4], "group2");
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };

  render() {
    return (
      <WorkspaceWrapper className="resizing-app">
        <ToolboxWrapper>
          <ToolBox />
        </ToolboxWrapper>
        <StencilWrapper ref={this.refStencil} />
        <CanvasWrapper ref={this.refContainer} />
      </WorkspaceWrapper>
    );
  }
}

const WorkspaceWrapper = styled.div`
  display: grid;
  padding: 0;
  grid-template-columns: 30rem 1fr 20rem;
  grid-template-rows: 6rem 1fr 5rem;
  grid-template-areas:
    "toolbox toolbox toolbox"
    "stencil canvas sidebar"
    "footer footer footer";
  height: 100%;
`;

const StencilWrapper = styled.div`
  grid-area: stencil;
  position: relative;
  border: 1px solid #f0f0f0;
`;

const CanvasWrapper = styled.div`
  grid-area: canvas;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
`;

const SidebarWrapper = styled.div`
  grid-area: sidebar;
`;

const FooterWrapper = styled.div`
  grid-area: footer;
`;

const ToolboxWrapper = styled.div`
  grid-area: toolbox;
  display: flex;
  align-items: center;
  flex-direction: row;
`;
