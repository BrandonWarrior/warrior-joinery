
import Container from "../components/container";
import SEO from "../components/seo";
import GalleryGrid from "../components/gallerygrid";

export default function Gallery() {
  return (
    <>
      <SEO title="Gallery" description="A look at recent internal door projects." />
      <section className="bg-white">
        <Container className="py-12">
          <h1 className="text-3xl font-semibold">Gallery</h1>
          <p className="mt-2 max-w-prose text-neutral-700">
            A few examples of recent work. Click any image to enlarge.
          </p>
          <div className="mt-6">
            <GalleryGrid />
          </div>
        </Container>
      </section>
    </>
  );
}
