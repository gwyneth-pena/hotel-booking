import { Dialog } from "primereact/dialog";
import "./Confirmation.css";

const Confirmation = ({ hideModal, title, message, emitConfirm }: any) => {
  return (
    <Dialog
      visible={true}
      onHide={() => {
        hideModal();
      }}
    >
      <div className="row px-3 confirmation w-100">
        <div className="col-12 mx-3">
          <h4 className="fw-bold mb-5">{title}</h4>
        </div>
        <div className="col-12 mx-3">
          <p>{message}</p>
        </div>
        <div className="col-12 mx-3 mb-4 mt-5 text-end">
          <button
            onClick={() => hideModal()}
            className="btn btn-secondary me-3"
          >
            Cancel
          </button>
          <button
            className="btn btn-dark-blue"
            onClick={() => {
              emitConfirm();
              hideModal();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default Confirmation;
