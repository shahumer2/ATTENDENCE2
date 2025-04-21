import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-6 shadow-sm">
      <Container fluid className="flex flex-col items-center justify-center text-center">
        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center space-x-6 mb-3 text-sm font-medium text-gray-600">
          <li>
            <a
              href="#home"
              onClick={(e) => e.preventDefault()}
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#company"
              onClick={(e) => e.preventDefault()}
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Company
            </a>
          </li>
          <li>
            <a
              href="#portfolio"
              onClick={(e) => e.preventDefault()}
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Portfolio
            </a>
          </li>
          <li>
            <a
              href="#blog"
              onClick={(e) => e.preventDefault()}
              className="hover:text-blue-500 transition-colors duration-200"
            >
              Blog
            </a>
          </li>
        </ul>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://www.techokids.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-blue-600"
          >
            TechoKids
          </a>
          . All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
