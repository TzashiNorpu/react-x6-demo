import React from "react";
import { Cell, Dom, Graph } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { Stencil } from "@antv/x6-plugin-stencil";
import styled from "@emotion/styled";
import { Transform } from "@antv/x6-plugin-transform";
import { Clipboard } from "@antv/x6-plugin-clipboard";
import { Selection } from "@antv/x6-plugin-selection";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { History } from "@antv/x6-plugin-history";
import { Scroller } from "@antv/x6-plugin-scroller";

import "./index.less";
import { ToolBox } from "./toolbox";
import { message } from "antd";
const commonAttrs = {
  body: {
    fill: "#fff",
    stroke: "#8f8f8f",
    strokeWidth: 1,
  },
};

interface Props {}

interface State {
  canUndo: boolean;
  canRedo: boolean;
}

export default class X6_Flow extends React.Component<Props, State> {
  private container: HTMLDivElement | null = null;
  private stencilContainer: HTMLDivElement | null = null;
  private graph: Graph | null = null;
  private embedPadding = 10;
  private ctrlPressed = false;
  private copyOptions = {
    offset: 10,
    useLocalStorage: true,
  };
  private resizingOptions: {
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

  private rotatingOptions: {
    enabled: true;
    grid?: number;
  } = { enabled: true, grid: 10 };

  state: State = {
    canRedo: false,
    canUndo: false,
  };

  private padding = {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  };

  private count = 0;

  componentDidMount() {
    if (this.container == null) {
      message.error("初始化错误");
      return;
    }

    const graph = new Graph({
      container: this.container,
      background: {
        color: "#F2F7FA",
      },
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
      },
      scaling: {
        min: 0.05, // 默认值为 0.01
        max: 12, // 默认值为 16
      },
      embedding: {
        enabled: true,
        // findParent({ node }) {
        //   const bbox = node.getBBox();
        //   return this.getNodes().filter((item) => {
        //     const data = item.getData<{ parent: boolean }>();
        //     if (data && data.parent) {
        //       const targetBBox = item.getBBox();
        //       const tt = bbox.isIntersectWithRect(targetBBox);
        //       console.log("find", tt);
        //       return tt;
        //     }
        //     return false;
        //   });
        // },
      },
    });
    this.graph = graph;

    if (this.graph == undefined || this.graph == null) {
      message.error("初始化错误");
      return;
    }

    this.graph.use(
      new Selection({
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        showEdgeSelectionBox: true,
      })
    );

    this.graph.use(
      new Clipboard({
        enabled: true,
        // useLocalStorage: true,
      })
    );
    this.graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      })
    );

    this.graph.use(
      new Keyboard({
        enabled: true,
        global: true,
      })
    );

    this.graph.use(
      new Transform({
        resizing: this.resizingOptions,
        rotating: this.rotatingOptions,
      })
    );

    this.graph.use(
      new History({
        enabled: true,
      })
    );

    this.graph.use(
      new Scroller({
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
      })
    );

    this.graph.on("history:change", () => {
      if (this.graph == null) {
        message.error("初始化错误");
        return;
      }
      this.setState({
        canRedo: this.graph.canRedo(),
        canUndo: this.graph.canUndo(),
      });
    });

    this.graph.on("node:change:parent", ({ node }) => {
      console.log("---");
      node.attr({
        label: {
          text: `Child\n(embed)-${this.count++}`,
        },
      });
    });

    graph.on("node:embedding", ({ e }: { e: Dom.MouseMoveEvent }) => {
      this.ctrlPressed = e.metaKey || e.ctrlKey;
    });

    graph.on("node:embedded", () => {
      this.ctrlPressed = false;
    });

    graph.on("node:change:size", ({ node, options }) => {
      if (options.skipParentHandler) {
        return;
      }

      const children = node.getChildren();
      if (children && children.length) {
        node.prop("originSize", node.getSize());
      }
    });

    graph.on("node:change:position", ({ node, options }) => {
      if (options.skipParentHandler || this.ctrlPressed) {
        return;
      }

      const children = node.getChildren();
      if (children && children.length) {
        node.prop("originPosition", node.getPosition());
      }

      const parent = node.getParent();
      if (parent && parent.isNode()) {
        let originSize = parent.prop("originSize");
        if (originSize == null) {
          originSize = parent.getSize();
          parent.prop("originSize", originSize);
        }

        let originPosition = parent.prop("originPosition");
        if (originPosition == null) {
          originPosition = parent.getPosition();
          parent.prop("originPosition", originPosition);
        }

        let x = originPosition.x;
        let y = originPosition.y;
        let cornerX = originPosition.x + originSize.width;
        let cornerY = originPosition.y + originSize.height;
        let hasChange = false;

        const children = parent.getChildren();
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding);
            const corner = bbox.getCorner();

            if (bbox.x < x) {
              x = bbox.x;
              hasChange = true;
            }

            if (bbox.y < y) {
              y = bbox.y;
              hasChange = true;
            }

            if (corner.x > cornerX) {
              cornerX = corner.x;
              hasChange = true;
            }

            if (corner.y > cornerY) {
              cornerY = corner.y;
              hasChange = true;
            }
          });
        }
        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the `originPosition` and `originSize` in our handlers.
            { skipParentHandler: true }
          );
        }
      }
    });

    this.graph.centerContent();

    // ctrl+c ctrl+v
    this.graph.bindKey("ctrl+c", () => {
      if (this.graph == null) return;
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        cells.forEach((cell) => {
          const descendants = cell.getDescendants();
          console.log("des", descendants);
          cells.push(...descendants);
        });
        this.graph.copy(cells);
      }
      return false;
    });

    this.graph.bindKey("ctrl+v", () => {
      if (this.graph == null) return;
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste(this.copyOptions);
        this.graph.cleanSelection();
        this.graph.select(cells);
      }
      return false;
    });

    this.graph.bindKey("ctrl+z", () => {
      if (this.graph == null) return;
      this.graph.undo();
      return false;
    });

    this.graph.bindKey("delete", () => {
      if (this.graph == null) return;
      const cells = this.graph.getSelectedCells();
      cells.map((cell) => cell.remove());
    });

    const stencil = new Stencil({
      title: "Components",
      target: this.graph,
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
        {
          name: "group3",
          title: "Group",
          collapsable: false,
        },
      ],
    });

    if (this.stencilContainer != undefined)
      this.stencilContainer.appendChild(stencil.container);

    const n1 = this.graph.createNode({
      shape: "rect",
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: "rect",
      attrs: commonAttrs,
    });

    const n2 = this.graph.createNode({
      shape: "circle",
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: "circle",
      attrs: commonAttrs,
    });

    const n3 = this.graph.createNode({
      shape: "ellipse",
      x: 280,
      y: 40,
      width: 80,
      height: 40,
      label: "ellipse",
      attrs: commonAttrs,
    });

    const n4 = this.graph.createNode({
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

    Graph.registerNode(
      "custom-node",
      {
        inherit: "rect",
        width: 100,
        height: 40,
        attrs: {
          body: {
            stroke: "#8f8f8f",
            strokeWidth: 1,
            fill: "#fff",
            rx: 6,
            ry: 6,
          },
        },
      },
      true
    );

    const child = graph.createNode({
      shape: "custom-node",
      x: 40,
      y: 160,
      width: 80,
      height: 40,
      label: "Child\n(unembed)",
    });

    const parent = graph.createNode({
      shape: "custom-node",
      x: 200,
      y: 80,
      width: 100,
      height: 60,
      label: "Parent",
      data: {
        parent: true,
      },
    });

    stencil.load([n1, n2], "group1");
    stencil.load([n3, n4], "group2");
    stencil.load([child, parent], "group3");
    this.graph = graph;
  }
  // copy
  private onCopy = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    const cells = this.graph.getSelectedCells();
    if (cells && cells.length) {
      this.graph.copy(cells, this.copyOptions);
      message.success("复制成功");
    } else {
      message.info("请先选中节点再复制");
    }
  };

  // paste
  private onPaste = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    if (this.graph.isClipboardEmpty()) {
      message.info("剪切板为空，不可粘贴");
    } else {
      const cells = this.graph.paste(this.copyOptions);
      this.graph.cleanSelection();
      this.graph.select(cells);
      message.success("粘贴成功");
    }
  };

  // redo undo
  onUndo = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    this.graph.undo();
  };

  onRedo = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    this.graph.redo();
  };

  onGraphCenter = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    this.graph.center();
  };

  onContentCenter = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    this.graph.centerContent();
    this.graph.zoomToFit({
      padding: this.padding,
    });
  };
  onToBack = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    const cells = this.graph.getSelectedCells();
    if (cells && cells.length) {
      cells.map((cell) => cell.toBack());
    } else {
      message.info("请先选中节点再调整");
    }
  };
  onToFront = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    const cells = this.graph.getSelectedCells();
    if (cells && cells.length) {
      cells.map((cell) => cell.toFront());
    } else {
      message.info("请先选中节点再调整");
    }
  };

  onZoomIn = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    const zoom = this.graph.zoom();
    this.graph.zoomTo(zoom - 0.1);
  };

  onZoomOut = () => {
    if (this.graph == null) {
      message.error("发生错误");
      return;
    }
    const zoom = this.graph.zoom();
    this.graph.zoomTo(zoom + 0.1);
  };

  onDelete = () => {
    if (this.graph == null) return;
    const cells = this.graph.getSelectedCells();
    cells.map((cell) => cell.remove());
  };

  onGroup = () => {
    if (this.graph == null) return;
    const parent = this.graph.addNode({
      shape: "rect",
      zIndex: -100,
      x: 40,
      y: 40,
      width: 360,
      height: 160,
    });
    const cells = this.graph.getSelectedCells();
    cells.forEach((cell) => {
      parent.addChild(cell);
    });
    parent.fit({
      padding: this.padding,
    });
  };

  onUnGroup = () => {
    if (this.graph == null) return;
    const cells = this.graph.getSelectedCells();
    const copy: Cell[] = [];
    cells.forEach((cell) => {
      console.log("cell", cell);
      cell.getChildren()?.forEach((x) => {
        console.log("child", x);
        cell.removeChild(x);
        copy.push(x);
      });
      // this.graph?.removeCell(cell);
    });

    console.log("copy", copy);
    copy.forEach((child) => this.graph?.addCell(child));
  };

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
          <ToolBox
            onCopy={this.onCopy}
            onPaste={this.onPaste}
            onRedo={this.onRedo}
            onUndo={this.onUndo}
            onGraphCenter={this.onGraphCenter}
            onContentCenter={this.onContentCenter}
            onToFront={this.onToFront}
            onToBack={this.onToBack}
            onZoomOut={this.onZoomOut}
            onZoomIn={this.onZoomIn}
            onDelete={this.onDelete}
            redoDisable={!this.state.canRedo}
            undoDisable={!this.state.canUndo}
            onGroup={this.onGroup}
            onUnGroup={this.onUnGroup}
          />
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
