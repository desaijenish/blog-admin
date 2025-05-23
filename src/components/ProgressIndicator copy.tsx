import { LinearProgress, Modal } from "@mui/material";

interface ProgressIndicatorProps {
  open: boolean;
}

export function ProgressIndicator({ open }: ProgressIndicatorProps) {
  return (
    <Modal open={open}>
      <LinearProgress />
    </Modal>
  );
}
