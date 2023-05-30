import { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { Dropdown, MenuProps, message } from "antd";
import "./index.less";
import { defaultNodeState } from "../config/nodeState";
import React from "react";
import { GraphContext } from "..";

const AppComponent = ({ node }: { node: Node }) => {
  const g = React.useContext(GraphContext);

  const label = node.prop("label");
  const { fill, stroke, strokeWidth, strokeDasharray } = node.getData();
  const onClick: MenuProps["onClick"] = ({ key }) => {
    // message.info(`Click on item ${key}`);
    switch (key) {
      case "copy":
        g.copy([node]);
        break;
      case "paste":
        g.paste();
        break;
      case "delete":
        node.remove();
        break;
      default:
        break;
    }
  };
  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "copy",
            label: "复制",
          },
          {
            key: "paste",
            label: "粘贴",
          },
          {
            key: "delete",
            label: "删除",
          },
        ],
        onClick,
      }}
      trigger={["contextMenu"]}
    >
      <svg height="100%" width="100%">
        <rect
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          width="100%"
          height="100%"
        >
          {label}
        </rect>
      </svg>
    </Dropdown>
  );
};

register({
  // inherit: "rect",
  shape: "app-react-node",
  component: AppComponent,
  x: 40,
  y: 40,
  width: 80,
  height: 40,
  label: "rect",
  attrs: {
    body: {
      ...defaultNodeState,
      rx: 6,
      ry: 6,
    },
  },
  effect: ["data"],
  data: { ...defaultNodeState, rx: 6, ry: 6 },
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
