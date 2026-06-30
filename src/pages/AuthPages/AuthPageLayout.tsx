import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-[#fff] z-1  sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row  sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[#e4e4e4]  lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="admin/" className="block mb-4">
                <img src="/logo-wide.png" alt="" />
              </Link>
              <p className="text-center text-gray dark:text-white/60">
                A child without education is like a bird without wings.
              </p>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
}
