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
import "./index.less";
import { ToolBox } from "./toolbox";
import { UploadProps, message } from "antd";
import { GridState } from "./side/graphSetting";
import { SettingPanel } from "./side";
import "./stencil/appNode";
import { defaultNodeState } from "./config/nodeState";
import { defaultGridState } from "./config/gridState";
import { NodeState } from "./side/nodeSetting";
import { graphInitSetting } from "./config/graphInitSetting";
import {
  blankClick,
  edgeClick,
  historyChange,
  nodeChangeParent,
  nodeChangePosition,
  nodeChangeSize,
  nodeClick,
  nodeEmbedded,
  nodeEmbedding,
  nodeMouseEnter,
  nodeMouseLeave,
} from "./config/graphOnHandler";
import { ctlC, ctlV, ctlZ, del } from "./config/graphKeyBindHandler";
import { stencilInitSetting } from "./config/stencilInitSetting";
import {
  backToolHandler,
  contentCenterToolHandler,
  copyToolHandler,
  delToolHandler,
  exportJPEGToolHandler,
  exportJsonToolHandler,
  frontToolHandler,
  graphCenterToolHandler,
  groupToolHandler,
  pasteToolHandler,
  redoToolHandler,
  undoToolHandler,
  ungroupToolHandler,
  zoomInToolHandler,
  zoomOutToolHandler,
} from "./config/toolBoxHandler";

// const commonAttrs = {
//   body: { ...defaultNodeState },
// };

interface State {
  settingType: string;
  canUndo: boolean;
  canRedo: boolean;
  gridState: GridState;
  currNodeState: NodeState;
}

const currNodeState: NodeState = defaultNodeState;
const gridState: GridState = defaultGridState;

type Props = any;

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
    gridState,
    currNodeState,
  };

  private padding = {
    left: 20,
    top: 20,
    right: 20,
    bottom: 20,
  };

  componentDidMount() {
    // d[0].style.width = "100%";
    // d[0].style.height = "100%";
    if (this.container == null) {
      message.error("初始化错误");
      return;
    }

    this.graph = new Graph(graphInitSetting(this));

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

    this.graph
      .use(new Export())
      .use(
        new Clipboard({
          enabled: true,
          // useLocalStorage: true,
        })
      )
      .use(
        new Snapline({
          enabled: true,
          sharp: true,
        })
      )
      .use(
        new Keyboard({
          enabled: true,
          global: true,
        })
      )
      .use(
        new Transform({
          resizing: this.resizingOptions,
          rotating: this.rotatingOptions,
        })
      )
      .use(
        new History({
          enabled: true,
        })
      )
      .use(
        new Scroller({
          enabled: true,
          pageVisible: true,
          pageBreak: true,
          // pannable: true,
        })
      );

    this.graph.on("history:change", () => {
      historyChange(this);
    });

    this.graph.on("node:change:parent", ({ node }) => {
      nodeChangeParent(node);
    });

    this.graph.on("node:click", () => {
      nodeClick(this, currNodeState);
    });

    this.graph.on("edge:click", () => {
      edgeClick(this);
    });

    this.graph.on("node:embedding", ({ e }: { e: Dom.MouseMoveEvent }) => {
      nodeEmbedding(this, e);
    });

    this.graph.on("node:mouseenter", ({ e, node }) => {
      nodeMouseEnter(node);
    });

    this.graph.on("blank:click", () => {
      blankClick(this);
    });

    this.graph.on("node:mouseleave", ({ node }) => {
      nodeMouseLeave(node);
    });

    this.graph.on("node:embedded", () => {
      nodeEmbedded(this);
    });

    this.graph.on("node:change:size", ({ node, options }) => {
      nodeChangeSize(node, options);
    });

    this.graph.on("node:change:position", ({ node, options }) => {
      nodeChangePosition(this, node, options);
    });

    this.graph.center();

    // ctrl+c ctrl+v
    this.graph.bindKey("ctrl+c", () => {
      ctlC(this);
    });

    this.graph.bindKey("ctrl+v", () => {
      ctlV(this);
    });

    this.graph.bindKey("ctrl+z", () => {
      ctlZ(this);
    });

    this.graph.bindKey("delete", () => {
      del(this);
    });

    const stencil = new Stencil(stencilInitSetting(this));

    if (this.stencilContainer != undefined)
      this.stencilContainer.appendChild(stencil.container);

    const n1 = this.graph.createNode({
      shape: "app-react-node",
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
    });

    stencil.load([n1], "group1");
  }
  // copy
  private onCopy = () => {
    copyToolHandler(this);
  };

  // paste
  private onPaste = () => {
    pasteToolHandler(this);
  };

  // redo undo
  onUndo = () => {
    undoToolHandler(this);
  };

  onRedo = () => {
    redoToolHandler(this);
  };

  onGraphCenter = () => {
    graphCenterToolHandler(this);
  };

  onContentCenter = () => {
    contentCenterToolHandler(this);
  };
  onToBack = () => {
    backToolHandler(this);
  };
  onToFront = () => {
    frontToolHandler(this);
  };

  onZoomIn = () => {
    zoomInToolHandler(this);
  };

  onZoomOut = () => {
    zoomOutToolHandler(this);
  };

  onDelete = () => {
    delToolHandler(this);
  };

  onGroup = () => {
    groupToolHandler(this);
  };

  onUnGroup = () => {
    ungroupToolHandler(this);
  };

  private onExportJPEG = () => {
    exportJPEGToolHandler(this);
  };

  jsonOptions: Model.ToJSONOptions = {};

  private onExportJson = () => {
    exportJsonToolHandler(this);
  };

  uploadProps: UploadProps = {
    name: "file",
    beforeUpload: (file) => {
      file.text().then((res) => {
        if (this.graph == null) {
          message.error("发生错误");
        }
        const xxx = JSON.parse(res);
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
    const currNodes = this.graph?.getSelectedCells() as Node[];
    if (obj.k == "width" || obj.k == "height") {
      const s = {
        width: currNodes[0].size().width,
        height: currNodes[0].size().height,
      };
      (s as any)[obj.k] = obj.v;
      currNodes[0].setSize(s);
    } else {
      currNodes.forEach((node) => {
        node.attr("body/" + obj.k, obj.v);
      });
    }
    //
    const temp = {
      ...this.state.currNodeState,
    };
    (temp as any)[obj.k] = obj.v;
    this.setState({
      ...this.state,
      currNodeState: temp,
    });
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  refStencil = (container: HTMLDivElement) => {
    this.stencilContainer = container;
  };
  render() {
    return (
      <WorkspaceWrapper style={{ height: "100%", width: "100%" }}>
        <ToolboxWrapper id="toolbox">
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
        <StencilWrapper id="stencil" ref={this.refStencil} />
        <CanvasWrapper id="canvas" ref={this.refContainer} />
        <SidebarWrapper>
          <SettingPanel
            type={this.state.settingType}
            graphProps={{
              onGridSizeChange: this.onGridSizeChanged,
              onChange: this.onGridChanged,
              state: this.state.gridState,
            }}
            nodeProps={{
              state: this.state.currNodeState,
              onChange: this.onNodeChange,
            }}
          />
        </SidebarWrapper>
        <FooterWrapper />
      </WorkspaceWrapper>
    );
  }
}
const WorkspaceWrapper = styled.div`
  display: grid;
  padding: 0;
  grid-template-columns: 30rem 1fr 30rem;
  grid-template-rows: 6rem 1fr 6rem;
  grid-template-areas:
    "toolbox toolbox toolbox"
    "stencil canvas sidebar"
    "footer footer footer";
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
  background-color: red;
`;

const ToolboxWrapper = styled.div`
  grid-area: toolbox;
  display: flex;
  align-items: center;
  flex-direction: row;
`;
