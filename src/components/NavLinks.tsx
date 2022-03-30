import { Button } from "grommet";
import styled from "styled-components";

export const StyledButton = styled(Button)<{
  borderRadius?: string;
  bgColor?: string;
  color?: string;
  opacity?: number;
  accentColor?: string;
  hoverScale?: number;
  hoverBgColor?: string;
}>`
    align-self: center;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1, 1);
    transform: translateZ(0);
    font-smoothing: antialiased !important;
    font-size: inherit;
    background-color: ${(props) =>
      props.theme.global.colors[
        props.disabled ? "status-disabled" : props.bgColor || "neutral-3"
      ]};
    border: 2px solid
      ${(props) => props.theme.global.colors[props.color || "light-6"]};
    border-radius: ${(props) => props.borderRadius || "6px"};
    color: ${(props) => props.theme.global.colors[props.color || "light-6"]};
    box-shadow: none;
    opacity: ${(props) => props.opacity || 1};
    svg {
      fill: ${(props) => props.theme.global.colors[props.color || "light-6"]};
      stroke: ${(props) => props.theme.global.colors[props.color || "light-6"]};
    }
  
    a {
      color: inherit;
      text-decoration: none;
      font-size: inherit;
    }
  
    &.dragging,
    &.selected,
    &:hover 
    ${(props) =>
      props.disabled
        ? undefined
        : `{
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0) scale(1, 1);
      transform: translateZ(0);
      font-smoothing: antialiased !important;
      box-shadow: 0 0 4px 4px
        ${props.theme.global.colors[props.accentColor || "white"]} !important;
      border: 2px solid
        ${props.theme.global.colors[props.accentColor || "white"]};
      color: ${props.theme.global.colors[props.accentColor || "white"]};
      opacity: 1;
      transform: scale(${props.hoverScale || 1}) translate3d(0, 0, 0);
      backface-visibility: hidden;
      transition: 0.3s;
      font-size: inherit;
      background-color: ${
        props.theme.global.colors[
          props.hoverBgColor || props.bgColor || "neutral-3"
        ]
      };
      svg {
        fill: ${props.theme.global.colors[props.accentColor || "white"]};
        stroke: ${props.theme.global.colors[props.accentColor || "white"]};
      }
    }`}
  `;
