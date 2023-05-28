import React, { useState } from "react";
import { Color, Dom, Graph, Model, Node } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { Stencil } from "@antv/x6-plugin-stencil";
import styled from "@emotion/styled";
import { Transform } from "@antv/x6-plugin-transform";
import { Clipboard } from "@antv/x6-plugin-clipboard";
import { Selection } from "@antv/x6-plugin-selection";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { History } from "@antv/x6-plugin-history";
import { Scroller } from "@antv/x6-plugin-scroller";
import { Export } from "@antv/x6-plugin-export";
import { saveAs } from "file-saver";
import "./index.less";
import { ToolBox } from "./toolbox";
import { UploadProps, message } from "antd";
import { GraphState } from "./side/graph-setting";
import { SettingPanel } from "./side";
import { nodeState } from './config/nodeState'
import { gridState } from './config/gridState'
import './stencil/app-node'
import { NodeState } from "./side/node-setting";

let currNodeState: NodeState = {};
let currNodes: Node[] = [];

const commonAttrs = {
  body: { ...nodeState },
};
interface State {
  settingType: string;
  canUndo: boolean;
  canRedo: boolean;
  gridState: GraphState;
  nodeState: NodeState
}

interface Props { }

type ConnectState = {
  allowBlank: boolean;
  allowMulti: boolean;
  allowLoop: boolean;
  allowNode: boolean;
  allowEdge: boolean;
  allowPort: boolean;
};

const connectState: ConnectState = {
  allowBlank: false,
  allowMulti: true,
  allowLoop: true,
  allowNode: true,
  allowEdge: true,
  allowPort: true,
};



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
    settingType: "",
    canRedo: false,
    canUndo: false,
    gridState: {
      ...gridState
    },
    nodeState: {
      ...nodeState
    }
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
      grid: this.state.gridState,
      connecting: {
        ...connectState,
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: "#8f8f8f",
                strokeWidth: 1,
              },
            },
            tools: [
              {
                name: "edge-editor",
                args: {
                  attrs: {
                    backgroundColor: "#fff",
                  },
                },
              },
            ],
          });
        },
        validateConnection({ targetCell }) {
          if (targetCell?.isNode()) {
            const ports = (targetCell as Node).getPorts();
            ports.forEach((port) => {
              (targetCell as Node).portProp(
                port.id!,
                "attrs/circle/display",
                "inline"
              );
            });
          }
          return true;
        },
        allowNode(args) {
          return true;
        },
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
        // showNodeSelectionBox: true,
        // showEdgeSelectionBox: true,
      })
    );

    graph.use(new Export());

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
        // pannable: true,
      })
    );

    this.graph.on("history:change", () => {
      if (this.graph == null) {
        message.error("初始化错误");
        return;
      }
      this.setState({
        ...this.state,
        canRedo: this.graph.canRedo(),
        canUndo: this.graph.canUndo(),
      });
    });

    this.graph.on("node:change:parent", ({ node }) => {
      node.attr({
        label: {
          text: `Child\n(embed)-${this.count++}`,
        },
      });
    });

    graph.on("node:click", () => {

      // 
      const cells = this.graph?.getSelectedCells() as Node[];
      currNodes = cells;
      const cell = cells![0];
      const width = (cell as Node).size().width;
      const height = (cell as Node).size().height;
      const attrs = cell?.getAttrs();
      const fill = attrs!['body']['fill'];
      const stroke = attrs!['body']['stroke'];
      const strokeWidth = attrs!['body']['strokeWidth'];
      const strokeDasharray = attrs!['body']['strokeDasharray'];
      // currNodeState.width = width;
      // currNodeState.height = height;
      currNodeState.fill = fill as string;
      currNodeState.stroke = stroke as string;
      currNodeState.strokeWidth = strokeWidth as number;
      currNodeState.strokeDasharray = strokeDasharray as string;

      this.setState({
        ...this.state,
        settingType: "Node",
        nodeState: { ...currNodeState }
      });

    });

    graph.on("edge:click", () => {
      this.setState({
        ...this.state,
        settingType: "Edge",
      });

    });

    graph.on("node:embedding", ({ e }: { e: Dom.MouseMoveEvent }) => {
      this.ctrlPressed = e.metaKey || e.ctrlKey;
    });

    graph.on("node:mouseenter", ({ e, node }) => {
      const ports = node.getPorts();
      ports.forEach((port) => {
        node.portProp(port.id!, "attrs/circle/display", "inline");
      });
    });

    graph.on("blank:click", () => {
      const myGridState: GraphState = {
        ...(this.graph?.grid.grid)
      }
      this.setState({
        ...this.state,
        settingType: "Graph",
        ...myGridState
      });

      // this.graph?.grid.grid = myGridState;
    });

    graph.on("node:mouseleave", ({ node }) => {
      const ports = node.getPorts();
      ports.forEach((port) => {
        node.portProp(port.id!, "attrs/circle/display", "none");
      });
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

    this.graph.center();

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
        this.graph.select(cells);
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
      getDragNode(node) {
        // 这里返回一个新的节点作为拖拽节点
        const clone = node.clone();
        clone.addPorts([
          {
            id: "port1",
            group: "top",
          },
          {
            id: "port2",
            group: "right",
          },
          {
            id: "port3",
            group: "bottom",
          },
          {
            id: "port4",
            group: "left",
          },
        ]);
        clone.getPorts().forEach((port) => {
          clone.portProp(port.id!, "attrs/circle/display", "none");
        });
        return clone;
      },
      stencilGraphWidth: 200,
      stencilGraphHeight: 100,
      groups: [
        {
          name: "group1",
          title: "Group(Collapsable)",
        },
      ],
    });

    if (this.stencilContainer != undefined)
      this.stencilContainer.appendChild(stencil.container);

    const n1 = this.graph.createNode({
      shape: "app-react-node",
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      label: "rect",
      // markup: [
      //   {
      //     tagName: 'rect', // 标签名称
      //     selector: 'body', // 选择器
      //   },
      // ],
      attrs: commonAttrs,
      tools: [
        {
          name: "node-editor",
          args: {
            attrs: {
              backgroundColor: "#EFF4FF",
            },
          },
        },
      ],
      ports: {
        groups: {
          top: {
            position: "top",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
        },
      },
    });

    const n2 = this.graph.createNode({
      shape: "circle",
      x: 180,
      y: 40,
      width: 40,
      height: 40,
      label: "circle",
      attrs: commonAttrs,
      tools: [
        {
          name: "node-editor",
          args: {
            attrs: {
              backgroundColor: "#EFF4FF",
            },
          },
        },
      ],
      ports: {
        groups: {
          top: {
            position: "top",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          right: {
            position: "right",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          bottom: {
            position: "bottom",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
          left: {
            position: "left",
            attrs: {
              circle: {
                magnet: true,
                stroke: "#8f8f8f",
                r: 5,
              },
            },
          },
        },
      },
    });

    stencil.load([n1, n2], "group1");
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
    cells.forEach((cell) => {
      const descendants = cell.getDescendants();
      descendants.forEach((descendant) => {
        descendant.removeFromParent();
      });
      this.graph?.copy(descendants);
      this.graph?.paste(this.copyOptions);
    });
  };

  jpegOption: Export.ToImageOptions = {
    width: 1000,
    height: 1000,
    padding: 10,
    quality: 1,
  };

  private onExportJPEG = () => {
    this.graph?.exportJPEG("demo.jpeg", this.jpegOption);
  };

  jsonOptions: Model.ToJSONOptions = {};

  private onExportJson = () => {
    const fileData = JSON.stringify(this.graph?.toJSON(), null, 2);

    const file = new File([fileData], "demo.json", {
      type: "text/plain;charset=utf-8",
    });
    saveAs(file);
  };

  uploadProps: UploadProps = {
    name: "file",
    beforeUpload: (file) => {
      file.text().then((res) => {
        if (this.graph == null) {
          message.error("发生错误");
        }
        const xxx = JSON.parse(res);
        console.log('xxx', xxx);

        this.graph?.fromJSON(xxx);
      });
    },
    customRequest: () => {
      this.graph?.clearCells();
      return true;
    },
    showUploadList: false,
    multiple: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  onGridChanged = (options: any) => {
    this.graph?.drawGrid(options);
  };

  onGridSizeChanged = (size: number) => {
    this.graph?.setGridSize(size);
  };

  onNodeChange = (obj: any) => {
    const currNodes = (this.graph?.getSelectedCells() as Node[]);
    currNodes.forEach((node) => {
      node.attr('body/' + obj.k, obj.v);
    })
    // 
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };

  render() {
    return (
      <WorkspaceWrapper className="resizing-app selection-app react-shape-app">
        <ToolboxWrapper>
          <ToolBox
            uploadProps={this.uploadProps}
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
            onExportJPEG={this.onExportJPEG}
            onExportJson={this.onExportJson}
          // onImportJson={this.onImportJson}
          />
        </ToolboxWrapper>
        <StencilWrapper ref={this.refStencil} />

        <CanvasWrapper className="app-content" ref={this.refContainer} />
        <SidebarWrapper>
          <SettingPanel
            type={this.state.settingType}
            graphProps={{
              onGridSizeChange: this.onGridSizeChanged,
              onChange: this.onGridChanged,
              state: this.state.gridState,
            }}
            nodeProps={{
              state: currNodeState,
              onChange: this.onNodeChange,
            }}
          />
        </SidebarWrapper>
      </WorkspaceWrapper>
    );
  }
}
const WorkspaceWrapper = styled.div`
  display: grid;
  padding: 0;
  grid-template-columns: 30rem 1fr 30rem;
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
