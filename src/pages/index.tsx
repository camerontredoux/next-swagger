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

      <form
        className="auth z-50 font-inter flex px-2 sm:px-0 py-2 bg-white items-center justify-center gap-2 flex-wrap drop-shadow-sm top-0 left-0 right-0 fixed"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          spellCheck={false}
          className={`w-full sm:w-1/3 min-w-fit sm:max-w-md text-center px-2 py-2 rounded-md text-sm bg-slate-100 hover:bg-slate-50`}
          placeholder="Access Key"
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
          spellCheck={false}
          className={`w-full sm:w-1/3 min-w-fit sm:max-w-md text-center px-2 py-2 rounded-md text-sm bg-slate-100 hover:bg-slate-50`}
          type="text"
          placeholder="Secret Key"
          {...register("secretKey", {
            required: "Required",
            pattern: {
              value: /^.{40}$/,
              message: "Must have 40 characters",
            },
          })}
        />
        <button
          className={`${
            values && !(errors.accessKey || errors.secretKey)
              ? "bg-[#49cc90] text-white"
              : "bg-white"
          }
          ${
            errors.accessKey || errors.secretKey
              ? "active:bg-red-100 active:border-red-200 hover:border-red-200 border-red-100 text-red-400 bg-red-200"
              : "active:bg-green-200 active:text-white active:border-green-200 hover:border-green-200 border-green-100 text-green-400"
          }
          w-full sm:w-fit text-sm px-3 py-2 rounded-md border-2`}
          type="submit"
        >
          {values && !(errors.accessKey || errors.secretKey)
            ? "Initialized"
            : "Initialize"}
        </button>
      </form>

      <div className="mt-44 sm:mt-20">
        <SwaggerUI
          requestInterceptor={requestInterceptor}
          url="https://kadets-docs.s3.amazonaws.com/openapi.json"
        />
      </div>
    </>
  );
};

export default Home;
