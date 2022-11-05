import React from "react";
import styles from "features/post/PostWrite.module.css";
import Text from "components/Text";
import ButtonStyled from "components/Button";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import PostWriteTitle from "./PostWriteTitle";
import PostWriteContents from "./PostWriteContents";

const PostWrite = () => {
  return (
    <div className={styles.postWrite}>
      <div className={styles.scrollUp}>
        <Text value="게시글 작성" type="groupTitle" bold />
        <br />
        <br />
        <Text
          value="간편하게 깃허브 블로그 게시글을 작성해보세요."
          type="caption"
          color="gray"
        />
        <div className={styles.postWriteButtons}>
          <ButtonStyled
            label="돌아가기"
            color="sky"
            width="10vw"
            icon={<RefreshOutlinedIcon />}
          />
          &nbsp; &nbsp;
          {/* <ButtonStyled label="미리보기" width="10vw" /> */}
          <ButtonStyled
            label="작성완료"
            width="10vw"
            icon={<CheckOutlinedIcon />}
          />
        </div>
      </div>

      <div style={{ display: "flex", marginTop: "1%" }}>
        <PostWriteTitle />
        <PostWriteContents />
      </div>
    </div>
  );
};

export default PostWrite;
