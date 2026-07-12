"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, login } from "@/lib/api";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push("/feed");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="_social_login_form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8">Email</label>
            <input
              type="email"
              className="form-control _social_login_input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_login_form_input _mar_b14">
            <label className="_social_login_label _mar_b8">Password</label>
            <input
              type="password"
              className="form-control _social_login_input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_login_form_btn _mar_t40 _mar_b60">
            <button type="submit" className="_social_login_form_btn_link _btn1" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login now"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
