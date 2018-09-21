import React from 'react';
import { Container } from 'reactstrap';

export default function () {
  return (
    <Container fluid>
      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        <i className="fa fa-spinner fa-spin fa-5x" />
      </div>
    </Container>
  );
}
