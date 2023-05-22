import styled from "@emotion/styled";
import { ToolBox } from "./toolbox";
import { Workspace } from "./workspace";
import { Row } from "../common/lib";

export const G6_Flow = () => {
  return (
    <FlowWrapper>
      <ToolBoxWrapper>
        <ToolBox />
      </ToolBoxWrapper>
      <WorkspaceWrapper>
        <Workspace />
      </WorkspaceWrapper>
      <FooterWraper />
    </FlowWrapper>
  );
};

const FlowWrapper = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr 2rem;
  grid-template-areas:
    "toolbox"
    "workspace"
    "footer";
  height: 100vh;
`;
const ToolBoxWrapper = styled(Row)`
  grid-area: toolbox;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
`;
const WorkspaceWrapper = styled.div`
  grid-area: workspace;
`;

const FooterWraper = styled.footer`
  grid-area: footer;
  background-color: blanchedalmond;
`;
