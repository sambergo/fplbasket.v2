export const getPreviousGwOrNull = (gw: string): string | null => {
  if (parseInt(gw) > 1) return (parseInt(gw) - 1).toString();
  else return null;
};
