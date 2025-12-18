import { Routes, Route } from "react-router-dom";
import RootLayout from "./layouts/rootlayout";
import Home from "./pages/home";
import Services from "./pages/services";
import Gallery from "./pages/gallery";
import GalleryViewer from "./pages/gallery-viewer";
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
        <Route path="/gallery-viewer" element={<GalleryViewer />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* ✅ Admin MUST come before wildcard */}
        <Route path="/admin" element={<Admin />} />

        {/* ❗ Always last */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
