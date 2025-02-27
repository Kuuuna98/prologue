import { Fragment, ReactNode, SyntheticEvent } from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SideMenu from "./SideMenu";
import { blogTabs, layoutTabs, nonUserBlogTabs } from "./SettingMenuComponents";
import { useAuthStore } from "stores/authStore";

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface StyledTabsProps {
  children?: ReactNode;
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  color: "#000",
  width: "200px", // 상위탭 너비
  "&.Mui-selected": {
    fontWeight: theme.typography.fontWeightBold,
    color: "#000",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
    innerHeight: "200px",
  },
}));

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  width: "100%",
  borderBottom: "1px solid #D1D1D1",
  "& .MuiTabs-indicator": {
    display: "flex",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#393D96",
  },
});

export const TabPanel = styled((props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
})({
  width: "100%",
  // border: "1px solid #D1D1D1",
});

const TabMenu = () => {
  const blogType = useAuthStore((state) => state.blogType);
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "83vw", margin: "0 auto" }}>
      <Box sx={{ bgcolor: "#fff" }}>
        <StyledTabs value={value} onChange={handleChange}>
          <StyledTab label="블로그 설정" />
          {/* 에러남. 근데 돌아감. */}
          {blogType === 1 ? <Fragment /> : <StyledTab label="레이아웃 설정" />}
        </StyledTabs>
      </Box>
      {blogType === 1 ? (
        <>
          <TabPanel value={value} index={0}>
            <SideMenu tabs={nonUserBlogTabs} />
          </TabPanel>
        </>
      ) : (
        <>
          <TabPanel value={value} index={0}>
            <SideMenu tabs={blogTabs} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SideMenu tabs={layoutTabs} />
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default TabMenu;
