import React, { useState } from "react";
import { useImage } from "react-image";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";

import "./Picture.css";
import { AnswerEntry } from "../types";
import { PhotoCamera } from "@material-ui/icons";
import { useAppDispatch, useAppSelector } from "../store";

interface PictureProps {
  answer?: AnswerEntry;
  questionId?: string;
  year?: number;
  allowEdit?: boolean;
}

const PictureLoading: React.FC = () => (
  <div className="picture-loading">
    <LinearProgress color="secondary" />
  </div>
);

export const Picture: React.FC<PictureProps> = ({
  answer,
  allowEdit,
  questionId,
  year,
}) => {
  const dispatch = useAppDispatch();
  const isUploading = useAppSelector((state) => state.answers.isUploading);
  const { src, isLoading: imageLoading } = useImage({
    srcList: [answer?.pictureUrl, "/img/placeholder.png"].filter(
      Boolean
    ) as string[],
    useSuspense: false,
  });
  const [file, setFile] = useState<File>();

  const handleOnFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const fileSelected = e.target.files?.[0];

    if (!questionId || !year || !fileSelected) {
      return;
    }

    setFile(fileSelected);
    dispatch({
      type: "ANSWERS_UPLOADING_PICTURE",
      payload: {
        questionId,
        year,
        file: fileSelected,
      },
    });
  };

  return (
    <div className="picture-container">
      {!allowEdit ? (
        imageLoading ? (
          <PictureLoading />
        ) : (
          <img
            className="picture"
            src={src}
            alt={answer?.value || "no image"}
          />
        )
      ) : (
        <>
          {isUploading || imageLoading ? (
            <PictureLoading />
          ) : (
            <img
              className="picture"
              src={src}
              alt={answer?.value || "no image"}
            />
          )}
          <input
            type="file"
            id="picture-upload"
            accept="image/*"
            onChange={handleOnFileChange}
            className="picture-upload-input"
          />
          <label className="picture-upload-label" htmlFor="picture-upload">
            <Button color="primary" component="span" disabled={isUploading}>
              <PhotoCamera /> Upload a picture
            </Button>
          </label>

          {file && <label className="picture-upload-name">{file.name}</label>}
        </>
      )}
    </div>
  );
};
