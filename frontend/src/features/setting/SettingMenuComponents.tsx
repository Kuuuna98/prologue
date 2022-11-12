import React, { useState } from "react";
import styles from "./Setting.module.css";

import CategoryLayout from "./CategoryLayout";
import ConfirmButton from "./ConfirmButton";
import CategoryCntSetting from "./CategoryCntSetting";
import PageLayout from "./PageLayout";
import LayoutSelector from "./layout/LayoutSelector";
import LayoutSample from "./layout/LayoutSample";
import DetailSelector from "./detail/DetailSelector";
import DetailSetting from "./detail/DetailSetting";
import MyInfoPage from "pages/MyInfoPage";

export const blogTabs = [
  {
    label: "블로그 정보 설정",
    Component: (
      <div>
        <MyInfoPage />
      </div>
    ),
  },
  {
    label: "카테고리 설정",
    Component: (
      <div>
        <CategoryLayout />
        <CategoryCntSetting />
      </div>
    ),
  },
  {
    label: "페이지 설정",
    Component: (
      <div>
        <PageLayout />
      </div>
    ),
  },
];

export const layoutTabs = [
  {
    label: "레이아웃 선택",
    Component: (
      <div>
        <LayoutSelector />
        <LayoutSample />
      </div>
    ),
  },
  {
    label: "세부 레이아웃 설정",
    Component: (
      <div>
        <DetailSetting />
      </div>
    ),
  },
];
