import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 import { ADD_Job_DATA } from "Constants/utils"; // adjust the import path


const AddJob = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const token = currentUser?.token;

  // Initial values
  const initialValues = {
    jobCode: "",
    jobName: "",
    postalCode: "",
    address: "",
    latitude: "",
    longitude: "",
    isActive: false,   // ✅ default false
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    jobCode: Yup.string().required("Job Code is required"),
    jobName: Yup.string().required("Job Name is required"),
    postalCode: Yup.string()
      .matches(/^\d{5,6}$/, "Enter a valid postal code")
      .nullable()
      .notRequired(),
    address: Yup.string().required("Address is required"),
    // latitude: Yup.string()
    //   .matches(/^-?\d+(\.\d+)?$/, "Enter a valid latitude")
    //   .nullable()
    //   .notRequired(),
    // longitude: Yup.string()
    //   .matches(/^-?\d+(\.\d+)?$/, "Enter a valid longitude")
    //   .nullable()
    //   .notRequired(),
  });

  // Submit handler
const handleSubmit = async (values, { resetForm }) => {
  try {
    setLoading(true);

    const response = await fetch(ADD_Job_DATA, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ensure token is defined
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg || "Failed to save Job Master");
    }

    toast.success("Job Master saved successfully 🎉");
    resetForm();
    navigate("/admin/job/viewJob"); // redirect after success ✅
  } catch (error) {
    toast.error(error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
      <div style={{ backgroundColor: "#eaf1f8", minHeight: "100vh", paddingTop: "0px", paddingBottom: "20px" }}>
    <>
      {/* Header + Info */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2
          style={{
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 540,
            fontSize: "23px",
            color: "#091e42",
            paddingLeft: "40px",
            paddingTop: "20px",
            marginRight: "8px",
            whiteSpace: "nowrap",
          }}
        >
          Job Master
        </h2>

        {/* Breadcrumb */}
        <div className="w-full flex justify-end pr-10 pt-5">
          <p
            style={{
              fontSize: "17px",
              fontWeight: 500,
              lineHeight: 1.43,
              letterSpacing: "0.14px",
              color: "#4B5563",
            }}
          >
            Master <span style={{ color: "#9CA3AF" }}>&gt;</span>{" "}
            <span style={{ color: "#111827" }}>Job Master</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white m-6  p-6">
        <div className="max-w-7xl mx-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Job Code */}
                <div>
                  <label
                    className="block text-[14px] font-bold text-gray-700 mb-[6px]"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    Job Code<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="jobCode"
                    placeholder="e.g Job Code"
                    className="block w-full h-[42px] px-4 py-2 text-[14px] font-medium text-[#242424] 
                      bg-white border border-[#ced4da] rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="jobCode"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Job Name */}
                <div>
                  <label
                    className="block text-[14px] font-bold text-gray-700 mb-[6px]"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                  >
                    Job Name<span className="text-red-600">*</span>
                  </label>
                  <Field
                    name="jobName"
                    placeholder="e.g Job Name"
                    className="block w-full h-[42px] px-4 py-2 text-[14px] font-medium text-[#242424] 
                      bg-white border border-[#ced4da] rounded-md 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="jobName"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* Postal Code + Latitude + Longitude stacked without gaps */}
                <div className="flex flex-col space-y-0">
                  {/* Postal Code */}
                  <div>
                    <label
                      className="block text-[14px] font-bold text-gray-700 mb-[6px]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      Postal Code
                    </label>
                    <Field
                      name="postalCode"
                      placeholder="Enter Postal Code (optional)"
                      className="block w-full h-[42px] px-4 py-2 text-[14px] font-medium text-[#242424] 
                        bg-white border border-[#ced4da] rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="postalCode"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label
                      className="block text-[14px] font-bold text-gray-700 mb-[6px]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      Latitude
                    </label>
                    <Field
                      name="latitude"
                      placeholder="e.g. 12.9716"
                      className="block w-30 h-[42px] px-4 py-2 text-[14px] font-medium text-[#242424] 
                        bg-white border border-[#ced4da] rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="latitude"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label
                      className="block text-[14px] font-bold text-gray-700 mb-[6px]"
                      style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                    >
                      Longitude
                    </label>
                    <Field
                      name="longitude"
                      placeholder="e.g. 77.5946"
                      className="block w-30 h-[42px] px-4 py-2 text-[14px] font-medium text-[#242424] 
                        bg-white border border-[#ced4da] rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="longitude"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                </div>

            

                {/* Address */}
<div>
  <label
    className="block text-[14px] font-bold text-gray-700 mb-[6px]"
    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
  >
    Address<span className="text-red-600">*</span>
  </label>
  <Field
    name="address"
    as="textarea"
    className="block w-full h-[150px] px-4 py-2 text-[14px] font-medium text-[#242424] 
      bg-white border border-[#ced4da] rounded-md 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
  <ErrorMessage
    name="address"
    component="div"
    className="text-red-500 text-xs mt-1"
  />

  {/* ✅ Checkbox below Address */}
  {/* <div className="mt-3 flex items-center">
    <Field
      type="checkbox"
      name="isActive"
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <label
      htmlFor="isActive"
      className="ml-2 block text-sm text-gray-500"
      style={{ fontWeight: "300px" ,fontSize:"15px"}}
    >
      Job is Active
    </label>
  </div> */}
  <div className="mt-3 flex items-center">
  <Field
    type="checkbox"
    name="isActive"
    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
  />
  <label
    htmlFor="isActive"
    className="ml-2 block text-sm text-gray-500"
    style={{ fontWeight: 300, fontSize: "15px" }}
  >
    Job is Active
  </label>
</div>

</div>

                
              </div>
              

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                   onClick={() => navigate("/admin/job/viewJob")}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
              {/* Footer note */}
<div
  className="mt-6 text-sm font-medium"
  style={{ color: "#d97777", fontWeight: 600, WebkitTextFillColor: "#d97777" }}
>
  Fields marked with * are mandatory
</div>


            </Form>
          </Formik>

          {/* Toast container */}
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
      </div>
    </>
    </div>
  );
};

export default AddJob;
