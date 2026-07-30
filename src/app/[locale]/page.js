import {useTranslations} from "next-intl";
import BannerSection from "../components/common/home-components/BannerSection";


export default function Home() {

  const t = useTranslations("Home");

  return (
     <>
        <BannerSection />
    </>
  );
}