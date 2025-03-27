import Header from "./Header";
import { useState, ReactNode, useRef } from "react";

import ImagePopup from "./ImagePopup";
import UploadArrow from "../vendor/img/UploadPage/upload-arrow.png";
import DeleteIcon from "../vendor/img/UploadPage/trash-icon.png";
import LoadingGif from "../vendor/img/UploadPage/loading.gif";
import SuccessIcon from "../vendor/img/UploadPage/success.png";
import FileNotFoundIcon from "../vendor/img/UploadPage/file-not-found.png";
import { handleUpload } from "../Network/uploadFile";
import {
  handleDragActive,
  handleDragLeave,
  handleDrop,
} from "./utils/handleDrag";

interface Props {
  children?: ReactNode;
}

interface ImageWithPatient {
  file: File;
  patientName: string;
}

interface PreviewProps extends Props {
  file: File;
  fileIndex: number;
  patientName: string;
  onPatientNameChange: (index: number, name: string) => void;
}

interface ResultsEntryProps extends Props {
  file?: File;
  name: string;
  label: string;
  confidenceVal?: number;
}

const UploadPage = () => {
  ///* Constants and useState() Variables *///
  const [images, setImages] = useState<ImageWithPatient[]>([]);
  const [results, setResults] = useState<
    { name: string; label: string; confidenceVal?: number }[]
  >([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadActive, setUploadActive] = useState<boolean>(false);
  const [resultsActive, setResultsActive] = useState<boolean>(false);
  const [pageReady, setPageReady] = useState<boolean>(true);

  ///* Auxiliary Handler Functions *///
  const shortenFileName = (origName: string) => {
    let fileName, fileNameTemp;
    const maxNameSize = 25;

    if (origName.length > maxNameSize) {
      fileNameTemp = [
        origName.split(".").slice(0, -1).join("."),
        origName.split(".").slice(-1)[0],
      ];

      fileName = `${fileNameTemp[0].slice(
        0,
        maxNameSize - 7 - fileNameTemp[1].length
      )}...${fileNameTemp[0].slice(-3)}.${fileNameTemp[1]}`;
    } else {
      fileName = origName;
    }

    return fileName;
  };

  const handleDelete = (deleteIndex: number) => {
    const tempImages = [...images];
    tempImages.splice(deleteIndex, 1);
    setImages(tempImages);
  };

  const handlePatientNameChange = (index: number, name: string) => {
    const updatedImages = [...images];
    updatedImages[index].patientName = name;
    setImages(updatedImages);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const newImages = Array.from(event.target.files).map(file => ({
        file,
        patientName: ''
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (!images.length) {
      alert("No image files detected. Please upload some images first and try again.");
      return;
    }

    const userStri = localStorage.getItem('user') || "default_value";
    const user = JSON.parse(userStri);
    const userEmail = user.email
    console.log("useremail ",userEmail);


    images.forEach((image) => {
      formData.append("images", image.file);
      formData.append("patientNames", image.patientName);
      formData.append("doctorEmail",userEmail)

      console.log(image)

    });

    setPageReady(false);
    setUploadActive(true);
    uploadImage(formData);
  };

  const uploadImage = async (imageData: FormData) => {
    const response = await handleUpload(imageData);
    if (!response || response.error) {
      alert("There was a server error during image upload.");
      setUploadActive(false);
      setPageReady(true);
      return;
    } else {
      setResults([...response.message]);
      setUploadActive(false);
      setResultsActive(true);
    }
  };

  ///* Subcomponents *///
  const ResultsEntry = ({ file, name, label }: ResultsEntryProps) => {
    const fileName = shortenFileName(name);

    return (
      <tr className="h-[50px] border-b border-[#e9e9e9] font-body">
        <td>
          <ImagePopup
            imageSrc={file ? URL.createObjectURL(file) : FileNotFoundIcon}
          ></ImagePopup>
        </td>
        <td>{fileName}</td>
        <td>{`${label[0].toUpperCase()}${label.slice(1)}`}</td>
      </tr>
    );
  };

  const ResultsModal = () => {
    return (
      <div
        className={`${
          pageReady
            ? "opacity-0 invisible z-[-1]"
            : uploadActive || resultsActive
            ? "bg-anim-in"
            : "bg-anim-out"
        }
          fixed z-10 w-full h-full bg-black/[0.4] px-[100px] flex justify-center`}
      >
        {/* Loading Modal */}
        <div
          className={`${uploadActive ? "modal-anim-in" : "modal-anim-out"}
            ${resultsActive ? "hidden" : !uploadActive ? "hidden" : ""}
            max-w-[824px] w-full container translate-y-[-5%]
            h-fit min-h-[50%] my-auto py-[30px] bg-white rounded-[48px] 
            border-2 border-[#828282]
            flex justify-center flex-col align-middle gap-[25px]`}
        >
          <img
            src={LoadingGif}
            alt=""
            className="max-w-[250px] w-full h-auto relative left-[50%] translate-x-[-50%] mt-[-10px]"
          />
          <span className="text-[#4c4c4c] text-[30px] font-bold font-google relative left-[50%] translate-x-[-50%] w-fit tracking-[0.01em]">
            Processing Images...
          </span>
        </div>

        {/* Results Modal */}
        <div
          className={`${
            resultsActive
              ? "modal-anim-in"
              : uploadActive || pageReady
              ? "hidden"
              : "modal-anim-out"
          }
            max-w-[824px] w-full container
            h-fit min-h-[75%] my-auto bg-white rounded-[48px] 
            border-2 border-[#828282]
            flex justify-between flex-col align-middle gap-[40px]`}
        >
          <div className="w-fit h-fit flex justify-center flex-col align-middle relative left-[50%] translate-x-[-50%] gap-[20px] mt-[80px]">
            <img
              src={SuccessIcon}
              alt=""
              className="max-w-[100px] w-full h-auto relative left-[50%] translate-x-[-50%] mt-[-10px]"
            />
            <span className="text-[#4c4c4c] text-[30px] font-bold font-google relative left-[50%] translate-x-[-50%] w-fit tracking-[0.01em]">
              Successfully analyzed images!
            </span>
          </div>

          <div className="w-auto h-fit relative mx-[100px]">
            <span className="text-[#4c4c4c] text-[22px] font-google tracking-[0.02em]">
              Results
            </span>

            <div
              className={`${
                results && results.length > 3 ? "overflow-y-scroll" : ""
              }
                border border-[#d2d2d2] rounded-[10px] w-full mt-[10px] 
                max-h-[calc(50px*4)] h-auto overflow-x-hidden`}
            >
              <table className="w-full h-fit mx-[20px] w-[calc(100%-40px-0.5px)]">
                <thead>
                  <tr className=" h-[45px] font-body text-[15px] text-[#8b8b8b] border-b border-[#d6d6d6]">
                    <th className="font-normal">Preview</th>
                    <th className="font-normal text-left">File Name</th>
                    <th className="font-normal text-left">Classification</th>
                  </tr>
                </thead>
                <tbody className="max-h-[calc(50px*4)] h-auto font-body text-[#1f1f1f] text-[14px]">
                  {results.map((imgResult, index) => {
                    const file =
                      images[index]?.file.name == imgResult.name
                        ? images[index]?.file
                        : undefined;
                    return (
                      <ResultsEntry
                        key={`${imgResult.name}-${index}-result`}
                        file={file}
                        name={imgResult.name}
                        label={imgResult.label}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <button
            className="bg-[#387eed] cursor-pointer
              max-w-[338px] min-h-[51px] h-fit w-full mx-auto mt-[10px] mb-[60px]
              hover:bg-[#2471ec] active:bg-[#154fad] rounded-[25px] flex justify-center align-middle
              transition-all ease-in-out focus-visible:outline-none"
            onClick={async () => {
              setResultsActive(false);
              await new Promise((resolve) => setTimeout(resolve, 500));
              setResults([]);
              setPageReady(true);
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

  const UploadBox = () => {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <form
          id="upload-form"
          className={`${
            dragActive
              ? "bg-[#d9e7ff] border-[4px] border-[#a1c5fe] bg-none"
              : ""
          }
            dashed-box  
            w-full min-h-[346px] h-full text-center
            flex flex-col items-center justify-center`}
          onDragEnter={(event) => {
            if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
              setDragActive(true);
            }
          }}
          onSubmit={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
              const newImages = Array.from(event.dataTransfer.files).map(file => ({
                file,
                patientName: ''
              }));
              setImages([...images, ...newImages]);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
              setDragActive(true);
            }
          }}
        >
          <input
            type="file"
            name="images"
            id="image-upload-click"
            multiple
            hidden
            accept="image/png, image/jpeg, image/bmp"
            onChange={handleChange}
          />

          <div className="flex flex-col justify-evenly gap-[8px]">
            <img
              src={UploadArrow}
              alt=""
              draggable={false}
              className="w-[81px] h-auto mx-auto mb-[26px] select-none"
            />

            <span className="text-center text-[#4c4c4c] text-base font-bold font-body mx-[30px]">
              Drag & drop files to upload
            </span>

            <span className="text-center text-[#4c4c4c] text-sm font-normal font-body">
              or
            </span>

            <label
              htmlFor="image-upload-click"
              className="
                max-w-[138px] min-h-[39px] h-fit w-full mx-auto
                bg-[#387eed] hover:bg-[#2471ec] active:bg-[#154fad]  
                rounded-[25px] flex justify-center align-middle cursor-pointer
                transition-all ease-in-out
              "
            >
              <span className="text-center text-white text-sm font-bold font-google my-auto cursor-pointer">
                Browse files...
              </span>
            </label>
          </div>
        </form>
      </div>
    );
  };

  const PreviewCapsule = ({ file, fileIndex, patientName, onPatientNameChange }: PreviewProps) => {
    const fileName = shortenFileName(file.name);
    const [localName, setLocalName] = useState(patientName);
    const inputRef = useRef<HTMLInputElement>(null);
  
    // Update parent only when input loses focus
    const handleBlur = () => {
      if (localName !== patientName) {
        onPatientNameChange(fileIndex, localName);
      }
    };
  
    return (
      <div className="md:max-w-[413px] min-h-[79px] w-full h-fit px-[24px] flex flex-col justify-center bg-white rounded-xl border border-[#d2d2d2]">
        <div className="h-fit w-full flex gap-[18.5px] justify-evenly">
          <ImagePopup imageSrc={URL.createObjectURL(file)}></ImagePopup>
          <div className="w-full h-fit flex flex-col">
            <div>{fileName}</div>
            <input
              ref={inputRef}
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleBlur}
                placeholder="Patient name"
              className="mt-2 p-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <img
            src={DeleteIcon}
            alt=""
            className="w-5 h-5 m-auto cursor-pointer select-none hover:shake-anim focus:shake-anim"
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
                  <PreviewCapsule
                    key={`${image.file.name}-${index}`}
                    file={image.file}
                    fileIndex={index}
                    patientName={image.patientName}
                    onPatientNameChange={handlePatientNameChange}
                  />
                ))
              ) : (
                <span className="w-full px-[30px] text-center text-black text-[17px] font-extralight italic font-body">
                  There are no files to preview...
                </span>
              )}
            </div>
            <button
              className={`${
                images.length && !uploadActive
                  ? "bg-[#387eed] hover:bg-[#2471ec] active:bg-[#154fad] cursor-pointer"
                  : "bg-[#8ebaff] cursor-default"
              }
                max-w-[338px] min-h-[51px] h-fit w-full mx-auto
                rounded-[25px] flex justify-center align-middle
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