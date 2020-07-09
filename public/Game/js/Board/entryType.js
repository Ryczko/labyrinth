export const entryType = (type, rotation) => {
  if (type === "roadCorner") {
    if (rotation === "-90") return "bottom,left";
    else if (rotation === "0") return "top,left";
    else if (rotation === "90") return "top,right";
    else if (rotation === "180") return "right,bottom";
  } else if (type === "roadEast") {
    if (rotation === "-90" || rotation === "90") return "top,bottom";
    else if (rotation === "0" || rotation === "180") return "right,left";
  } else if (type === "roadSplit") {
    if (rotation === "-90") return "top,right,bottom";
    else if (rotation === "0") return "right,bottom,left";
    else if (rotation === "90") return "top,bottom,left";
    else if (rotation === "180") return "top,right,left";
  }
};
