import "./LoadingOverlay.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay d-flex justify-content-center align-items-center">
      <div
        className="spinner-border text-light spinner"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
