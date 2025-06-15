import styled from "@emotion/styled";
// import Image from "next/image";
import { FC } from "react";
import File from "../assets/icons/File.svg";
import download from "../assets/icons/download.svg";

const RootContainer = styled.div({
  padding: "20px 16px",
  borderRadius: "8px",
  border: "1px solid #E2E8F0",
  boxShadow:
    " 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
  width: 240,
  display: "flex",
  gap: 16,
});

const IconWrap = styled.div({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "#EAFBFF",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const FileName = styled.div({
  color: "#1E293B",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
  textOverflow: " ellipsis",
  width: 140,
  overflow: "hidden",
  whiteSpace: "nowrap",
});

const NameContainer = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: 4,
});

const FileSize = styled.div({
  color: "#64748B",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: 400,
});

const DownloadIcon = styled.div({
  padding: 8,
  cursor: "pointer",
});

const Container = styled.div({
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
});

interface DocumentFileProps {
  fileName: string;
  fileSize: string;
  onClickDownload: () => void;
}
const DocumentFile: FC<DocumentFileProps> = ({
  fileName,
  fileSize,
  onClickDownload,
}) => {
  return (
    <RootContainer>
      <IconWrap>
        <img src={File} alt="File" width={25} />
      </IconWrap>
      <Container>
        <NameContainer>
          <FileName>{fileName}</FileName>
          <FileSize>{fileSize}</FileSize>
        </NameContainer>
        <DownloadIcon>
          <img
            src={download}
            alt="Download File"
            width={25}
            onClick={onClickDownload}
          />
        </DownloadIcon>
      </Container>
    </RootContainer>
  );
};

export default DocumentFile;
