const capitalize = (text) => {
  if (typeof text == "object") {
    return text[0]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (typeof text == "string") {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
};

export { capitalize };
