import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuthStore } from "../../stores/auth.store";
import { Label } from "../../components/ui/label";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router";
import { useState } from "react";

type FormData = {
  login: string;
  password: string;
};

export const LoginForm = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setServerError(null);
      await login(data);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message || "Ошибка авторизации");
      } else {
        setServerError("Неизвестная ошибка");
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">ERP System</h1>
          <p className="mt-2 text-sm text-gray-600">
            Введите логин и пароль для входа
          </p>
        </div>

        {serverError && (
          <div className="p-4 text-sm text-red-500 bg-red-50 rounded-md">
            {serverError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              autoComplete="username"
              className={cn(errors.login && "border-red-500")}
              {...register("login", {
                required: "Логин обязателен",
                minLength: {
                  value: 3,
                  message: "Логин должен быть не менее 3 символов",
                },
              })}
            />
            {errors.login && (
              <p className="text-sm text-red-500">{errors.login.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              className={cn(errors.password && "border-red-500")}
              {...register("password", {
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен быть не менее 6 символов",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};
