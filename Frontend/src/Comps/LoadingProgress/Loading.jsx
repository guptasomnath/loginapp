import React, {useContext} from "react";
import "./Loading.css";
import { LoadingContext } from "../../App";

function Loading() {
 const {loadingState} = useContext(LoadingContext);
  return (
    <div style={loadingState} className="loaderParent">
      <div className="loaderChild"></div>
    </div>
  );
}

export default Loading;
