"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, register } from "@/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      router.push("/feed");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="_social_registration_form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">First Name</label>
            <input
              type="text"
              className="form-control _social_registration_input"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              autoComplete="given-name"
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Last Name</label>
            <input
              type="text"
              className="form-control _social_registration_input"
              value={form.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              autoComplete="family-name"
              required
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Email</label>
            <input
              type="email"
              className="form-control _social_registration_input"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Password</label>
            <input
              type="password"
              className="form-control _social_registration_input"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="_social_registration_form_input _mar_b14">
            <label className="_social_registration_label _mar_b8">Repeat Password</label>
            <input
              type="password"
              className="form-control _social_registration_input"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
          <div className="form-check _social_registration_form_check">
            <input
              className="form-check-input _social_registration_form_check_input"
              type="checkbox"
              id="termsCheck"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <label className="form-check-label _social_registration_form_check_label" htmlFor="termsCheck">
              I agree to terms &amp; conditions
            </label>
          </div>
        </div>
      </div>
      {error ? <p className="text-danger small mb-3">{error}</p> : null}
      <div className="row">
        <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
          <div className="_social_registration_form_btn _mar_t40 _mar_b60">
            <button type="submit" className="_social_registration_form_btn_link _btn1" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
