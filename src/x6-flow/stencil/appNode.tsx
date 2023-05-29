import { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { Dropdown } from "antd";
import "./index.less";
import { defaultNodeState } from "../config/nodeState";

export const AppComponent = ({ node }: { node: Node }) => {
  const label = node.prop("label");
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
      }}
      trigger={["contextMenu"]}
    >
      <div className="custom-react-node">{label}</div>
    </Dropdown>
  );
};
const commonAttrs = {
  body: { ...defaultNodeState },
};
register({
  shape: "app-react-node",
  component: AppComponent,
  x: 40,
  y: 40,
  width: 80,
  height: 40,
  label: "rect",
  markup: [
    {
      tagName: "rect", // 标签名称
      selector: "body", // 选择器
    },
  ],
  attrs: commonAttrs,
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
