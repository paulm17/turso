module.exports = function ({ addComponents }: any) {
  addComponents({
    ".disclosure-chevronWrapper": {
      marginLeft: "8px",
      alignItems: "center",
    },
    ".disclosure-label": {
      width: "calc(100%-70px)",
    },
  });
};
