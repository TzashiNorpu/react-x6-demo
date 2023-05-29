import { GrapSettingProps, GraphSettings } from "./graphSetting";
import { NodeSettingProps, NodeSettings } from "./nodeSetting";

type SideSetting = {
  type: string;
  graphProps?: GrapSettingProps;
  nodeProps?: NodeSettingProps;
};

export const SettingPanel = (setting: SideSetting) => {
  switch (setting.type) {
    case "Graph":
      return <GraphSettings {...setting.graphProps!} />;
    case "Node":
      return <NodeSettings {...setting.nodeProps!} />;
    default:
      return <></>;
  }
};
