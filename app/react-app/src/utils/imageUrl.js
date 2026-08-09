const isRemoteImage = image => /^https?:\/\//i.test(image || '')

const imageUrl = image => isRemoteImage(image)
  ? image
  : process.env.PUBLIC_URL + image

export default imageUrl
