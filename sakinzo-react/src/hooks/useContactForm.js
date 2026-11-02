import { useState } from "react";
import { apiBase } from "../lib/api.js";
const initial = { name: "", email: "", phone: "", company: "", desc: "" };
export default function useContactForm(source) {
  const [values, setValues] = useState(initial),
    [attachment, setAttachment] = useState(null),
    [consent, setConsent] = useState(false),
    [status, setStatus] = useState("idle"),
    [error, setError] = useState(""),
    [fileKey, setFileKey] = useState(0);
  const field = (name) => ({
    name,
    value: values[name],
    onChange: (event) =>
      setValues((previous) => ({ ...previous, [name]: event.target.value })),
  });
  const chooseAttachment = (file) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setAttachment(null);
      setFileKey((value) => value + 1);
      setError("Choose a file smaller than 10 MB.");
      return;
    }
    setAttachment(file);
    setError("");
    if (!file) setFileKey((value) => value + 1);
  };
  const reset = () => {
    setValues(initial);
    setAttachment(null);
    setConsent(false);
    setStatus("idle");
    setError("");
    setFileKey((value) => value + 1);
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.desc.trim()) {
      setError("Please enter your name, email and project details.");
      return;
    }
    if (!consent) {
      setError("Please agree to the privacy notice before sending.");
      return;
    }
    setStatus("sending");
    setError("");
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      data.append(key, value.trim()),
    );
    data.append("source", source);
    if (attachment) data.append("attachment", attachment);
    try {
      const response = await fetch(`${apiBase()}/submissions`, {
        method: "POST",
        body: data,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.message || "Unable to send request.");
      setStatus("success");
    } catch (failure) {
      setStatus("idle");
      setError(failure.message);
    }
  };
  return {
    values,
    field,
    attachment,
    setAttachment: chooseAttachment,
    consent,
    setConsent,
    status,
    error,
    fileKey,
    submit,
    reset,
  };
}
