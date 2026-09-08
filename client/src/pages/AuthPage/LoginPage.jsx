import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleRight, FaFontAwesomeLogoFull } from "react-icons/fa";

import { sanitizeInput } from "../../components/utils/SanitizeInput";
import AuthInput from "./AuthInputs";

import img from "../../assets/images/auth.jpg";
import { loginAction } from "../../store/actions/AuthThunks";
import ErrorBannerComponent from "../../components/utils/ErrorBannerComponent";

const LoginPage = () => {
  const { isPending, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState({});

  // Handle input changes
  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]:
        name === "username"
          ? sanitizeInput.sanitize.username(value)
          : value,
    }));
  };

  const validateInput = (name, value) => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    switch (name) {
      case "username":
        return sanitizeInput.isValid.username(value) ? "" : "Invalid username";
      case "password":
        return sanitizeInput.isValid.password(value) ? "" : "Invalid PAssword";
      default:
        return sanitizeInput.isValid.text(value) ? "" : "INVALID TEXT";
    }
  }

  const validateInputs = () => {
    let newErrors = {};

    Object.keys(userData).forEach((key) => {
      const newError = validateInput(key, userData[key]);
      if (newError) newErrors[key] = newError;
    });

    if(Object.keys(newErrors).length > 0) {
      setAuthError(newErrors);
      return false;
    }
    setAuthError({});
    return true;
  }

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userData);

    setAuthError({});
    if(validateInputs()) {
      const sanitizedData = {
        username: sanitizeInput.sanitize.username(userData.username),
        password: userData.password,
      }

      try {
        const resultAction = await dispatch(loginAction(sanitizedData));

        if(loginAction.fulfilled.match(resultAction)) {
          console.log("Login Successful");setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          console.log("Login failed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-2xl bg-surface/60 shadow-xl">

        {/* Left */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">

          <h1 className="mb-2 text-4xl font-bold font-heading">
            Login
          </h1>

          <p className="mb-8 text-text/70">
            Login and manage your inventory with ease.
            Please enter your credentials below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <AuthInput
              label="Username"
              name="username"
              value={userData.username}
              onChange={handleUserChange}
              helper="4–24 chars, starts with a letter, letters/numbers/_/- only"
              error={authError.username}
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={userData.password}
              onChange={handleUserChange}
              helper="Enter password."
              error={authError.password}
            />

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              onClick={handleSubmit}
              className="rounded-lg bg-primary px-5 py-3 font-semibold transition hover:bg-primary-hover hover:text-white disabled:opacity-60"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>
            {error ? error : ""}
          </form>

          <ErrorBannerComponent err={error} />

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-6 flex items-center gap-2 self-start transition hover:underline"
          >
            Sign Up instead
            <FaArrowAltCircleRight />
          </button>

        </div>

        {/* Right */}
        <div className="relative hidden md:block md:w-1/2">
          <img
            src={img}
            alt="Authentication"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradients" />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;