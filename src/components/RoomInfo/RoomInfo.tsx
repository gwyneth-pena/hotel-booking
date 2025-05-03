import { Dialog } from "primereact/dialog";
import "./RoomInfo.css";
import { toTitleCase } from "../../utils/strings";
import PhotoGallery from "../PhotoGallery/PhotoGallery";

const RoomInfo = ({ hideModal, data }: any) => {
  return (
    <>
      <Dialog
        visible={true}
        className="room-info-dialog"
        onHide={() => {
          hideModal();
        }}
      >
        <div className="row px-3">
          <div className="col-12 col-md-8 py-3">
            <PhotoGallery photos={data?.photos || []} />
          </div>
          <div className="col-12 col-md-4 py-3">
            <h5 className="fw-bold">{toTitleCase(data?.name || "")}</h5>
            <div className="mt-4" dangerouslySetInnerHTML={{__html: data?.description }}></div>
            <button type="button" className="btn btn-dark-blue ms-auto w-100 my-4">
              Reserve
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RoomInfo;
