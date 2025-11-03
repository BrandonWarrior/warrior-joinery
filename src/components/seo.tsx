import { Helmet } from "react-helmet-async";

type Json = Record<string, any>;
type Props = {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: Json | Json[]; // <- NEW
};

export default function SEO({ title, description, canonical, jsonLd }: Props) {
  const jsonScripts = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{title ? `Warrior Joinery – ${title}` : "Warrior Joinery"}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {/* JSON-LD */}
      {jsonScripts.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
}
