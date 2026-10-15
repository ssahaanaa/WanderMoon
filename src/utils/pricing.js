export const DISCOUNT_MIN_TRAVELERS = 4;
export const DISCOUNT_RATE = 0.1;
export const TAX_RATE = 0.05;

export function calculatePricing(pricePerPerson, travelers) {
  const count = Math.max(0, Number(travelers) || 0);
  const packageCost = (Number(pricePerPerson) || 0) * count;
  const discount =
    count >= DISCOUNT_MIN_TRAVELERS ? Math.round(packageCost * DISCOUNT_RATE) : 0;
  const tax = Math.round((packageCost - discount) * TAX_RATE);
  const finalCost = packageCost - discount + tax;

  return { packageCost, discount, tax, finalCost };
}

export function getTripDuration(dates, pkg) {
  if (!dates.start || !dates.end) return pkg ? pkg.days : 0;

  const start = new Date(dates.start);
  const end = new Date(dates.end);
  const days = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return days > 0 ? days : pkg ? pkg.days : 0;
}

export function getCartTotals(cart) {
  return {
    totalTravelers: cart.reduce((sum, item) => sum + item.travelers, 0),
    totalBaseCost: cart.reduce((sum, item) => sum + item.baseCost, 0),
    totalDiscount: cart.reduce((sum, item) => sum + item.discount, 0),
    totalTax: cart.reduce((sum, item) => sum + item.tax, 0),
    totalBookingAmount: cart.reduce((sum, item) => sum + item.cost, 0),
  };
}
