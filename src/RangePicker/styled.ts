import { Col } from "antd";
import styled from "styled-components";

const LayoutLeftCol = styled(Col)`
  position: relative;
  padding-right: 24px !important;
`;

const LayoutRightCol = styled(Col)`
  position: relative;
  padding-left: 0 !important;
`;

export { LayoutLeftCol, LayoutRightCol };
