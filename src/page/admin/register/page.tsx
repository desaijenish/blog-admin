import * as React from "react";
import { Layout } from "../../../components/layout";
import { SignUpForm } from "./sing-up-form";

export default function Register(): React.JSX.Element {
  return (
    <Layout>
      <SignUpForm />
    </Layout>
  );
}
