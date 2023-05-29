import { Cell } from "@antv/x6";
import { message } from "antd";
import saveAs from "file-saver";

export const copyToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  const cells = obj.graph.getSelectedCells();
  if (cells && cells.length) {
    obj.graph.copy(cells, obj.copyOptions);
    message.success("复制成功");
  } else {
    message.info("请先选中节点再复制");
  }
};
export const pasteToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  if (obj.graph.isClipboardEmpty()) {
    message.info("剪切板为空，不可粘贴");
  } else {
    const cells = obj.graph.paste(obj.copyOptions);
    obj.graph.cleanSelection();
    obj.graph.select(cells);
    message.success("粘贴成功");
  }
};

export const undoToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  obj.graph.undo();
};

export const redoToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  obj.graph.redo();
};

export const graphCenterToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  obj.graph.center();
};

export const contentCenterToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  obj.graph.centerContent();
  obj.graph.zoomToFit({
    padding: obj.padding,
  });
};

export const backToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  const cells: Cell[] = obj.graph.getSelectedCells();
  if (cells && cells.length) {
    cells.map((cell) => cell.toBack());
  } else {
    message.info("请先选中节点再调整");
  }
};

export const frontToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  const cells: Cell[] = obj.graph.getSelectedCells();
  if (cells && cells.length) {
    cells.map((cell) => cell.toFront());
  } else {
    message.info("请先选中节点再调整");
  }
};

export const zoomOutToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  const zoom = obj.graph.zoom();
  obj.graph.zoomTo(zoom + 0.1);
};

export const zoomInToolHandler = (obj: any) => {
  if (obj.graph == null) {
    message.error("发生错误");
    return;
  }
  const zoom = obj.graph.zoom();
  obj.graph.zoomTo(zoom - 0.1);
};

export const delToolHandler = (obj: any) => {
  if (obj.graph == null) return;
  const cells: Cell[] = obj.graph.getSelectedCells();
  cells.map((cell) => cell.remove());
};

export const groupToolHandler = (obj: any) => {
  if (obj.graph == null) return;
  const parent = obj.graph.addNode({
    shape: "rect",
    zIndex: -100,
    x: 40,
    y: 40,
    width: 360,
    height: 160,
  });
  const cells: Cell[] = obj.graph.getSelectedCells();
  cells.forEach((cell) => {
    parent.addChild(cell);
  });
  parent.fit({
    padding: obj.padding,
  });
};

export const ungroupToolHandler = (obj: any) => {
  if (obj.graph == null) return;
  const cells: Cell[] = obj.graph.getSelectedCells();
  cells.forEach((cell) => {
    const descendants = cell.getDescendants();
    descendants.forEach((descendant) => {
      descendant.removeFromParent();
    });
    obj.graph?.copy(descendants);
    obj.graph?.paste(obj.copyOptions);
  });
};

const jpegOption = {
  width: 1000,
  height: 1000,
  padding: 10,
  quality: 1,
};

export const exportJPEGToolHandler = (obj: any) => {
  obj.graph?.exportJPEG("demo.jpeg", jpegOption);
};

export const exportJsonToolHandler = (obj: any) => {
  const fileData = JSON.stringify(obj.graph?.toJSON(), null, 2);

  const file = new File([fileData], "demo.json", {
    type: "text/plain;charset=utf-8",
  });
  saveAs(file);
};
