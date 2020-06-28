import React from 'react';

import {
  Spin,
} from 'antd';

import { Container } from './styles';

export default function Loader() {
  return (
    <Container>
      <Spin size="large" />
    </Container>
  );
}
