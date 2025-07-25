import ImageKit from "imagekit-javascript"

const imagekit = new ImageKit({
  publicKey: process.env.REACT_APP_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT!,
})

export default imagekit
