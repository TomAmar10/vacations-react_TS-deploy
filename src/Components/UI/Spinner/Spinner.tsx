import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export default function CircularColor() {
  return (
    <Stack
      sx={{ color: "grey.500", marginTop: "5rem" }}
      spacing={2}
      direction="row"
    >
      <CircularProgress color="primary" />
    </Stack>
  );
}
