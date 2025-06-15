import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  FormHelperText,
  Link,
} from "@mui/material";
import { useLoginUserMutation } from "../../../redux/api/login";
import { setToken } from "../../../redux/authSlice";
import { ProgressIndicator } from "../../../components/ProgressIndicator";
import { DecodedToken } from "../../../utils/getUserPermissions";
import { parseJwt } from "../../../utils/parseJwt";

// Interface for form values
interface FormValues {
  email: string;
  password: string;
}

// Interface for the API response
// interface LoginResponse {
//   token: string;
// }

// Interface for the error response
interface ErrorResponse {
  error: {
    message: string;
    data: {
      detail: string;
    };
  };
}

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const [loginUser] = useLoginUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onSubmit = async (
    values: FormValues,
    { setSubmitting, setFieldError }: FormikHelpers<FormValues>
  ) => {
    setSubmitting(true);
    setApiResponse("loading");
    setLoading(true);

    try {
      const result = await loginUser(values).unwrap();
      const tokenValue = String(result.token);
      const decodedToken: DecodedToken = parseJwt(tokenValue);

      cookies.set("token", tokenValue, { path: "/" });
      dispatch(setToken(tokenValue));

      if (!decodedToken.is_verified) {
        navigate("/verify-email");
        return;
      }

      navigate("/");
      window.location.reload();
    } catch (error) {
      const err = error as ErrorResponse;
      setFieldError("general", err.error.message);
      setApiResponse(err.error.data.detail);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={4}
      sx={{
        width: "100%",
        maxWidth: 800,
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?
          <Link href="/register" underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
      </Stack>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack spacing={2}>
              <FormControl error={Boolean(touched.email && errors.email)}>
                <InputLabel>Email address</InputLabel>
                <Field
                  as={OutlinedInput}
                  name="email"
                  type="email"
                  label="Email address"
                />
                <FormHelperText>
                  <ErrorMessage name="email" />
                </FormHelperText>
              </FormControl>
              <FormControl error={Boolean(touched.password && errors.password)}>
                <InputLabel>Password</InputLabel>
                <Field
                  as={OutlinedInput}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  endAdornment={
                    <Typography
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Typography>
                  }
                />
                <FormHelperText>
                  <ErrorMessage name="password" />
                </FormHelperText>
              </FormControl>
              <div>
                <Link href="/reset-password" variant="subtitle2">
                  Forgot password?
                </Link>
              </div>
              {apiResponse && apiResponse !== "loading" && (
                <Alert color="error">{apiResponse}</Alert>
              )}
              <ProgressIndicator open={loading} />
              <Button
                disabled={isSubmitting || loading}
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "#635BFF", fontSize: "17px" }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};

export default SignInForm;
