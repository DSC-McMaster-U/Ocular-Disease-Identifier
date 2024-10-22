import React, { useState } from "react";
import "reactjs-popup";
import StyledPopup from "./utils/StyledPopup";
import PreviewIcon from "../vendor/img/UploadPage/preview-icon.png";

interface ImagePopupProps {
  imageSrc: string;
}

const ImagePopup = ({ imageSrc }: ImagePopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={PreviewIcon}
        alt=""
        draggable="false"
        className="w-7 h-[27px] m-auto select-none"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <StyledPopup
          className=""
          modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <img src={imageSrc} alt="" />
        </StyledPopup>
      )}
    </>
  );
};

export default ImagePopup;
