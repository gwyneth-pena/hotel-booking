import "./Reservation.css";
import { Dialog } from "primereact/dialog";

const Reservation = ({ hideModal, data }: any) => {
  <>
    <Dialog
      visible={true}
      className="room-info-dialog"
      onHide={() => {
        hideModal();
      }}
    >
      <div className="row px-3"></div>
    </Dialog>
  </>;
};

export default Reservation;
