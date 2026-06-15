export function Toast({
  message,
  type = "success",
}: {
  message: string;
  type?: "success" | "info";
}) {
  return (
    <div
      className="toast show"
      style={{ borderLeftColor: type === "success" ? "#c8962a" : "#25D366" }}
    >
      {type === "success" ? "✓ " : "ℹ "}
      {message}
    </div>
  );
}
