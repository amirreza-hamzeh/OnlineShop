export const categoryPath = category => `/shop/${encodeURIComponent(category)}`

export const productPath = (category, productId) => `${categoryPath(category)}/${encodeURIComponent(productId)}`
