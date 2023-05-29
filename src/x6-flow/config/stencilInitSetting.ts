import { Stencil } from "@antv/x6-plugin-stencil";

export const stencilInitSetting = (
  obj: any
): Partial<Stencil.Options> | undefined => {
  return {
    title: "Components",
    target: obj.graph,
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
  };
};
