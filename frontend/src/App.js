import './App.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BrowserRouter, Routes} from 'react-router-dom';

import Materiel from './Component/Materiel';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" >
        <Route index element={<Materiel/>}/>
        
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
