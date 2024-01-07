import generateFileID, { Uppy } from "@uppy/core";
import Tus from "@uppy/tus";

export { generateFileID };

interface fileUploadProps {
  autoProceed?: boolean;
  minFiles?: number;
  maxFiles?: number;
  maxFileSize?: number;
  multipleUploads?: boolean;
}

const allowAudio = [
  ".aac",
  ".ac3",
  ".aiff",
  ".amr",
  ".au",
  ".flac",
  ".m4a",
  ".mid",
  ".mka",
  ".mp3",
  ".ogg",
  ".ra",
  ".wav",
  ".wma",
];
const allowDocuments = [
  ".doc",
  ".docx",
  ".pdf",
  ".ppt",
  ".pptx",
  ".txt",
  ".xls",
  ".xlsx",
];
const allowImage = [
  ".ai",
  ".bmp",
  ".gif",
  ".jpeg",
  ".jpg",
  ".heic",
  ".ico",
  ".png",
  ".psd",
  ".svg",
  ".tif",
  ".tiff",
  ".webp",
];
const allowVideo = [
  ".asf",
  ".avi",
  ".hevc",
  ".m2ts",
  ".m2v",
  ".m4v",
  ".mkv",
  ".mov",
  ".mp4",
  ".mpeg",
  ".mpg",
  ".mts",
  ".mxf",
  ".ogv",
  ".rm",
  ".ts",
  ".vob",
  ".webm",
  ".wmv",
  ".wtv",
];

const allowedFileTypes = [
  ...allowAudio,
  ...allowDocuments,
  ...allowImage,
  ...allowVideo,
];

export function useFileUpload(props: fileUploadProps) {
  const minNumberOfFiles = props.minFiles ? props.minFiles : 1;
  const maxNumberOfFiles = props.maxFiles ? props.maxFiles : 300;
  const maxFileSize = props.maxFileSize ? props.maxFileSize : 2000000000;
  const autoProceed = props.autoProceed ? props.autoProceed : false;
  const allowMultipleUploads = props.multipleUploads
    ? props.multipleUploads
    : true;

  const uppy = new Uppy({
    restrictions: {
      minNumberOfFiles: minNumberOfFiles,
      maxNumberOfFiles: maxNumberOfFiles,
      maxFileSize: maxFileSize,
      allowedFileTypes: allowedFileTypes,
    },
    autoProceed: autoProceed,
    allowMultipleUploads: allowMultipleUploads,
    onBeforeFileAdded: (currentFile, files) => {
      const extension = `.${currentFile.extension}`;

      const getDupes = () => {
        const dupes = [] as any[];
        const keys = Object.keys(files);

        if (keys.length) {
          keys.forEach((key) => {
            const fileData = files[key]?.data as any;
            const currentFileData = currentFile.data as any;

            if (
              currentFileData.filepath === fileData.filepath &&
              currentFileData.size === fileData.size
            ) {
              dupes.push(currentFileData.filepath);
            }
          });
        }

        return dupes.length > 0;
      };

      if (!allowedFileTypes.includes(extension)) {
        const modifiedFile = {
          ...currentFile,
          restricted: true,
        };
        return modifiedFile;
      } else if (getDupes()) {
        const modifiedFile = {
          ...currentFile,
          duplicate: true,
        };
        return modifiedFile;
      }
    },
  }).use(Tus, {
    // endpoint: `${process.env.NEXT_PUBLIC_DAM_STORAGE_UPLOAD_URL}/upload`,
    endpoint: "http://127.0.0.1:1080/upload",
    chunkSize: 5242880,
  });

  return uppy;
}
