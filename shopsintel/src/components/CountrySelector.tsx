"use client";

import { useEffect } from "react";

type Country = {
  name: string;
  code: string;
  icon: React.ReactNode;
};

const countries: Country[] = [
  {
    name: "United States",
    code: "US",
    icon: (
      <span role="img" aria-label="US">
        🇺🇸
      </span>
    ),
  },
  {
    name: "United Kingdom",
    code: "GB",
    icon: (
      <span role="img" aria-label="UK">
        🇬🇧
      </span>
    ),
  },
  {
    name: "Mexico",
    code: "MX",
    icon: (
      <span role="img" aria-label="MX">
        🇲🇽
      </span>
    ),
  },
  {
    name: "Ireland",
    code: "IE",
    icon: (
      <span role="img" aria-label="IE">
        🇮🇪
      </span>
    ),
  },
  {
    name: "Spain",
    code: "ES",
    icon: (
      <span role="img" aria-label="ES">
        🇪🇸
      </span>
    ),
  },
];

type CountrySelectorProps = {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
};

export default function CountrySelector({
  selectedCountry,
  setSelectedCountry,
}: CountrySelectorProps) {
  // Set default country when component mounts
  useEffect(() => {
    if (!selectedCountry) {
      setSelectedCountry("GB"); // Default to UK
    }
  }, [selectedCountry, setSelectedCountry]);

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      {countries.map((country) => (
        <button
          key={country.code}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            selectedCountry === country.code
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setSelectedCountry(country.code)}
        >
          {country.icon}
          {country.name}
        </button>
      ))}
    </div>
  );
}
