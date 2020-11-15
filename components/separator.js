import { memo } from "react";
import styled from "styled-components";

const Container = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const Separator = () => <Container />;
export default memo(Separator);
