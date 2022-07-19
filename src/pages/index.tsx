import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import "swagger-ui-react/swagger-ui.css";
import { AuthFormInputs } from "../utils/AuthFormInputs";
import ModalForm from "./components/ModalForm";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

const Home: NextPage = () => {
  const [values, setValues] = useState<AuthFormInputs | null>(null);

  const onSubmit: SubmitHandler<AuthFormInputs> = async (values) => {
    setValues(values);
  };

  const requestInterceptor = async (req: any) => {
    if (values) {
      const res = await fetch("/api/sigv4", {
        method: "POST",
        body: JSON.stringify({
          url: req.url,
          body: req.body,
        }),
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(values.accessKey + ":" + values.secretKey).toString(
              "base64"
            ),
        },
      });

      return await res.json();
    }

    return req;
  };

  return (
    <>
      <Head>
        <title>API Documentation</title>
        <meta
          name="description"
          content="Swagger UI with Next.js and AWS IAM Sigv4 Authorization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ModalForm onSubmit={onSubmit} values={values} />

      <div className="-mt-5">
        <SwaggerUI
          requestInterceptor={requestInterceptor}
          url="https://kadets-docs.s3.amazonaws.com/openapi.json"
        />
      </div>
    </>
  );
};

export default Home;
