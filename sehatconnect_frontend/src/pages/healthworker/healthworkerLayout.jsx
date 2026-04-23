import HNavbar from "./HNavbar";

export default function HealthWorkerLayout({ children }) {
  return (
    <>
      <HNavbar />
      {children}
    </>
  );
}
