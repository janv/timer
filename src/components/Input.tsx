import styled from "react-emotion";
import { colors, inputBorderRadius, margin } from "./base";

interface Props {
  width?: string
}

export default styled('input')`
    border: 1px solid ${colors.silver};
    border-radius: ${inputBorderRadius}px;
    padding: ${margin}px;
    width: ${(props:Props) => props.width};
`