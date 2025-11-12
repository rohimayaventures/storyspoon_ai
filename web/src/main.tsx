import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Library from './pages/Library';
import Reader from './pages/Reader';
import { Navbar } from './ui/Navbar';
import './styles/globals.css';

const router = createBrowserRouter([
  { path: "/", element: <Library /> },
  { path: "/recipe/:id", element: <Reader /> }
]);

function Shell(){
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Shell />);
