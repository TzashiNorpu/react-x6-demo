import { Node } from "@antv/x6";
import type { Options } from "@antv/x6/lib/graph/options";

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

export const graphInitSetting = (obj: any): Options.Manual => {
  return {
    container: obj.container,
    background: {
      color: "#F2F7FA",
    },
    autoResize: true,
    grid: true,
    connecting: {
      ...connectState,
      router: {
        name: "manhattan",
        args: {
          startDirections: ["top"],
          endDirections: ["bottom"],
        },
      },
      createEdge() {
        return obj.graph.createEdge({
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
      modifiers: ["ctrl", "meta"],
      enabled: true,
      zoomAtMousePosition: true,
      minScale: 0.5,
      maxScale: 3,
    },
    // scaling: {
    //   min: 0.05, // 默认值为 0.01
    //   max: 12, // 默认值为 16
    // },
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
  };
};
