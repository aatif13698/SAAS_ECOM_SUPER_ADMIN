



import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import useDarkmode from "@/hooks/useDarkMode";
import { Card } from "@mui/material";
import queryService from "@/services/query/query.service";


function CreateQuery() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathName = location?.pathname;
  const client = location?.state?.client;
  const [isDark] = useDarkmode();


  console.log("query data", client);



  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [replyData, setReplyData] = useState({
    subject: "",
    message: "",
    meetingLink: "",
  });

  const [replies, setReplies] = useState([]);
  const [errors, setErrors] = useState({});
  const [replyErrors, setReplyErrors] = useState({});
  const [responseError, setResponseError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReplySubmitting, setIsReplySubmitting] = useState(false);

  console.log("replies", replies);

  const emailRegex = /\S+@\S+\.\S+/;
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

  // Populate form with client data if available
  useEffect(() => {
    if (client) {
      setFormData({
        name: client?.name || "",
        email: client?.email || "",
        phone: client?.phone || "",
        message: client?.message || "",
      });
      setReplies(client?.replies || []);
    }
  }, [client]);


  // Fetch replies for the request
  useEffect(() => {
    if (client && pathName === "/view/query") {
      const fetchReplies = async () => {
        try {
          const response = await queryService.getParticularQuery(client._id);
          console.log("get part query", response);

          setReplies(response?.data?.data?.data?.replies || []);
        } catch (error) {
          setResponseError(["Failed to fetch replies"]);
        }
      };
      fetchReplies();
    }
  }, [client, pathName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };
    if (name === "name") {
      newErrors.name = value.trim() ? "" : "Name is required";
    }
    if (name === "message") {
      newErrors.message = value.trim() ? "" : "Message is required";
    }
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
    }
    if (name === "phone") {
      if (!value.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
      } else {
        newErrors.phone = "";
      }
    }
    setErrors(newErrors);
  };

  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyData({ ...replyData, [name]: value });

    let newErrors = { ...replyErrors };
    if (name === "subject") {
      newErrors.subject = value.trim() ? "" : "Subject is required";
    }
    if (name === "message") {
      newErrors.message = value.trim() ? "" : "Reply message is required";
    }
    if (name === "meetingLink") {
      newErrors.meetingLink = value.trim() && !urlRegex.test(value) ? "Please enter a valid URL" : "";
    }
    setReplyErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReplyForm = () => {
    const newErrors = {};
    if (!replyData.subject.trim()) newErrors.subject = "Subject is required";
    if (!replyData.message.trim()) newErrors.message = "Reply message is required";
    if (replyData.meetingLink.trim() && !urlRegex.test(replyData.meetingLink)) {
      newErrors.meetingLink = "Please enter a valid URL";
    }
    setReplyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataObject = {
        name: formData.name,
        message: formData.message,
        email: formData.email,
        phone: formData.phone,
      };
      let response;
      if (client) {
        // response = await queryService.updateRequest(client._id, dataObject);
      } else {
        response = await queryService.createRequest(dataObject);
      }
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: client ? "Updated Successfully" : "Created Successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "my-toast-size" },
      });
      navigate("/list/query");
    } catch (error) {
      console.error("Error processing request:", error);
      setResponseError([error.message || "An error occurred while processing the request"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!validateReplyForm()) return;
    setIsReplySubmitting(true);
    try {
      const replyObject = {
        subject: replyData.subject,
        message: replyData.message,
        meetingLink: replyData.meetingLink || null,
      };
      const response = await queryService.addReply(client._id, replyObject);
      console.log("add reply response ", response);

      setReplies([...response?.data?.data?.replies]);
      setReplyData({ subject: "", message: "", meetingLink: "" });
      setReplyErrors({});
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Reply Sent Successfully",
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        customClass: { popup: "my-toast-size" },
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      setResponseError([error.message || "An error occurred while sending the reply"]);
    } finally {
      setIsReplySubmitting(false);
    }
  };


  const handleKeyPress = (e) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^6-9\d]/g, "");
    if (cleanedValue.trim() !== "") {
      e.target.value = cleanedValue;
    } else {
      e.target.value = "";
    }
  };

  return (
    <div>
      <Card>
        <div className={`${isDark ? "bg-darkSecondary text-white" : ""} p-5`}>
          <div className="">
            <h2 className="text-1xl md:text-2xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-2 md:mb-4 text-start">
              {pathName === "/view/query"
                ? "View Query"
                : client
                  ? "Update Query"
                  : "Create Query"}
            </h2>
            <div className="h-[1.8px] bg-black dark:bg-white mb-4"></div>

            {/* Request Form */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control py-2" placeholder="Enter name"
                  disabled={pathName === "/view/request"}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control py-2" placeholder="Enter email"
                  disabled={pathName === "/view/request"}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onInput={handleKeyPress}
                  className="form-control py-2" placeholder="Enter phone number (e.g., 123-456-7890)"
                  disabled={pathName === "/view/request"}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control py-2" placeholder="Enter message..."
                  disabled={pathName === "/view/request"}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
             
            </form>

            {/* Replies List */}
            {pathName === "/view/query" && replies.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
                  Previous Replies
                </h3>
                <div className="space-y-4">
                  {replies.map((reply, index) => (
                    <div
                      key={reply._id || index}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-medium text-formLabelLight dark:text-formLabelDark">
                          {reply.subject}
                        </h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(reply.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-formLabelLight dark:text-formLabelDark">{reply.message}</p>
                      {reply.meetingLink && (
                        <a
                          href={reply.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline mt-2 inline-block"
                        >
                          Join Meeting
                        </a>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Sent by: {reply.sentBy?.firstName + " " + reply.sentBy?.lastName || "Admin"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply Form (Visible only in view mode for admins) */}
            {pathName === "/view/query" && (
              <div className="mt-8 bg-gray-100 px-2 py-2 rounded-md">
                <h3 className="text-xl font-semibold text-formHeadingLight dark:text-formHeadingDark mb-4">
                  Reply To Query 
                </h3>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleReplySubmit}>
                  <div>
                    <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={replyData.subject}
                      onChange={handleReplyChange}
                      className="form-control py-2" placeholder="Enter reply subject"
                    />
                    {replyErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">{replyErrors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                      Reply Message
                    </label>
                    <textarea
                      name="message"
                      value={replyData.message}
                      onChange={handleReplyChange}
                      className="form-control py-2" placeholder="Enter reply message..."
                      rows="4"
                    />
                    {replyErrors.message && (
                      <p className="text-red-500 text-sm mt-1">{replyErrors.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-formLabelLight dark:text-formLabelDark mb-1 font-medium">
                      Meeting Link (Optional)
                    </label>
                    <input
                      type="text"
                      name="meetingLink"
                      value={replyData.meetingLink}
                      onChange={handleReplyChange}
                      className="form-control py-2" placeholder="Enter meeting link (e.g., https://meet.example.com)"
                    />
                    {replyErrors.meetingLink && (
                      <p className="text-red-500 text-sm mt-1">{replyErrors.meetingLink}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`bg-lightBtn dark:bg-darkBtn p-3 rounded-md text-white  text-center btn btn inline-flex justify-center`}
                      disabled={isReplySubmitting}
                    >
                      {isReplySubmitting ? (
                        <>
                          <svg
                            className="animate-spin mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Reply"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {responseError.length > 0 && (
              <div className="w-[100%] mt-4 flex flex-col gap-1 p-4 bg-red-100 rounded-md">
                {responseError.map((error, index) => (
                  <p key={index} className="text-red-700 text-sm">{error}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

    </div>

  );
}

export default CreateQuery