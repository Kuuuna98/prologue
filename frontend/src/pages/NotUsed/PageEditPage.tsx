import { useEffect, useState } from "react";
import styles from "styles/Post.module.css";
import Text from "components/Text";
import Button from "components/Button";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "apis/MultipartAxios";
import api from "apis/BaseUrl";
import PageViewerContents from "pages/NotUsed/PageViewerContents";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectPostContent, selectPostFileList, selectPostFiles, setPostFileList } from "slices/postSlice";
import Modal from "components/Modal";
import { useAuthStore } from "stores/authStore";
import { useShallow } from "zustand/react/shallow";

interface modifyDetailPageRequestProps {
  accessToken: string;
  githubId: string;
  pageName: string;
  content: string;
  images: any[];
}

const PageEditPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [accessToken, githubId] = useAuthStore(useShallow((state) => [state.accessToken, state.githubId]));
  const { pageName } = useParams();

  const [loading, setLoading] = useState(false);
  const [contentData, setContentData] = useState("");
  const [savedFileList] = useState([]);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const content = useAppSelector(selectPostContent);
  const fileList = useAppSelector(selectPostFileList);
  const files = useAppSelector(selectPostFiles);

  const getPageDetail = async () => {
    await Axios.get(api.posts.getPage(accessToken, githubId, pageName)).then((res) => {
      setContentData(res.data.content);

      for (let i = 0; i < res.data.images.length; i++) {
        const image = { name: res.data.images[i].name, url: res.data.images[i].url };
        savedFileList.push(image);
        dispatch(setPostFileList([...savedFileList, image]));
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    getPageDetail();
    setLoading(false);
  }, [loading]);

  const editPage = () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const modifyDetailPageRequest: modifyDetailPageRequestProps = {
      accessToken: accessToken,
      githubId: githubId,
      pageName: pageName,
      content: content,
      images: [],
    };

    if (fileList.length) {
      for (let i = 0; i < fileList.length; i++) {
        const tmp = {
          url: fileList[i].url,
          name: fileList[i].name,
        };
        modifyDetailPageRequest.images.push(tmp);
      }
    }

    formData.append(
      "modifyDetailPageRequest",
      new Blob([JSON.stringify(modifyDetailPageRequest)], { type: "application/json" }),
    );

    Axios.put(api.posts.modifyPage(), formData).then(() => {
      // navigate(-1);
    });

    dispatch(setPostFileList([]));
  };

  const showCancelModal = () => {
    setCancelModalOpen(true);
  };

  const showSaveModal = () => {
    setSaveModalOpen(true);
  };

  return (
    <div className={styles.postWrite}>
      <div className={styles.textBox}>
        <Text value="페이지 수정" type="groupTitle" bold />
        <br /> <br />
        <Text value="간편하게 페이지 글을 수정해보세요." type="caption" color="dark_gray" />
        <div className={styles.postWriteButtons}>
          <Button label="돌아가기" color="sky" width="10vw" icon={<RefreshOutlinedIcon />} onClick={showCancelModal} />
          &nbsp; &nbsp; &nbsp;
          <Button label="작성완료" width="10vw" icon={<CheckOutlinedIcon />} onClick={showSaveModal} />
        </div>
      </div>

      <div style={{ marginTop: "1%" }}>
        {/* <PostWriteContents /> */}
        <PageViewerContents content={contentData} />
      </div>

      {cancelModalOpen && (
        <Modal
          text={`정말 페이지 설정으로 돌아가시겠습니까?\n수정 중인 페이지 내용은 사라집니다.`}
          twoButtonCancel={() => setCancelModalOpen(false)}
          twoButtonConfirm={() => navigate(-1)}
        />
      )}
      {saveModalOpen && (
        <Modal
          text={`페이지 수정을 완료하시겠습니까?`}
          twoButtonCancel={() => setSaveModalOpen(false)}
          twoButtonConfirm={editPage}
        />
      )}
    </div>
  );
};

export default PageEditPage;
