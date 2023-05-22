import styled from "@emotion/styled";
import {Info} from "./info";
import {Minimap} from "./minimap";
import {forwardRef} from "react";


export const SideBar = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <>
    <SidebarWrapper>
      <InfoWrapper>
        <Info/>
      </InfoWrapper>
      <MinimapWraper>
        <Minimap ref={ref}/>
      </MinimapWraper>
    </SidebarWrapper>
    </>
  );
});


const SidebarWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 30rem;
  grid-template-areas:
    "info"
    "minimap";
  height:100%;
`;

const InfoWrapper = styled.div`
  grid-area: info;
`;

const MinimapWraper = styled.div`
  grid-area: minimap;
`;