import React, { Suspense } from "react";
import { useImage } from "react-image";
import LinearProgress from "@material-ui/core/LinearProgress";

import "./Picture.css";
import { AnswerEntry } from "../types";

interface PictureProps {
  answer?: AnswerEntry;
}

const PictureLoading: React.FC = () => (
  <div className="picture-loading">
    <LinearProgress color="secondary" />
  </div>
);

const PictureRender: React.FC<PictureProps> = ({ answer }) => {
  const { src } = useImage({
    srcList: [answer?.pictureUrl, "/img/placeholder.png"].filter(
      Boolean
    ) as string[],
  });

  return (
    <img className="picture" src={src} alt={answer?.value || "no image"} />
  );
};

export const Picture: React.FC<PictureProps> = ({ answer }) => {
  return (
    <div className="picture-container">
      <Suspense fallback={<PictureLoading />}>
        <PictureRender answer={answer} />
      </Suspense>
    </div>
  );
};
