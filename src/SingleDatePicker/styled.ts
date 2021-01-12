import styled, { css } from "styled-components";
import { DatePicker } from "antd";

const afterCss = css`
  content: "~";
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -24px;
  top: 0;
  height: 100%;
  width: 24px;
`;

const PackDataPick = styled(DatePicker)<{ showElement?: boolean }>`
  position: relative;
  width: 100%;
  & .ant-input {
    //  border: 1px solid transparent;
  }
  &:after {
    ${props => (props.showElement ? afterCss : "")}
  }
`;

const RenderTimeWarp = styled.div`
  padding-right: 50px;
  position: relative;
  .ant-btn {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -12px;
  }
`;

export { afterCss, PackDataPick, RenderTimeWarp };
