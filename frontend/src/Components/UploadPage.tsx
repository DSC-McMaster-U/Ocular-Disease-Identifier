import Header from "./Header";
import { useState } from "react";

const UploadPage = () => {
  const [images, setImages] = useState<File[]>([]);

  return (
    <>
      <Header />
      <div className="mt-[60px]">
        <h1>Upload image</h1>
        <div>
          <input
            type="file"
            name="imageUpload"
            id=""
            onChange={(event) => {
              setImages(
                event.target.files
                  ? [...images, ...event.target.files]
                  : [...images]
              );
            }}
          />

          <div>
            {images &&
              images.map((image) => <img src={URL.createObjectURL(image)}></img>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
