import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  // Box,
  // CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  useRegisterUserMutation,
  // useVerifyOtpMutation,
} from "../../../redux/api/login";
// import Cookies from "universal-cookie";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
  country: Yup.string().required("Country is required"),
  gender: Yup.string().required("Gender is required"),
});

// const otpValidationSchema = Yup.object({
//   otp: Yup.string()
//     .length(6, "OTP must be 6 digits")
//     .required("OTP is required"),
// });

const defaultValues = {
  name: "",
  email: "",
  password: "",
  country: "",
  gender: "",
};

const countries = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

export function SignUpForm(): React.JSX.Element {
  // const navigate = useNavigate();
  // const cookies = new Cookies();
  const [createRegister] = useRegisterUserMutation();
  // const [verifyOtp] = useVerifyOtpMutation();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // const [registrationToken, setRegistrationToken] = useState<string | null>(
  //   null
  // );
  // // const [showOtpForm, setShowOtpForm] = useState(false);
  // const [email, setEmail] = useState("");

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }: any) => {
      setIsPending(true);
      setApiResponse(null);

      try {
        const result: any = await createRegister(values);

        if ("error" in result) {
          setFieldError("general", result?.error?.message);
          setApiResponse(result.error.data.detail);
          return;
        }

        // setEmail(values.email);
        // setShowOtpForm(true);
      } catch (error) {
        setApiResponse("An unexpected error occurred");
      } finally {
        setIsPending(false);
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            variant="subtitle2"
          >
            Sign in
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <FormControl
            error={Boolean(formik.errors.name && formik.touched.name)}
            required
          >
            <InputLabel htmlFor="name">Full Name</InputLabel>
            <OutlinedInput
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Full Name"
            />
            {formik.errors.name && formik.touched.name ? (
              <FormHelperText>{formik.errors.name}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl
            error={Boolean(formik.errors.email && formik.touched.email)}
            required
          >
            <InputLabel htmlFor="email">Email address</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Email address"
            />
            {formik.errors.email && formik.touched.email ? (
              <FormHelperText>{formik.errors.email}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl
            error={Boolean(formik.errors.password && formik.touched.password)}
            required
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {formik.errors.password && formik.touched.password ? (
              <FormHelperText>{formik.errors.password}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl
            error={Boolean(formik.errors.country && formik.touched.country)}
            required
          >
            <InputLabel id="country-label">Country</InputLabel>
            <Select
              labelId="country-label"
              id="country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Country"
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
            {formik.errors.country && formik.touched.country ? (
              <FormHelperText>{formik.errors.country}</FormHelperText>
            ) : null}
          </FormControl>

          <FormControl
            error={Boolean(formik.errors.gender && formik.touched.gender)}
            required
          >
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
            {formik.errors.gender && formik.touched.gender ? (
              <FormHelperText>{formik.errors.gender}</FormHelperText>
            ) : null}
          </FormControl>

          {apiResponse && <Alert severity="error">{apiResponse}</Alert>}

          <Button
            disabled={isPending}
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
