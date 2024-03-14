import './App.css';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BrowserRouter, Routes} from 'react-router-dom';

import Etudiant from './Component/Etudiant';
import Acceuil from './Component/Acceuill';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" >
        <Route index element={<Etudiant/>}/>
        
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
