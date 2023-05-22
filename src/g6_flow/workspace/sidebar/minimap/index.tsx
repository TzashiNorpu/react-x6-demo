import styled from "@emotion/styled";
import {forwardRef} from "react";

export const Minimap = forwardRef<HTMLDivElement>((props, ref) => {
   return (<Container ref={ref}></Container>);
}) 

const Container = styled.div`
  height:100%;
`