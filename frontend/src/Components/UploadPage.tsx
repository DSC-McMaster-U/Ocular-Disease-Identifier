import Header from "./Header";
import { useRef, useState, ReactNode } from "react";

import ImagePopup from "./ImagePopup";
import UploadArrow from "../vendor/img/UploadPage/upload-arrow.png";
import DeleteIcon from "../vendor/img/UploadPage/trash-icon.png";
import LoadingGif from "../vendor/img/UploadPage/loading.gif";
import SuccessIcon from "../vendor/img/UploadPage/success.png";

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

  // Detects when site is currently uploading images, and prevents any more POST requests from being made
  const [uploadActive, setUploadActive] = useState<boolean>(false);
  const [resultsActive, setResultsActive] = useState<boolean>(false);
  const [firstUploadMade, setFirstUploadMade] = useState<boolean>(false); 

  const handleDelete = (deleteIndex: number) => {
    const tempImages = [...images];
    tempImages.splice(deleteIndex, 1);
    setImages(tempImages);
  };

  // Upload form auxiliary functions
  const handleChange = (event: any) => {
    event.preventDefault();

    // If manual upload images exist, then append new files to current images array; if not, keep same images
    setImages(
      event.target.files && event.target.files[0]
        ? [...images, ...event.target.files]
        : [...images]
    );
  };

  const handleDrop = (event: any) => {
    // Prevent default browser actions from occurring due to drag-drop
    event.preventDefault();
    event.stopPropagation();

    // Signal that user is not drag/dropping, to change visual appearance of upload box
    setDragActive(false);

    // If drag-drop images exist, then append new files to current images array; if not, keep same images
    setImages(
      event.dataTransfer.files && event.dataTransfer.files[0]
        ? [...images, ...event.dataTransfer.files]
        : [...images]
    );
  }

  const handleDragLeave = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    setDragActive(false);
  }

  const handleDragActive = (event: any)=>  {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(true);
  }

  // Image uploading functions
  const handleSubmit = (event: any) => {
    const formData = new FormData();

    if (!images.length) {
      // Temporary error-handling/debug for now
      alert("No image files detected. Please upload some images first and try again.");
      return;
    }

    images.forEach((image) => {
      formData.append("images", image)
    })

    setUploadActive(true);
    setFirstUploadMade(true);      // Should always stay true after first upload
    uploadImage(formData)
  }

  const uploadImage = async (imageData: FormData) => {
    // Using temporary URL for now...
    const url: string = "http://127.0.0.1:1000/";

    await fetch( url + "image_posting", {
      method: "POST",
      body: imageData
    }).then(
      async (res) => {
        res.json().then(data => console.log(data));
        
        if (res.ok) {
          // alert("Successfully uploaded image(s)!");
          setUploadActive(false);
          await new Promise(resolve => setTimeout(resolve, 500));
          setResultsActive(true);
        } else {
          alert("There was a server error during image upload.");
        }
      }
    ).catch(
      (error) => {
        console.error("Error:", error);
        alert("An error ocurred while uploading the image; please try again later.");
      }
    )
  }

  // Loading & results modals - specific to upload page, and appears when images are being processed
  const ResultsModal = ({ children }: Props) => {
    return(
      <div 
        className={`${!firstUploadMade ? "opacity-0 invisible z-[-1]" : ((uploadActive || resultsActive) ? "bg-anim-in" : "bg-anim-out")}
          fixed z-10 w-full h-full bg-black/[0.4] px-[100px] flex justify-center`
        }
      >
        {/* Loading Modal */}
        {/* Duplicate below for another copy of the modal for showing results, such that it displays after loading modal */}
        <div
          className={`${uploadActive ? "modal-anim-in" : "modal-anim-out"}
            ${resultsActive ? "hidden" : (!uploadActive ? "hidden" : "")}
            max-w-[824px] w-full container translate-y-[-5%]
            h-fit min-h-[50%] my-auto bg-white rounded-[48px] 
            border-2 border-[#828282]
            flex justify-center flex-col align-middle gap-[25px]`}
        >
          <img src={LoadingGif} alt="" className="max-w-[250px] w-full h-auto relative left-[50%] translate-x-[-50%] mt-[-10px]" />
          <span className="text-[#4c4c4c] text-[30px] font-bold font-google relative left-[50%] translate-x-[-50%] w-fit tracking-[0.01em]">
            Processing Images...
          </span>
        </div>

        {/* Results Modal */}
        <div
          className={`${uploadActive ? "hidden" : (resultsActive ? "modal-anim-in" : "modal-anim-out")}
            max-w-[824px] w-full container translate-y-[-5%]
            h-fit min-h-[50%] my-auto bg-white rounded-[48px] 
            border-2 border-[#828282]
            flex justify-center flex-col align-middle gap-[25px]`}
        >
          <img src={SuccessIcon} alt="" className="max-w-[100px] w-full h-auto relative left-[50%] translate-x-[-50%] mt-[-10px]" />
          <span className="text-[#4c4c4c] text-[30px] font-bold font-google relative left-[50%] translate-x-[-50%] w-fit tracking-[0.01em]">
            Successfully analyzed images!
          </span>
          <div className="mt-[20px] w-fit relative left-[50%] translate-x-[-50%] italic">(Cue some sort of scrollable results section here...)</div>
          <button
            className="bg-[#387eed] cursor-pointer
              max-w-[338px] min-h-[51px] h-fit w-full mx-auto mt-[20px]
              bg-[#387eed] rounded-[25px] flex justify-center align-middle
              transition-all ease-in-out focus-visible:outline-none"
            onClick={() => {
              setResultsActive(false);
            }}
          >
            <span className="text-center text-white text-md font-bold font-google my-auto">
              Upload More Images
            </span>
          </button>
        </div>
      </div>
    );
  };

  // Upload drag-and-drop area component
  const UploadBox = () => {
    return(
      <div className="w-full h-full flex items-center justify-center">
        <form
          id="upload-form"
          className={`${dragActive ? "bg-[#d9e7ff] border-[4px] border-[#a1c5fe] bg-none" : ""}
            dashed-box  
            w-full min-h-[346px] h-full text-center
            flex flex-col items-center justify-center`}
          onDragEnter={handleDragActive}
          onSubmit={(event) => event.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragActive}
        >
          {/* Input for drag and drop; currently not implemented, WIP */}
          <input
            type="file"
            name="images"
            id="image-upload-click"
            multiple
            hidden
            accept="image/png, image/jpeg, image/bmp"
            // ref={inputRef}

            // Move the following below to separate handleUpload/Change function, so this can also be used for drag-drop
            onChange={handleChange}
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

          </div>
        </form>
      </div>
    )
  }

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
      <ResultsModal />
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
            <UploadBox />
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
            <button
              className={`${
                images.length && !uploadActive
                  ? "bg-[#387eed] cursor-pointer"
                  : "bg-[#8ebaff] cursor-default"
              }
                max-w-[338px] min-h-[51px] h-fit w-full mx-auto
                bg-[#387eed] rounded-[25px] flex justify-center align-middle
                transition-all ease-in-out focus-visible:outline-none
              `}
              onClick={handleSubmit}
              disabled={images.length <= 0 && !uploadActive}
              type="submit"
              form="upload-form"
            >
              <span className="text-center text-white text-md font-bold font-google my-auto">
                {uploadActive ? "Uploading Files..." : "Upload Files"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
