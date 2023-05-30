import type { Cell, Dom, Node } from "@antv/x6";
import { NodeState } from "../side/nodeSetting";
import { message } from "antd";

export const edgeClick = (obj: any) => () => {
  obj.setState({
    ...obj.state,
    settingType: "Edge",
  });
};

export const nodeMouseEnter = (node: Node) => {
  const ports = node.getPorts();
  ports.forEach((port) => {
    node.portProp(port.id!, "attrs/circle/display", "inline");
  });
};

export const nodeMouseLeave = (node: Node) => {
  const ports = node.getPorts();
  ports.forEach((port) => {
    node.portProp(port.id!, "attrs/circle/display", "none");
  });
};

export const blankClick = (obj: any) => {
  obj.setState({
    ...obj.state,
    settingType: "Graph",
  });
};

export const nodeClick = (obj: any, currNodeState: NodeState) => {
  //
  const cells = obj.graph?.getSelectedCells() as Node[];
  const currNode = cells[0] as Node;
  const width = currNode.size().width;
  const height = currNode.size().height;

  const attrs = currNode?.getAttrs();
  const fill = attrs!["body"]["fill"];
  const stroke = attrs!["body"]["stroke"];
  const strokeWidth = attrs!["body"]["strokeWidth"];
  const strokeDasharray = attrs!["body"]["strokeDasharray"];
  currNodeState.width = width;
  currNodeState.height = height;
  currNodeState.fill = fill as string;
  currNodeState.stroke = stroke as string;
  currNodeState.strokeWidth = strokeWidth as number;
  currNodeState.strokeDasharray = strokeDasharray as string;

  obj.setState({
    ...obj.state,
    settingType: "Node",
    currNodeState: {
      ...currNodeState,
    },
  });
};

export const nodeChangePosition = (
  obj: any,
  node: Node,
  options: Cell.MutateOptions
) => {
  if (options.skipParentHandler || obj.ctrlPressed) {
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
        const bbox = child.getBBox().inflate(obj.embedPadding);
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
};

export const nodeEmbedding = (
  obj: any,
  e: Dom.MouseMoveEvent,
  node: Node,
  currentParent: Node,
  candidateParent: Node
) => {
  obj.ctrlPressed = e.metaKey || e.ctrlKey;
  if (candidateParent == null || candidateParent == undefined) return;
  if (candidateParent.getZIndex() == undefined || node.getZIndex() == undefined)
    return;
  if ((candidateParent.getZIndex() as number) > (node.getZIndex() as number)) {
    candidateParent.toBack();
    candidateParent.getDescendants().forEach((node) => node.toBack());
  }
};
export const nodeEmbedded = (obj: any) => {
  obj.ctrlPressed = false;
};

export const nodeChangeSize = (node: Node, options: Cell.MutateOptions) => {
  if (options.skipParentHandler) {
    return;
  }

  const children = node.getChildren();
  if (children && children.length) {
    node.prop("originSize", node.getSize());
  }
};

export const historyChange = (obj: any) => {
  if (obj.graph == null) {
    message.error("初始化错误");
    return;
  }
  obj.setState({
    ...obj.state,
    canRedo: obj.graph.canRedo(),
    canUndo: obj.graph.canUndo(),
  });
};

export const nodeChangeParent = (node: Node) => {
  node.attr({
    label: {
      text: `Child\n(embed)`,
    },
  });
};
