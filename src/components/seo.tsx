
import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
};

const SEO: React.FC<Props> = ({ title, description }) => {
  const fullTitle = `${title} | Warrior Joinery`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="theme-color" content="#2C5E7A" />
    </Helmet>
  );
};

export default SEO;
