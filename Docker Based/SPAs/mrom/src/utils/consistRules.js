export const LOCOMOTIVE_AAR_CODES = ["DE", "SE"];

export const IN_SERVICE_STATUS = "In Service";

export const isInService = (rs) => rs?.rsStatus === IN_SERVICE_STATUS;

export const isLocomotive = (rs) => LOCOMOTIVE_AAR_CODES.includes(rs?.aarCode);

// An empty consist is allowed; otherwise the lead car must be a locomotive.
export const firstCarIsLocomotive = (cars, rsList) => {
  if (!cars.length) return true;
  const lead = rsList.find((rs) => rs._id === cars[0].rollingStockId);
  return isLocomotive(lead);
};
