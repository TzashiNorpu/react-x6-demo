import type { Cell } from "@antv/x6";

export const ctlC = (obj: any) => {
  if (obj.graph == null) return;
  const cells = obj.graph.getSelectedCells();
  if (cells.length) {
    (cells as Cell[]).forEach((cell) => {
      const descendants = cell.getDescendants();
      console.log("des", descendants);
      cells.push(...descendants);
    });
    obj.graph.select(cells);
    obj.graph.copy(cells);
  }
  return false;
};

export const ctlV = (obj: any) => {
  if (obj.graph == null) return;
  if (!obj.graph.isClipboardEmpty()) {
    const cells = obj.graph.paste(obj.copyOptions);
    obj.graph.cleanSelection();
    obj.graph.select(cells);
  }
  return false;
};

export const ctlZ = (obj: any) => {
  if (obj.graph == null) return;
  obj.graph.undo();
  return false;
};

export const del = (obj: any) => {
  if (obj.graph == null) return;
  const cells: Cell[] = obj.graph.getSelectedCells();
  cells.map((cell) => cell.remove());
};
