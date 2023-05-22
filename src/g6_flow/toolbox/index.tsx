import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { config } from "./tools-config";
export const ToolBox = () => {
  return (
    <Container>
      {config.map((item) => {
        if (item.type === "tool")
          return (
            <Tooltip key={item.command} title={item.title}>
              <Command data-command={item.command}>
                <span className={item.className}></span>
              </Command>
            </Tooltip>
          );
        else return <Separator key={item.id} />;
      })}
    </Container>
  );
};

const Container = styled(Tooltip)``;

const Command = styled.span`
  display: inline-block;
  margin: 0 6px;
  line-height: 27px;
  border: 1px solid rgba(2, 2, 2, 0);
  border-radius: 2px;
  span {
    margin: 0 6px;
  }
  &:nth-of-type(1) {
    margin-left: 24px;
  }
  &:hover {
    border: 1px solid #e9e9e9;
    cursor: pointer;
  }
`;

const Separator = styled.span`
  margin: 4px;
  border-left: 1px solid #e9e9e9;
`;
