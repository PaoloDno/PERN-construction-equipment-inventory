import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowAltCircleLeft } from "react-icons/fa";

import { sanitizeInput } from "../../components/utils/SanitizeInput";
import AuthInput from "./AuthInputs";

import img from "../../assets/images/auth.jpg";
import { registerAction } from "../../store/actions/AuthThunks";

const SignupPage = () => {
  const { isPending, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [authError, setAuthError] = useState("");

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    let sanitized = value;

    switch (name) {
      case "username":
        sanitized = sanitizeInput.sanitize.username(value);
        break;

      case "email":
        sanitized = sanitizeInput.sanitize.email(value);
        break;

      default:
        sanitized = value;
    }

    setUserData((prev) => ({
      ...prev,
      [name]: sanitized,
    }));
  };

  const validateInput = (name, value) => {
    if (!value || value.trim() === "") {
      return "This field is required";
    }

    switch (name) {
      case "username":
        return sanitizeInput.isValid.username(value) ? "" : "Invalid Username";
      case "password":
        return sanitizeInput.isValid.password(value) ? "" : "Invalid Password";
      case "confirmPassword":
        return sanitizeInput.isValid.password(value) ? "" : "Invalid Password";
      case "email":
        return sanitizeInput.isValid.email(value) ? "" : "Invalid Email"
      default:
        return sanitizeInput.isValid.text(value) ? "" : "Inavalid Text";
    }
  };

  const validateInputs = () => {
    let newErrors = {};

    Object.keys(userData).forEach((key) => {
      const newError = validateInput(key, userData[key]);
      if (newError) newErrors[key] = newError;
    });

    if (Object.keys(newErrors).length > 0) {
      setAuthError(newErrors);
      return false;
    }
    setAuthError({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userData);

    setAuthError({});

    if(userData.password !== userData.confirmPassword) {
      setAuthError({...authError, confirmPassword: "Password didnt match!"})
      return false;
    }

    if (validateInputs()) {
      const sanitizedData = {
        username: sanitizeInput.sanitize.username(userData.username),
        email: sanitizeInput.sanitize.email(userData.email),
        password: userData.password,
      };

      try {
        const resultAction = await dispatch(registerAction(sanitizedData));

        if (registerAction.fulfilled.match(resultAction)) {
          console.log("Register Successful");
          setTimeout(() => {
            navigate("/home");
          }, 1000);
        } else {
          console.log("Signup failed");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-2xl bg-surface shadow-xl">
        {/* Image */}
        <div className="relative hidden md:block md:w-1/2">
          <img
            src={img}
            alt="Authentication"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradients" />
        </div>

        {/* Form */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2">
          <h1 className="mb-2 text-4xl font-heading font-bold">
            Create Account
          </h1>

          <p className="mb-8 text-text/70">
            Create an account to start managing your inventory.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <AuthInput
              label="Username"
              name="username"
              value={userData.username}
              error={authError.username}
              onChange={handleUserChange}
              helper="4–24 chars, starts with a letter, letters/numbers/_/- only"
            />

            <AuthInput
              label="Email"
              type="email"
              name="email"
              value={userData.email}
              error={authError.email}
              onChange={handleUserChange}
              helper="Valid email format (example@domain.com)"
            />

            <AuthInput
              label="Password"
              type="password"
              name="password"
              value={userData.password}
              error={authError.password}
              onChange={handleUserChange}
              helper="8–24 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol (!@#$%)"
            />

            <AuthInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              error={authError.confirmPassword}
              onChange={handleUserChange}
              helper="Re-enter your password"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              onClick={handleSubmit}
              className="rounded-lg bg-primary py-3 text-white font-semibold transition hover:bg-primary-hover disabled:opacity-60"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 flex items-center gap-2 text-primary hover:underline"
          >
            <FaArrowAltCircleLeft />
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
