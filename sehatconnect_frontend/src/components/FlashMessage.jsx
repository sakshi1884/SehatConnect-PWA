export default function FlashMessage({ message, type }) {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",          // 🔥 key change
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",

        padding: "12px 20px",
        borderRadius: "30px",
        textAlign: "center",
        fontWeight: "500",

        color: type === "success" ? "#155724" : "#721c24",
        backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
        border:
          type === "success"
            ? "1px solid #c3e6cb"
            : "1px solid #f5c6cb",

        zIndex: 9999,              // 🔥 ensures it's above everything
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {message}
    </div>
  );
}