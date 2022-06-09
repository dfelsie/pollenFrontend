import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Input,
  Flex,
  Select as ChakraSelect,
  Center,
  Heading,
} from "@chakra-ui/react";
import "axios";

import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { useFormik } from "formik";
import Select from "react-select";
import { Country, City, State } from "country-state-city";
import { useEffect, useState } from "react";
import { ICity, IState } from "country-state-city/dist/lib/interface";
import axios from "axios";
import ForecastCard from "../components/ForecastCard";

const Index = () => {
  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    ...country,
  }));

  const updatedStates = (countryId): IState[] => {
    return State.getStatesOfCountry(countryId).map((state) => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));
  };

  const updatedCities = (country, state): ICity[] => {
    return City.getCitiesOfState(country, state).map((city) => ({
      label: city.name,
      value: city.name,
      ...city,
    }));
  };
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecast, setForecast] = useState([]);

  return (
    <Container height="100vh">
      <Heading>
        Enter Your Country,State, and City, <br></br>
        Then Hit Submit to get a weather forecast!
      </Heading>
      <form>
        <Center flexDir={"column"}>
          <ChakraSelect
            placeholder="Select Country"
            onChange={(e) => {
              setSelectedCountry(e.target.value);
            }}
          >
            {updatedCountries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </ChakraSelect>
          <ChakraSelect
            onChange={(e) => {
              setSelectedState(e.target.value);
            }}
          >
            {updatedStates(selectedCountry).map((state: IState) => (
              <option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </option>
            ))}
          </ChakraSelect>
          <ChakraSelect
            onChange={(e) => {
              setSelectedCity(e.target.value);
            }}
          >
            {updatedCities(selectedCountry, selectedState).map(
              (city: ICity) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              )
            )}
          </ChakraSelect>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              if (!selectedCity && !selectedState && !selectedCountry) {
                console.log("Please select a country, state, and city");

                return;
              }
              if (!selectedCity && !selectedState) {
                let country = Country.getAllCountries().find(
                  (country) => country.isoCode === selectedCountry
                );
                axios
                  .post("https://localhost:7138/api/getforecast", {
                    lat: country.latitude,
                    lon: country.longitude,
                  })
                  .then((res) => {
                    setForecast(res.data.forecast.forecastday);
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                return;
              }
              if (!selectedCity) {
                let state = State.getAllStates().find(
                  (state) => state.isoCode === selectedState
                );
                axios
                  .post("https://localhost:7138/api/getforecast", {
                    lat: state.latitude,
                    lon: state.longitude,
                  })
                  .then((res) => {
                    setForecast(res.data.forecast.forecastday);
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                return;
              }
              let city = City.getAllCities().find(
                (state) => state.name === selectedState
              );
              axios
                .post("https://localhost:7138/api/getforecast", {
                  lat: city.latitude,
                  lon: city.longitude,
                })
                .then((res) => {
                  setForecast(res.data.forecast.forecastday);
                  console.log(forecast);
                })
                .catch((err) => {
                  console.log(err);
                });

              return;
            }}
          >
            Submit
          </button>
          <Flex>
            {forecast.map((day) => (
              <ForecastCard date={day.date} day={day.day} />
            ))}
          </Flex>
        </Center>
      </form>

      <Footer></Footer>
    </Container>
  );
};

export default Index;
