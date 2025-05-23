import * as React from "react";
import { Layout } from "../../../components/layout";
import SignInForm from ".";

export default function Login(): React.JSX.Element {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}
