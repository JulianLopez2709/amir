import { ProductSnapshot } from "@/@types/order/domain/ProductSnapshot"
import Product from "@/@types/Product"

/*export const productToSnapshot = (
  product: Product,
  selectedVariants: SelectedVariant[]
): ProductSnapshot => {
  const extraPrice = selectedVariants.reduce(
    (total, variant) =>
      total +
      variant.options.reduce((sum, opt) => sum + (opt.extraPrice || 0), 0),
    0
  )

  return {
    id: product.id || null,
    name: product.name,
    price_selling: product.price_selling,
    price: product.price_selling + extraPrice,
    imgUrl: product.imgUrl,
    description: product.description,
    optionsSelected: selectedVariants,
  }
}*/
