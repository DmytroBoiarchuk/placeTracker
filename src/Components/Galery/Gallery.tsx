import { useRef, useState } from "react";
import classes from "./Gallery.module.scss";
import noImageYet from "../../assets/products_noimageyet.jpg";
import { PlaceDataInterface } from "../../interfaces/interfaces.ts";
import { GrNext, GrPrevious } from "react-icons/gr";

const Gallery = ({ alt, data }: { alt: string; data: PlaceDataInterface }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    setCurrentIndex(0);
    dialogRef.current?.showModal();
    //lock page scrolling
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  };

  const closeDialog = () => {
    dialogRef.current?.close();
    //unlock page scrolling
    document.body.style.height = "auto";
    document.body.style.overflow = "";
  };

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.photos.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.photos.length - 1 : prevIndex - 1,
    );
  };

  const handleClickOverlay = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  };
  return (
    <>
      <img
        onClick={openDialog}
        src={
          data.photos[0]
            ? `${data?.photos[0].prefix}${data?.photos[0].width}x${data?.photos[0].height}${data?.photos[0].suffix}`
            : noImageYet
        }
        alt={alt}
        className={!isLoaded ? classes.notLoaded : ""}
        onLoad={() => setIsLoaded(true)}
      />
      <dialog
        onClick={handleClickOverlay}
        className={classes.gallery}
        ref={dialogRef}
      >
        <div className={classes.imageContainer}>
          <img
            src={
              data.photos[currentIndex]
                ? `${data?.photos[currentIndex].prefix}${data?.photos[currentIndex].width}x${data?.photos[currentIndex].height}${data?.photos[currentIndex].suffix}`
                : noImageYet
            }
            alt={`Photo ${currentIndex + 1}`}
          />
        </div>
        {data.photos.length > 1 && (
          <>
            {" "}
            <button
              className={classes.prevButton}
              disabled={data.photos.length <= 1}
              onClick={prevPhoto}
            >
              <GrPrevious color="#bfbbbb" size="45px" />
            </button>
            <button
              className={classes.nextButton}
              disabled={data.photos.length <= 1}
              onClick={nextPhoto}
            >
              <GrNext color="#bfbbbb" size="45px" />
            </button>
          </>
        )}
      </dialog>
    </>
  );
};

export default Gallery;
