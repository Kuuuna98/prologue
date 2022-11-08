import React from "react";
import BlogCreateBox from "features/blog/blogCreate/BlogCreateBox";
import BlogLayoutSetting from "features/blog/blogCreate/BlogLayoutSetting";
import BlogStepper from "features/blog/blogCreate/BlogStepper";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BlogDashboardMoveModal from "features/blog/BlogDashboardMoveModal";
import Axios from "api/JsonAxios";
import api from "api/Api";
import { useSelector } from "react-redux";
import { rootState } from "app/store";

const LandingPage = () => {
  const navigate = useNavigate();

  const [isStepNumber, setStepNumber] = React.useState(0);
  const [radioValue, setRadioValue] = React.useState("CustomLayout");

  const { accessToken, githubId } = useSelector((state: rootState) => state.auth);

  const createRepo = () => {
    Axios.post(api.blog.setRepo(accessToken, githubId));
    setStepNumber(1);
  };
  const layoutSetting = () => {
    console.log(radioValue);
    if (radioValue === "GatsbyLayout") navigate("/create/gatsby");
    if (radioValue === "CustomLayout") {
      setStepNumber(2);
      setTimeout(() => {
        // 블로그 생성시 필요한 것
      }, 2000);
    }
  };

  return (
    <div style={{ paddingTop: "5%" }}>
      <BlogStepper step={isStepNumber} />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "5%",
        }}
      >
        {isStepNumber === 0 ? (
          <BlogCreateBox onClick={createRepo} />
        ) : isStepNumber === 1 ? (
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <BlogLayoutSetting radioValue={radioValue} setValue={setRadioValue} onClick={layoutSetting} />
          </Stack>
        ) : (
          <BlogDashboardMoveModal />
        )}
      </div>
    </div>
  );
};

export default LandingPage;
