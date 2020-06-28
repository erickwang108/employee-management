import {
  imageUrlGIF,
  imageUrlJPEG,
} from 'helpers/testUtils';

export default function loadImage(url, fn) {
  if (url.includes('error')) {
    fn({ type: 'error' });
  } else {
    const imageUrl = url.includes('.jpg') ? imageUrlJPEG : imageUrlGIF;
    const imgEle = document.createElement('img');
    imgEle.setAttribute('src', imageUrl);
    imgEle.setAttribute('width', '0px');
    imgEle.setAttribute('height', '0px');
    fn(imgEle);
  }
}
