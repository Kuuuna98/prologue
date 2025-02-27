import { Fragment } from "react";

import GridLayout from "react-grid-layout";
import styles from "styles/Setting.module.css";
import "../../../../node_modules/react-grid-layout/css/styles.css";
import Text from "components/Text";
import DefaultLayoutStyles from "./DefaultLayoutStyles";
import { useSettingStore } from "stores/settingStore";

const LayoutSample = (layoutWidth: any) => {
  const clickedIdx = useSettingStore((state) => state.clickedLayoutIdx);
  const DefaultLayoutList = DefaultLayoutStyles();
  const width = layoutWidth["layoutWidth"];

  const getLayout = () => {
    return DefaultLayoutList[clickedIdx].layout;
  };

  const getComponents = () => {
    return DefaultLayoutList[clickedIdx].components;
  };

  return (
    <>
      <GridLayout
        layout={getLayout()}
        cols={5}
        rowHeight={50}
        width={width - 20}
        isDraggable={false}
        isResizable={false}
      >
        {getComponents().map((item) => {
          {
            return DefaultLayoutList[clickedIdx].checkList[item.id] ? (
              <div className={styles.layout_colored} key={item.key}>
                <div className={styles.innerText}>
                  <div style={{ marginTop: "15px" }}></div>
                  <Text value={item.key} type="caption" color="gray" />
                </div>
              </div>
            ) : (
              <Fragment />
            );
          }
        })}
      </GridLayout>
    </>
  );
};

export default LayoutSample;
