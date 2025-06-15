import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../../redux/api/login";
import Cookies from "universal-cookie";
import { DecodedToken } from "../../../utils/getUserPermissions";
import { parseJwt } from "../../../utils/parseJwt";

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const [apiResponse, setApiResponse] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const token = cookies.get("token");
  const decodedToken: DecodedToken = parseJwt(token);

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/register");
      return;
    }

    if (decodedToken.is_verified) {
      navigate("/");
    }
    setEmail(decodedToken.email);

    // Start countdown for resend OTP
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formik = useFormik({
    initialValues: { otp: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiResponse(null);

      try {
        // const token = cookies.get("token");
        const result: any = await verifyOtp({
          email: decodedToken.email,
          otp: values.otp,
        });

        if (result.error) {
          setApiResponse({
            message: result.error.data?.detail || "OTP verification failed",
            type: "error",
          });
          return;
        }

        // Store the final token and redirect
        cookies.remove("token");
        cookies.set("token", result.data.token, { path: "/" });
        navigate("/");
      } catch (error) {
        setApiResponse({
          message: "An error occurred during verification",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setApiResponse(null);
    try {
      const result: any = await resendOtp({ email });

      if (result.error) {
        setApiResponse({
          message: result.error.data?.detail || "Failed to resend OTP",
          type: "error",
        });
        return;
      }

      setApiResponse({
        message: "New OTP sent successfully",
        type: "success",
      });
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      setApiResponse({
        message: "Failed to resend OTP",
        type: "error",
      });
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 400, margin: "0 auto", p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">Verify Email</Typography>
        <Typography color="text.secondary" variant="body2">
          We've sent a 6-digit OTP to {email}
        </Typography>
      </Stack>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <FormControl
            error={Boolean(formik.errors.otp && formik.touched.otp)}
            required
          >
            <InputLabel htmlFor="otp">OTP Code</InputLabel>
            <OutlinedInput
              id="otp"
              name="otp"
              value={formik.values.otp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="OTP Code"
              inputProps={{
                maxLength: 6,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
            />
            {formik.errors.otp && formik.touched.otp && (
              <FormHelperText>{formik.errors.otp}</FormHelperText>
            )}
          </FormControl>

          {apiResponse && (
            <Alert severity={apiResponse.type}>{apiResponse.message}</Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isLoading}
            >
              Resend OTP {countdown > 0 && `(${countdown}s)`}
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              variant="contained"
              endIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Stack>
  );
}
