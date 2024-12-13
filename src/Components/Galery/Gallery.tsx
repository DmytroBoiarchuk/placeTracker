import React, { useRef, useState} from "react";
import classes from "./Gallery.module.scss";
import noImageYet from "../../assets/products_noimageyet.jpg";
import { PhotosArrayInterface } from "../../interfaces/interfaces.ts";
import { GrNext, GrPrevious } from "react-icons/gr";

const Gallery = ({
  alt,
  photos,
}: {
  alt: string;
  photos: PhotosArrayInterface[];
}):JSX.Element => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const dialogRef= useRef<HTMLDialogElement>(null);

  const openDialog = ():void => {
    //set on first photo
    setCurrentIndex(0);
    dialogRef.current?.showModal();
    //lock page scrolling
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
  };

  const closeDialog = ():void => {
    dialogRef.current?.close();
    //unlock page scrolling
    document.body.style.height = "auto";
    document.body.style.overflow = "";
  };

  const nextPhoto = ():void => {
    setCurrentIndex((prevIndex) =>
      //if current photo is last in the array - reset next photo on first in the array
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevPhoto = ():void => {
    //if current photo is first in the array - reset prev photo to last in the array
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1,
    );
  };

  //close gallery if user clicks outside the dialog
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
          photos[0]
            ? `${photos[0].prefix}${photos[0].width}x${photos[0].height}${photos[0].suffix}`
            : noImageYet
        }
        alt={alt}
        className={!isLoaded ? classes.notLoaded : ""}
        onLoad={() => setIsLoaded(true)}
      />
      <dialog
          aria-label="dialog"

          onClick={handleClickOverlay}
        className={classes.gallery}
        ref={dialogRef}
      >
        <div className={classes.imageContainer}>
          <img
            src={
              photos[currentIndex]
                ? `${photos[currentIndex].prefix}${photos[currentIndex].width}x${photos[currentIndex].height}${photos[currentIndex].suffix}`
                : noImageYet
            }
            alt={`Photo ${currentIndex + 1}`}
          />
        </div>
        {photos.length > 1 && (
          <>
            {" "}
            <button
              aria-label="prev"
              className={classes.prevButton}
              disabled={photos.length <= 1}
              onClick={prevPhoto}
            >
              <GrPrevious color="#bfbbbb" size="45px" />
            </button>
            <button
              aria-label="next"
              className={classes.nextButton}
              disabled={photos.length <= 1}
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
