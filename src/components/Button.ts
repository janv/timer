import styled from "react-emotion";
import { inputBorderRadius, margin, colors } from "./base";

export default styled('button')({
  borderRadius: inputBorderRadius,
  padding: `${margin}px ${2 * margin}px`,
  border: 'none',
  backgroundColor: colors.primary,
  color: 'white',
  fontSize: '90%',
  fontWeight: 600,
  ':hover': {
    backgroundColor: colors.highlight
  }
})