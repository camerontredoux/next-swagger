import React from "react";
import { useForm } from "react-hook-form";
import { AuthFormInputs } from "../../utils/AuthFormInputs";

interface ModalFormProps {
  onSubmit: (values: AuthFormInputs) => void;
  values: AuthFormInputs | null;
}

const ModalForm: React.FC<ModalFormProps> = ({ onSubmit, values }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthFormInputs>();

  return (
    <form
      className="mx-auto auth flex px-2 sm:px-0 py-2 bg-white items-center justify-center gap-2 flex-wrap drop-shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full sm:w-96">
        <div className="flex flex-col w-full min-w-fit">
          <input
            spellCheck={false}
            className={`text-center px-2 py-2 rounded-md text-sm bg-slate-100 hover:bg-slate-50`}
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

          {errors.accessKey && <p className="text-xs">Invalid access key</p>}
        </div>
        <div className="flex flex-col w-full min-w-fit">
          <input
            spellCheck={false}
            className={`text-center px-2 py-2 rounded-md text-sm bg-slate-100 hover:bg-slate-50`}
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

          {errors.secretKey && <p className="text-xs">Invalid secret key</p>}
        </div>
        <button
          className={`${
            values && !(errors.accessKey || errors.secretKey)
              ? "bg-[#49cc90] text-white"
              : "bg-white text-green-400"
          }
          ${
            errors.accessKey || errors.secretKey
              ? "active:bg-red-100 active:border-red-200 hover:border-red-200 border-red-100 text-red-400 bg-red-200"
              : "active:bg-green-200 active:text-white active:border-green-200 hover:border-green-200 border-green-100"
          }
          w-full text-sm px-3 py-2 rounded-md border-2`}
          type="submit"
        >
          {values && !(errors.accessKey || errors.secretKey)
            ? "Initialized"
            : "Initialize"}
        </button>
      </div>
    </form>
  );
};

export default ModalForm;
