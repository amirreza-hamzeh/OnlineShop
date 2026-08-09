const isRemoteImage = image => /^https?:\/\//i.test(image || '')

const imageUrl = image => {
  if (!image) return ''

  return isRemoteImage(image)
    ? image
    : (process.env.PUBLIC_URL || '') + image
}

export default imageUrl
