import Container from "../components/container";
import SEO from "../components/seo";
import SingleImageGallery, { type SlideItem } from "../components/singleimagegallery";

export default function GalleryViewerPage() {
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://warrior-joinery-eb793f26e853.herokuapp.com";

  const items: SlideItem[] = [
    {
      src: "/images/doors/door-01-900.jpg",
      alt: "Oak internal door freshly hung with brushed handle.",
      caption: "Solid oak door, Bradford",
      width: 900,
      height: 1200,
      srcSet: [
        { src: "/images/doors/door-01-600.jpg", width: 600 },
        { src: "/images/doors/door-01-900.jpg", width: 900 },
        { src: "/images/doors/door-01-1400.jpg", width: 1400 },
      ],
    },
    {
      src: "/images/doors/door-02-900.jpg",
      alt: "White panel door aligned with clean gaps.",
      caption: "White panel door, Leeds",
      width: 900,
      height: 1200,
      srcSet: [
        { src: "/images/doors/door-02-600.jpg", width: 600 },
        { src: "/images/doors/door-02-900.jpg", width: 900 },
        { src: "/images/doors/door-02-1400.jpg", width: 1400 },
      ],
    },
    {
      src: "/images/doors/door-03-900.jpg",
      alt: "Glazed internal door with tidy hinges and latch.",
      caption: "Glazed internal door, Shipley",
      width: 900,
      height: 1200,
      srcSet: [
        { src: "/images/doors/door-03-600.jpg", width: 600 },
        { src: "/images/doors/door-03-900.jpg", width: 900 },
        { src: "/images/doors/door-03-1400.jpg", width: 1400 },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Gallery Viewer"
        description="Browse one image at a time with next/previous controls."
        canonical={`${siteUrl}/gallery-viewer`}
      />
      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-3xl font-semibold">Gallery Viewer</h1>
          <p className="mt-3 max-w-prose text-neutral-700">
            View one image at a time. Use the buttons or your keyboard arrows to move between photos.
          </p>

          <div className="mt-8">
            <SingleImageGallery items={items} />
          </div>
        </Container>
      </section>
    </>
  );
}
