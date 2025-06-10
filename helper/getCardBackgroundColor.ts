  export const getCardBackgroundColor = (destination: string) => {
    const lowerDest = destination.toLowerCase();
    if (lowerDest.includes("yogyakarta")) return "#E0F2FE"; // biru muda
    if (lowerDest.includes("palur")) return "#FEF3C7"; // kuning muda
    return "#FFFFFF";
  };