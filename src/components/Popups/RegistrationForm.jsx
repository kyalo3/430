import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function RegistrationForm({ handleSwitch }) {
  const { signUp } = useContext(AuthContext);

  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ----------------------- VALIDATION ----------------------- */
  const validation = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    role: Yup.string()
      .oneOf(["donor", "recipient", "volunteer", "admin"])
      .required("Please select a role"),
    adminCode: Yup.string().when("role", {
      is: "admin",
      then: (schema) => schema.required("Admin code is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  /* ----------------------- SUBMIT ----------------------- */
  const handleRegister = async (values, actions) => {
    setServerError("");
    setSuccessMsg("");

    try {
      await signUp(
        values.username,
        values.email,
        values.password,
        values.role,
        values.adminCode
      );

      localStorage.setItem("regRole", values.role);

      setSuccessMsg("Registration successful!");

      actions.resetForm();
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data ||
        error.message ||
        "Registration failed";

      setServerError(typeof msg === "string" ? msg : JSON.stringify(msg));
    }

    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        adminCode: "",
      }}
      validationSchema={validation}
      onSubmit={handleRegister}
    >
      {({ values, isSubmitting, isValid }) => (
        <Form autoComplete="off">
          {/* Error / Success Messages */}
          {serverError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-400 rounded">
              {successMsg}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <Field
              name="username"
              placeholder="Username"
              className="mt-1 w-full bg-emerald-50 px-3 py-4 border rounded-md focus:ring-emerald-700"
            />
            <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Email */}
          <div className="mb-4">
            <Field
              type="email"
              name="email"
              placeholder="Email Address"
              className="mt-1 w-full bg-emerald-50 px-3 py-4 border rounded-md focus:ring-emerald-700"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Password */}
          <div className="mb-4">
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="mt-1 w-full bg-emerald-50 px-3 py-4 border rounded-md focus:ring-emerald-700"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="mt-1 w-full bg-emerald-50 px-3 py-4 border rounded-md focus:ring-emerald-700"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-emerald-800 font-semibold mb-2">
              Select Your Category
            </label>

            <Field
              as="select"
              name="role"
              className="w-full bg-emerald-50 px-3 py-3 border rounded-md focus:ring-emerald-700"
            >
              <option value="">-- Choose a category --</option>
              <option value="donor">Donor</option>
              <option value="recipient">Recipient</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </Field>

            <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          {/* Admin Code (conditional) */}
          {values.role === "admin" && (
            <div className="mb-4">
              <Field
                type="password"
                name="adminCode"
                placeholder="Enter admin code"
                className="mt-1 w-full bg-emerald-50 px-3 py-4 border rounded-md focus:ring-emerald-700"
              />
              <ErrorMessage
                name="adminCode"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full py-4 bg-orange-500 text-white font-semibold rounded-md disabled:bg-orange-300"
          >
            {isSubmitting ? "Registering..." : "Register Now"}
          </button>

          <p className="text-center mt-4 text-emerald-700 text-sm">
            Already Registered?{" "}
            <button
              type="button"
              onClick={() => handleSwitch("login")}
              className="underline text-blue-700"
            >
              Login
            </button>
          </p>
        </Form>
      )}
    </Formik>
  );
}

export default RegistrationForm;
