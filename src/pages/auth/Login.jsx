import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Input from "../../components/forms/Input";
import Button from "../../components/forms/Button";
import { useAuth } from "../../context/useAuth";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { useToast } from "../../components/common/Toast/useToast";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const handledNoticeKey = useRef(null);
  const { login } = useAuth();
  const showToast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { logoutError, logoutSuccess } = location.state || {};
    if (
      handledNoticeKey.current === location.key ||
      (!logoutError && !logoutSuccess)
    ) {
      return;
    }

    handledNoticeKey.current = location.key;
    if (logoutError) {
      showToast(logoutError, "error");
    } else if (logoutSuccess) {
      showToast(logoutSuccess);
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.key, location.pathname, location.state, navigate, showToast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await login({
        emailId: formData.email,
        password: formData.password,
      });
      showToast("Signed in successfully.");
      navigate("/employee-information/employeeslist", { replace: true });
    } catch (error) {
      showToast(getApiErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold shadow-lg shadow-indigo-950/40">
            E
          </div>
          <div>
            <p className="text-base font-semibold tracking-wide">EMS</p>
            <p className="text-xs text-slate-400">People operations</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl py-12">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200">
            <ShieldCheck size={15} />
            Employee management, simplified
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Build a better workplace, one team at a time.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Bring your people, processes, and organization details together in
            one clear workspace.
          </p>

          <div className="mt-12 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <UsersRound className="mb-6 text-indigo-300" size={22} />
              <p className="text-2xl font-semibold">One workspace</p>
              <p className="mt-1 text-sm text-slate-400">
                Keep your team in sync
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <LockKeyhole className="mb-6 text-cyan-300" size={22} />
              <p className="text-2xl font-semibold">Secure access</p>
              <p className="mt-1 text-sm text-slate-400">
                Your people, protected
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Employee Management System
        </p>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              E
            </div>
            <div>
              <p className="font-semibold text-slate-900">EMS</p>
              <p className="text-xs text-slate-500">Employee Management</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your work credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work email"
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="username"
            />

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-800"
                >
                  Password
                  <span className="ml-1 text-indigo-600">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  className={`h-11 w-full rounded-lg border bg-white px-3 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 ${
                    errors.password ? "border-red-400" : "border-slate-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
              className="h-12 rounded-xl shadow-lg shadow-indigo-600/15"
            >
              Sign in
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              or continue with
            </span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            disabled
            title="Google sign-in is not configured"
            className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-500 opacity-70"
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-sm font-bold text-slate-600"
            >
              G
            </span>
            Continue with Google
          </button>
          <p className="mt-2 text-center text-xs text-slate-400">
            Google sign-in is not configured yet.
          </p>

        </div>
      </section>
    </main>
  );
}

export default Login;
