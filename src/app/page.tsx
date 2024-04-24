// components
import { Navbar, Footer } from "@/components";

// sections
import FtpForm from "./ftp-form";
import "./remove-branding.css";

export default function Campaign() {
  return (
    <>
      <Navbar />
      <FtpForm />
    </>
  );
}
