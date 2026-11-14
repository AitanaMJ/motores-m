import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';

const Catalog = lazy(() => import('./pages/Catalog'));
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'));
const SellCar = lazy(() => import('./pages/SellCar'));
const Financing = lazy(() => import('./pages/Financing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route path="vehiculos/:slug" element={<VehicleDetail />} />
          <Route path="vende-tu-auto" element={<SellCar />} />
          <Route path="financiacion" element={<Financing />} />
          <Route path="nosotros" element={<About />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
}
