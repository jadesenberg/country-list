import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Country from "interfaces/Country";
import Layout from "components/Layout/Layout";
import styles from "./Country.module.css";

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch("https://restcountries.eu/rest/v2/all");
  const countries = await response.json();

  const paths = countries.map((country: Country) => ({
    params: { id: country.alpha3Code },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const country: Country = await getCountry(params?.id);
  return {
    props: {
      country,
    },
  };
};

const getCountry = async (id: string | undefined | string[]) => {
  const response = await fetch(`https://restcountries.eu/rest/v2/alpha/${id}`);
  return await response.json();
};

const CountryDetails = ({
  country,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [borders, setBorders] = useState<Country[]>([]);

  const getBorders = async () => {
    const borders: Country[] = await Promise.all(
      country.borders.map((border: string) => getCountry(border))
    );
    setBorders(borders);
  };

  useEffect(() => {
    getBorders();
  }, []);

  return (
    <Layout title={country.name}>
      <div className={styles.container}>
        <div className={styles.container_left}>
          <div className={styles.overview_panel}>
            <Image
              src={country.flag}
              alt={country.name}
              layout="responsive"
              height={300}
              width={500}
            />

            <h1 className={styles.overview_name}>{country.name}</h1>
            <div className={styles.overview_region}>{country.region}</div>

            <div className={styles.overview_numbers}>
              <div className={styles.overview_population}>
                <div className={styles.overview_value}>
                  {country.population}
                </div>
                <div className={styles.overview_label}>Population</div>
              </div>

              <div className={styles.overview_area}>
                <div className={styles.overview_value}>{country.area}</div>
                <div className={styles.overview_label}>Area</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container_right}>
          <div className={styles.details_panel}>
            <h4 className={styles.details_panel_heading}>Details</h4>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Capital</div>
              <div className={styles.details_panel_value}>
                {country.capital}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Language</div>
              <div className={styles.details_panel_value}>
                {country.languages
                  .map(({ name }: { name: string }) => name)
                  .join(",")}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Currencies</div>
              <div className={styles.details_panel_value}>
                {country.currencies
                  .map(({ name }: { name: string }) => name)
                  .join(",")}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Native name</div>
              <div className={styles.details_panel_value}>
                {country.nativeName}
              </div>
            </div>

            <div className={styles.details_panel_row}>
              <div className={styles.details_panel_label}>Gini</div>
              <div className={styles.details_panel_value}>{country.gini} %</div>
            </div>

            <div className={styles.details_panel_borders}>
              <div className={styles.details_panel_borders_label}>
                Neighbor Countries
              </div>
              <div className={styles.details_panel_borders_container}>
                {borders.map(({ flag, name }) => (
                  <div className={styles.details_panel_borders_country}>
                    <Image
                      src={flag}
                      alt={name}
                      layout="responsive"
                      height={300}
                      width={300}
                    />

                    <div className={styles.details_panel_borders_name}>
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CountryDetails;
