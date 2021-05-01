import { useState } from "react";
import { GetStaticProps } from "next";
import Layout from "components/Layout/Layout";
import SearchInput from "components/SearchInput/SearchInput";
import CountriesTable from "components/CountriesTable/CountriesTable";
import Country from "interfaces/Country";
import styles from "styles/Home.module.css";

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch("https://restcountries.eu/rest/v2/all");
  const countries = await res.json();
  return {
    props: { countries },
  };
};

export default function Home({ countries }: { countries: Country[] }) {
  const [keyword, setKeyword] = useState("");

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLocaleLowerCase().includes(keyword) ||
      country.region.toLocaleLowerCase().includes(keyword) ||
      country.subregion.toLocaleLowerCase().includes(keyword)
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.currentTarget.value.toLowerCase());
  };

  console.log(keyword);
  return (
    <Layout>
      <div className={styles.inputContainer}>
        <div className={styles.counts}>Found {countries.length} countries</div>
        <div className={styles.input}>
          <SearchInput
            placeholder="Filter by Name, Region or SubRegion"
            onChange={onInputChange}
          />
        </div>
      </div>

      <CountriesTable countries={filteredCountries} />
    </Layout>
  );
}
