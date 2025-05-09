import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./PhotoGallery.css";

const PhotoGallery = ({ photos }: any) => {
  const [mappedPhotos, setMappedPhotos] = useState([]);

  useEffect(() => {
    const mappedPhotos =
      photos?.map((photo: any) => {
        return {
          original: photo,
          thumbnail: photo,
        };
      }) || [];

    setMappedPhotos(mappedPhotos);
  }, [photos]);
  return (
    <>
      <ImageGallery items={mappedPhotos} showPlayButton={false} />
    </>
  );
};

export default PhotoGallery;
