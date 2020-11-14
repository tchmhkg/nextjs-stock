import React, { useCallback } from "react";
import { useRouter } from "next/router";
import styled from 'styled-components';

const Button = styled.span`
  cursor: pointer;
`;

const BackButton = () => {
  const router = useRouter();
  const onClickBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div>
      <Button onClick={onClickBack}>← Back</Button>
    </div>
  );
};

export default React.memo(BackButton);
