import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/rootlayout";
import Home from "./pages/home";
import Services from "./pages/services";
import Gallery from "./pages/gallery";
import GalleryViewer from "./pages/gallery-viewer"; // <-- NEW
import About from "./pages/about";
import Reviews from "./pages/reviews";
import Contact from "./pages/contact";
import ThankYou from "./pages/thank-you";
import Privacy from "./pages/privacy";
import NotFound from "./pages/not-found";
import Admin from "./pages/admin";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery-viewer" element={<GalleryViewer />} /> {/* NEW */}
        <Route path="/about" element={<About />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
