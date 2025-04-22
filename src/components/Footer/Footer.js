import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 shadow-sm">
      <Container fluid className="flex flex-col items-center justify-center text-center">
        {/* Navigation Links */}
   

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://www.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-600"
          >
            Payroll
          </a>
          
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
