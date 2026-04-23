import { useEffect } from "react";

export default function FlashMessage({ flash, setFlash }) {
  useEffect(() => {
    if (flash?.message) {
      const timer = setTimeout(() => {
        setFlash({ message: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [flash, setFlash]);

  if (!flash?.message) return null;

  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "10px",
        borderRadius: "30px",
        textAlign: "center",
        fontWeight: "500",
        color: flash.type === "success" ? "#155724" : "#721c24",
        backgroundColor: flash.type === "success" ? "#d4edda" : "#f8d7da",
        border:
          flash.type === "success"
            ? "1px solid #c3e6cb"
            : "1px solid #f5c6cb",
        transition: "all 0.3s ease",
      }}
    >
      {flash.message}
    </div>
  );
}