import { Graph } from "@antv/x6";
import { message } from "antd";



interface ToolType {
  type: "tool";
  title: string;
  command: string;
  className: string;
  handler?: (graph: Graph, options: OptionType) => void;
}
interface SepType {
  type: "sep";
  id: number;
}

export type OptionType = {
  offset: number;
  useLocalStorage: boolean;
};

export const config: (ToolType | SepType)[] = [
  {
    type: "tool",
    title: "撤销",
    command: "undo",
    className: "iconfont icon-undo",
  },
  {
    type: "tool",
    title: "恢复",
    command: "redo",
    className: "iconfont icon-redo",
  },
  {
    type: "sep",
    id: 1,
  },
  {
    type: "tool",
    title: "复制",
    command: "copy",
    className: "iconfont icon-copy",
    handler: (graph: Graph, options: OptionType) => {
      const cells = graph.getSelectedCells();
      if (cells && cells.length) {
        graph.copy(cells, options);
        message.success("复制成功");
      } else {
        message.info("请先选中节点再复制");
      }
    },
  },
  {
    type: "tool",
    title: "粘贴",
    command: "paste",
    className: "iconfont icon-paste",
  },
  {
    type: "tool",
    title: "删除",
    command: "delete",
    className: "iconfont icon-delete",
  },
  {
    type: "sep",
    id: 2,
  },
  {
    type: "tool",
    title: "缩小",
    command: "zoomIn",
    className: "iconfont icon-zoom-in",
  },
  {
    type: "tool",
    title: "放大",
    command: "zoomOut",
    className: "iconfont icon-zoom-out",
  },
  {
    type: "tool",
    title: "实际大小",
    command: "zoomReset",
    className: "iconfont icon-actual-size",
  },
  {
    type: "tool",
    title: "适应屏幕",
    command: "autoFit",
    className: "iconfont icon-fit",
  },
  {
    type: "sep",
    id: 3,
  },
  {
    type: "tool",
    title: "上一层",
    command: "toFront",
    className: "iconfont icon-to-front",
  },
  {
    type: "tool",
    title: "下一层",
    command: "toBack",
    className: "iconfont icon-to-back",
  },
];
