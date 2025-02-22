import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col gap-4 md:px-0 px-8">{children}</div>;
}

export default layout;
