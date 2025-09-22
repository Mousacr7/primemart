export const calculateUpdatedPrice = (product) => {
  let basePrice = product.basePrice || product.price || 0;
  let extra = 0;

  if (product.selectedSize === '128GB') extra += 250;
  if (product.selectedSize === '256GB') extra += 500;
  if (product.selectedSize === '32GB') extra -= 200;

  if (product.selectedRam === '16GB') extra += 200;
  if (product.selectedRam === '4GB') extra -= 200;

  return basePrice + extra;
};
