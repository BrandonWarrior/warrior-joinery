import { useEffect } from "react";

type Props = {
  title?: string;
  description?: string;
};

export default function SEO({ title, description }: Props) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = `${title} · Warrior Joinery`;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    const prevDesc = meta.content;
    if (description) meta.content = description;

    return () => {
      // optional: restore previous values on unmount
      document.title = prevTitle;
      if (description) meta!.content = prevDesc;
    };
  }, [title, description]);

  return null;
}
