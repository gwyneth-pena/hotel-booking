import { Dialog } from "primereact/dialog";
import "./RoomInfo.css";
import { toTitleCase } from "../../utils/strings";
import PhotoGallery from "../PhotoGallery/PhotoGallery";
import { useNavigate } from "react-router-dom";

const RoomInfo = ({ hideModal, data }: any) => {
  const navigate = useNavigate();

  const reserve = () => {
    navigate("/reservation", {
      state: {
        selectedRooms: {
          [`${data._id}`]: {
            name: data.name,
            number: 1,
            price: data.price,
          },
        },
        propertyInfo: data.propertyInfo,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
      },
    });
  };

  return (
    <>
      <Dialog
        visible={true}
        className="dialog-75"
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
            <div
              className="mt-4"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            ></div>
            <button
              type="button"
              onClick={reserve}
              className="btn btn-dark-blue ms-auto w-100 my-4"
            >
              Reserve
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RoomInfo;
