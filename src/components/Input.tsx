import styled from "react-emotion";
import { colors, inputBorderRadius, margin } from "./base";
import { cpus } from "os";

interface Props {
  width?: string
  outline?: boolean
}

export default styled('input')`
    border: 1px solid ${({outline=true}:Props) => outline ? colors.silver : 'transparent'};
    border-radius: ${inputBorderRadius}px;
    padding: ${margin}px;
    width: ${(props:Props) => props.width};

`