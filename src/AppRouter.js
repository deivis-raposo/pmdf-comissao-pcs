// src/AppRouter.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Menu from './components/Menu';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );
}
