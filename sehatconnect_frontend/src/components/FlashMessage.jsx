export default function FlashMessage({ message, type }) {
  if (!message) return null;

  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "10px",
        borderRadius: "30px",
        textAlign: "center",
        fontWeight: "500",
        color: type === "success" ? "#155724" : "#721c24",
        backgroundColor: type === "success" ? "#d4edda" : "#f8d7da",
        border:
          type === "success"
            ? "1px solid #c3e6cb"
            : "1px solid #f5c6cb",
      }}
    >
      {message}
    </div>
  );
}