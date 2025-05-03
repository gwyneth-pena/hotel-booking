import { useEffect, useState } from "react";
import PhotoAlbum, { Photo } from "react-photo-album";
import "react-photo-album/rows.css";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "./PhotoGallery.css";

const PhotoGallery = ({ photos }: any) => {
  const [index, setIndex] = useState(-1);
  const [mappedPhotos, setMappedPhotos] = useState([]);
  const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

  const getImageDimensions = (
    src: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
    });
  };

  useEffect(() => {
    const loadPhotos = async () => {
      const photoPromises =
        photos?.map(async (src: string, idx: number) => {
          const { width, height } = await getImageDimensions(src);
          return {
            src,
            width,
            height,
            alt: `Hotel photo ${idx}`,
            srcSet: breakpoints.map((breakpoint) => ({
              src: src,
              width: breakpoint,
              height: Math.round((height / width) * breakpoint),
            })),
          } as Photo;
        }) || [];

      const loadedPhotos: any = await Promise.all(photoPromises);
      setMappedPhotos(loadedPhotos);
    };

    loadPhotos();
  }, [photos]);
  return (
    <>
      <PhotoAlbum
        layout="masonry"
        spacing={0}
        photos={mappedPhotos}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={mappedPhotos}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
      />
    </>
  );
};

export default PhotoGallery;
