import * as React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import MobileStepper from "@mui/material/MobileStepper";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { assetUrl } from "../utils/assetUrl";

export interface ImageCarouselProps {
  /** Gallery image paths (public/ relative); resolved through `assetUrl`. */
  images: string[];
}

/**
 * Manually-operated image carousel. Never autoplays — navigation happens
 * only through the chevron buttons (overlaid on the frame and in the
 * MobileStepper) which clamp/disable at the bounds.
 */
export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [index, setIndex] = React.useState(0);
  const [failed, setFailed] = React.useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );

  if (images.length === 0) {
    return null;
  }

  const maxIndex = images.length - 1;
  const activeIndex = Math.min(index, maxIndex);
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === maxIndex;
  const hasControls = images.length > 1;
  const src = assetUrl(images[activeIndex]);
  const isBroken = failed.has(src);

  const goPrev = () =>
    setIndex((current) => Math.max(0, Math.min(current, maxIndex) - 1));
  const goNext = () =>
    setIndex((current) => Math.min(maxIndex, Math.min(current, maxIndex) + 1));

  const handleError = (event: React.SyntheticEvent<HTMLDivElement>) => {
    const brokenSrc = event.currentTarget.getAttribute("src") ?? "";
    setFailed((current) => {
      if (current.has(brokenSrc)) {
        return current;
      }
      const next = new Set(current);
      next.add(brokenSrc);
      return next;
    });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Fade in appear key={activeIndex}>
          <Box sx={{ width: "100%", height: "100%" }}>
            {isBroken ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  color: "text.disabled",
                }}
              >
                <ImageNotSupportedOutlinedIcon />
              </Box>
            ) : (
              <Box
                component="img"
                src={src}
                alt=""
                onError={handleError}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            )}
          </Box>
        </Fade>
        {/*{hasControls && (
          <IconButton
            aria-label="previous image"
            onClick={goPrev}
            disabled={atStart}
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              left: "8px",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}*/}
        {/*{hasControls && (
          <IconButton
            aria-label="next image"
            onClick={goNext}
            disabled={atEnd}
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              right: "8px",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}*/}
      </Box>
      {hasControls && (
        <MobileStepper
          variant="dots"
          position="static"
          steps={images.length}
          activeStep={activeIndex}
          backButton={
            <IconButton
              aria-label="previous image"
              onClick={goPrev}
              disabled={atStart}
              size="small"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          }
          nextButton={
            <IconButton
              aria-label="next image"
              onClick={goNext}
              disabled={atEnd}
              size="small"
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          }
          sx={{ mt: 1, bgcolor: "transparent" }}
        />
      )}
    </Box>
  );
}
