import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useLogin } from "@/hooks/auth/useLogin";
import { useVerifyOtp } from "@/hooks/auth/useVerify";
import { useNavigate, useLocation } from "react-router";

type PhoneForm = {
  phone: string;
};

type OtpForm = {
  otp: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneValue, setPhoneValue] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // куда редиректить после входа

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneForm>();

  const {
    handleSubmit: handleSubmitOtp,
    setValue: setOtpValue,
    watch: watchOtp,
    formState: { errors: otpErrors },
  } = useForm<OtpForm>({ defaultValues: { otp: "" } });

  const { mutateAsync: sendOtp, isPending: isSending } = useLogin();
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const onSubmitPhone = async (data: PhoneForm) => {
    try {
      await sendOtp(data);
      setPhoneValue(data.phone);
      setStep("otp");
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitOtp = async (data: OtpForm) => {
    try {
      await verifyOtp({ phone: phoneValue, otp: +data.otp });
      navigate(from, { replace: true }); // редирект после успешного входа
    } catch (error) {
      console.error(error);
    }
  };

  const retrySendOtp = async (data: PhoneForm) => {
    try {
      setOtpValue("otp", "");
      await sendOtp(data);
      setCooldown(30); // 30 секунд ожидания
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">Вход</CardTitle>
          <CardDescription className="text-center mt-3">
            {step === "phone"
              ? "Введите номер телефона"
              : "Введите код от Telegram-бота"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form
              onSubmit={handleSubmitPhone(onSubmitPhone)}
              className="flex flex-col gap-6"
            >
              <div className="grid gap-3">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7"
                  {...registerPhone("phone", {
                    required: "Телефон обязателен",
                    pattern: {
                      value: /^\+7\d{10}$/,
                      message: "Введите номер в формате +7",
                    },
                  })}
                  aria-invalid={!!phoneErrors.phone}
                  aria-describedby="phone-error"
                  disabled={isSending}
                />
                {phoneErrors.phone && (
                  <p className="text-sm text-red-600 mt-1" id="phone-error">
                    {phoneErrors.phone.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSending}
              >
                {isSending ? "Отправка..." : "Отправить код"}
              </Button>
            </form>
          ) : (
            <>
              <form
                onSubmit={handleSubmitOtp(onSubmitOtp)}
                className="flex flex-col gap-6"
              >
                <div className="grid justify-center gap-3">
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    pattern={REGEXP_ONLY_DIGITS}
                    value={watchOtp("otp")}
                    onChange={async (value) => {
                      setOtpValue("otp", value);
                      if (value.length === 6) {
                        await handleSubmitOtp(onSubmitOtp)();
                      }
                    }}
                    disabled={isVerifying}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot
                          className="min-w-[50px] min-h-[50px] text-[20px] font-bold"
                          key={i}
                          index={i}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {otpErrors.otp && (
                    <p className="text-sm text-red-600 mt-1">
                      {otpErrors.otp.message}
                    </p>
                  )}
                </div>
              </form>

              <div className="flex flex-col mt-10 justify-start gap-2">
                <div className="min-h-[20px]">
                  {cooldown > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Повторный запрос доступен через {cooldown} сек.
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={() => retrySendOtp({ phone: phoneValue })}
                  disabled={cooldown > 0 || isVerifying || isSending}
                >
                  Отправить код еще раз
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
