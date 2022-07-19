import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

import "swagger-ui-react/swagger-ui.css";

const Home: NextPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [values, setValues] = useState(null);

  const onSubmit = async (values: any) => {
    setValues({ ...values });
  };

  const requestInterceptor = async (req: any) => {
    if (values) {
      const res = await fetch("/api/sigv4", {
        method: "POST",
        body: JSON.stringify({
          values,
          urlString: req.url,
          body: req.body,
        }),
      });

      const data = await res.json();
      console.log(data);

      return data;
    }

    return req;
  };

  return (
    <>
      <Head>
        <title>Swagger UI</title>
        <meta
          name="description"
          content="Swagger UI with Next.js and AWS IAM Sigv4"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("accessKey", {
            required: "Required",
            pattern: {
              value: /^AKIA.{16}$/,
              message: "Must be a valid AWS access key",
            },
          })}
        />
        <input
          type="text"
          {...register("secretKey", {
            required: "Required",
            pattern: {
              value: /^.{40}$/,
              message: "Must have 40 characters",
            },
          })}
        />
        <button type="submit">Submit</button>
      </form>

      {errors.accessKey && errors.accessKey.message}
      {errors.secretKey && errors.secretKey.message}

      <SwaggerUI
        requestInterceptor={requestInterceptor}
        url="https://kadets-docs.s3.amazonaws.com/openapi.json"
      />
    </>
  );
};

export default Home;
