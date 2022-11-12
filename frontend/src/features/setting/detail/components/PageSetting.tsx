import React from "react";
import Text from "components/Text";
import RadioButton from "components/RadioButton";
import styles from "../../Setting.module.css";
import { SketchPicker } from "react-color";
import { useAppSelector } from "app/hooks";
import { colorsConfig, selectColors, setColors } from "slices/settingSlice";
import { useDispatch } from "react-redux";

const PageSetting = () => {
  const colors: colorsConfig = useAppSelector(selectColors);
  const dispatch = useDispatch();

  const handleChangeComplete = (color: any) => {
    dispatch(setColors({ ...colors, page: { background: color } }));
  };

  return (
    <div>
      <div className={styles.checkListTitle}>
        <Text value="페이지" type="text" bold />
      </div>
      <div className={styles.detailContents}>
        <div className={styles.detailItem}>
          <div className={styles.textPaddingSm}>
            <RadioButton label="색상 설정" value="color" checked />
          </div>
          <div>
            <SketchPicker
              color={colors.page.background}
              onChangeComplete={(color) => handleChangeComplete(color.hex)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSetting;
