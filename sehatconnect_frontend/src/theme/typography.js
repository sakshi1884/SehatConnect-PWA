// src/theme/typography.js

const typography = {
  fontFamilyPrimary: "'Plus Jakarta Sans', sans-serif",
  fontFamilySecondary: "'Inika', serif",

  headings: {
    h1: { fontFamily: "'Inika', serif", fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontFamily: "'Inika', serif", fontSize: "2rem", fontWeight: 700 },
    h3: { fontFamily: "'Inika', serif", fontSize: "1.5rem", fontWeight: 700 },
  },

  body: {
    regular: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "1rem",
      fontWeight: 400,
    },
    small: {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },

  button: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "uppercase",
  },
};

export default typography;
