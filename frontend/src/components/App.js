import React from 'react';
import { Container } from 'reactstrap';
import Header from './includes/Header';
import Routes from '../routes';

export default function App() {
  return (
    <div>
      <Header/>
      <Container>
        <Routes />
      </Container>
    </div>
  );
}
