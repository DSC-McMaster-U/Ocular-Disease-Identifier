import Header from "./Header";
import { useRef, useState, ReactNode } from "react";
import ImagePopup from "./ImagePopup";
import UploadArrow from "../vendor/img/UploadPage/upload-arrow.png";
import DeleteIcon from "../vendor/img/UploadPage/trash-icon.png";

interface Props {
  children?: ReactNode;
}

interface PreviewProps extends Props {
  file: File;
  fileIndex: number;
}

const UploadPage = () => {
  const [images, setImages] = useState<File[]>([]);

  // For drag and drop - WIP
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<File[]>(null);

  const handleDelete = (deleteIndex: number) => {
    const tempImages = [...images];
    tempImages.splice(deleteIndex, 1);
    setImages(tempImages);
  };

  // Image preview file components
  const PreviewCapsule = ({ file, fileIndex, children }: PreviewProps) => {
    let fileName, fileNameTemp;
    const fileNameSize = 25;

    // Trimming of file name in order to prevent overflow or text wrapping
    if (file.name.length > fileNameSize) {
      fileNameTemp = [
        file.name.split(".").slice(0, -1).join("."),
        file.name.split(".").slice(-1)[0],
      ];

      fileName = `${fileNameTemp[0].slice(
        0,
        fileNameSize - 7 - fileNameTemp[1].length
      )}...${fileNameTemp[0].slice(-3)}.${fileNameTemp[1]}`;
    } else {
      fileName = file.name;
    }

    return (
      <div
        className="
          md:max-w-[413px] min-h-[79px] w-full h-fit px-[24px]
          flex flex-col justify-center
          bg-white rounded-xl border border-[#d2d2d2]          
        "
      >
        <div className="h-fit w-full flex gap-[18.5px] justify-evenly">
          <ImagePopup imageSrc={URL.createObjectURL(file)}></ImagePopup>
          <div className="w-full h-fit">{fileName}</div>
          <img
            src={DeleteIcon}
            alt=""
            className="w-5 h-5 m-auto cursor-pointer select-none"
            draggable="false"
            onClick={() => {
              handleDelete(fileIndex);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="mt-[60px]">
        <div
          className="
            xl:max-w-[1120px] xl:container xl:mx-auto
            md:py-[100px] md:gap-[56px] md:mx-[80px] md:flex-row sm:mx-[80px]
            mx-[40px] py-[60px] w-auto h-fit min-h-[534px] gap-[36px] 
            flex flex-col fill-none
          "
        >
          {/* Upload Section */}
          <div
            className="
              lg:px-[68px] py-[59px] md:max-w-[561px] min-h-[466px] w-full h-fit
              px-[48px] bg-white rounded-[48px] shadow-section border border-[#585858]
            "
          >
            {/* WIP: Separate into a component file later... */}
            <div className="w-full h-full flex items-center justify-center">
              <form
                className={`${dragActive ? "bg-blue-400" : "dashed-box"}  
                  w-full min-h-[346px] h-full text-center
                  flex flex-col items-center justify-center`}
                // onDragEnter={handleDragEnter}
                onSubmit={(e) => e.preventDefault()}
                // onDrop={handleDrop}
                // onDragLeave={handleDragLeave}
                // onDragOver={handleDragOver}
              >
                {/* Input for drag and drop; currently not implemented, WIP */}
                <input
                  placeholder="fileInput"
                  hidden
                  className=""
                  // ref={inputRef}
                  type="file"
                  multiple
                  // onChange={handleChange}
                  accept="image/png, image/jpeg, image/bmp"
                />

                <div className="flex flex-col justify-evenly gap-[8px]">
                  <img
                    src={UploadArrow}
                    alt=""
                    draggable={false}
                    className="w-[81px] h-auto mx-auto mb-[26px] select-none"
                  />

                  <span className="text-center text-[#4c4c4c] text-base font-bold font-['Inter'] mx-[30px]">
                    Drag & drop files to upload
                  </span>

                  <span className="text-center text-[#4c4c4c] text-sm font-normal font-['Inter']">
                    or
                  </span>

                  <label
                    htmlFor="image-upload-click"
                    className="
                      max-w-[138px] min-h-[39px] h-fit w-full mx-auto
                      bg-[#387eed] rounded-[25px] flex justify-center align-middle cursor-pointer
                    "
                    // onClick={openFileExplorer}
                  >
                    <span className="text-center text-white text-sm font-bold font-google my-auto cursor-pointer">
                      Browse files...
                    </span>
                  </label>

                  <input
                    type="file"
                    name="imageUpload"
                    id="image-upload-click"
                    multiple
                    hidden
                    accept="image/png, image/jpeg, image/bmp"
                    // Move the following below to separate handleUpload function, so this can also be used for drag-drop
                    onChange={(event) => {
                      setImages(
                        event.target.files
                          ? [...images, ...event.target.files]
                          : [...images]
                      );
                    }}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className="
              md:max-w-[502px] min-h-[534px] w-full h-fit 
              pt-[54px] pb-[58px] px-[44px] gap-[34px]
              flex flex-col justify-evenly
              bg-white rounded-[48px] shadow-section border border-[#585858]
            "
          >
            <div className="w-full h-fit text-[#4c4c4c] text-[26px] font-bold font-google text-left">
              Your Uploads
            </div>
            <div
              className={`${
                images.length > 3
                  ? "overflow-y-scroll pr-[15px] pl-[2px] py-[5px] border-[#dcdcdc] border-t-[1.5px] border-b-[1.5px]"
                  : "overflow-auto"
              }
                ${
                  images.length
                    ? "justify-start"
                    : "justify-center border border-[#dcdcdc] rounded-[48px]"
                }
                md:max-w-[414px] w-full h-[273px] gap-[18px]
                flex flex-col
              `}
            >
              {images && images.length ? (
                images.map((image, index) => (
                  <PreviewCapsule file={image} fileIndex={index} />
                ))
              ) : (
                <span className="w-full px-[30px] text-center text-black text-[17px] font-extralight italic font-['Inter']">
                  There are no files to preview...
                </span>
              )}
            </div>
            <div
              className={`${
                images.length
                  ? "bg-[#387eed] cursor-pointer"
                  : "bg-[#8ebaff] cursor-default"
              }
                max-w-[338px] min-h-[51px] h-fit w-full mx-auto
                bg-[#387eed] rounded-[25px] flex justify-center align-middle
                transition-all ease-in-out
              `}
              // onClick={openFileExplorer}
            >
              <span className="text-center text-white text-md font-bold font-google my-auto">
                Upload Files
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
