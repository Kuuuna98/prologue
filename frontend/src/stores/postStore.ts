import { PostDetailConfig, PostListConfig } from "interfaces/post.interface";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface State {
  editPost: PostDetailConfig;

  postList: PostListConfig[];
  postIndex: number;
  postIsLast: boolean;

  isEdit: boolean;
  tempId: null | number;
}

interface Action {
  actions: {
    setEditPostAction: (post: PostDetailConfig) => void;
    setPostTitleAction: (title: string) => void;
    setPostDescriptionAction: (description: string) => void;
    setPostCategoryAction: (category: string) => void;
    setPostTagListAction: (tagList: string[]) => void;
    setPostContentAction: (content: string) => void;
    setPostFileListAction: (fileList: any[]) => void;
    resetPostFileListAction: () => void;
    setPostFileAction: (files: any[]) => void;

    setPostListAction: (postList: PostListConfig[]) => void;
    resetPostListAction: () => void;
    setPostIndexAction: (index: number) => void;
    resetPostIndexAction: () => void;
    setPostIsLastAction: (isLast: boolean) => void;
    setPostIsEditAction: (isEdit: boolean) => void;
    setTempIdAction: (tempId: number) => void;
  };
}

export const initialState: State = {
  editPost: {
    title: "",
    description: "",
    category: "",
    tagList: [],
    content: "",
    fileList: [],
    files: [],
    images: [],
  },

  postList: [],
  postIndex: -1,
  postIsLast: false,

  isEdit: false,
  tempId: null,
};

export const usePostStore = create<State & Action>()(
  immer((set) => ({
    ...initialState,
    actions: {
      setEditPostAction: (post: PostDetailConfig) => set(() => ({ editPost: post })),
      setPostTitleAction: (title: string) => set((state) => ({ editPost: { ...state.editPost, title } })),
      setPostDescriptionAction: (description: string) =>
        set((state) => ({ editPost: { ...state.editPost, description } })),
      setPostCategoryAction: (category: string) => set((state) => ({ editPost: { ...state.editPost, category } })),
      setPostTagListAction: (tagList: string[]) => set((state) => ({ editPost: { ...state.editPost, tagList } })),
      setPostContentAction: (content: string) => set((state) => ({ editPost: { ...state.editPost, content } })),
      setPostFileListAction: (fileList: any[]) => set((state) => ({ editPost: { ...state.editPost, fileList } })),
      resetPostFileListAction: () => set(() => ({ fileList: [] })),
      setPostFileAction: (files: any[]) => set((state) => ({ editPost: { ...state.editPost, files } })),

      setPostListAction: (postList: PostListConfig[]) => set(() => ({ postList })),
      resetPostListAction: () => set(() => ({ PostList: [] })),
      setPostIndexAction: (index: number) => set(() => ({ index })),
      resetPostIndexAction: () => set(() => ({ index: -1 })),
      setPostIsLastAction: (isLast: boolean) => set(() => ({ isLast })),
      setPostIsEditAction: (isEdit: boolean) => set(() => ({ isEdit })),
      setTempIdAction: (tempId: number) => set(() => ({ tempId })),
    },
  })),
);

export const usePostActions = () => usePostStore((state) => state.actions);
