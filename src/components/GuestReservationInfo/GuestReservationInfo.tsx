import { Dialog } from "primereact/dialog";
import PhotoGallery from "../PhotoGallery/PhotoGallery";
import { toTitleCase } from "../../utils/strings";
import { toLongDateString } from "../../utils/dates";

const GuestReservationInfo = ({ hideModal, data }: any) => {
  const roomCounts = data?.bookedRooms?.[0].rooms.reduce(
    (acc: Record<string, number>, item: any) => {
      const roomName = item.room.name;
      const count = item.roomNumbers.length;

      if (acc[roomName]) {
        acc[roomName] += count;
      } else {
        acc[roomName] = count;
      }

      return acc;
    },
    {}
  );

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
            <PhotoGallery
              photos={data?.bookedRooms?.[0]?.hotel?.photos || []}
            />
          </div>
          <div className="col-12 col-md-4 py-3">
            <h5 className="fw-bold">
              Guest: {toTitleCase(data?.user?.firstName || "")}{" "}
              {toTitleCase(data?.user?.lastName || "")}
            </h5>
            <br />
            <p className="fw-bold">Booking Details</p>
            <p>
              <b>{toTitleCase(data?.bookedRooms?.[0]?.hotel?.name || "")}</b> (
              {toTitleCase(data?.bookedRooms?.[0]?.hotel?.address || "")})
            </p>
            <small>
              Check-in Date:{" "}
              {toLongDateString(data?.bookedRooms?.[0]?.checkInDate)}
            </small>
            <br />
            <small>
              Check-out Date:{" "}
              {toLongDateString(data?.bookedRooms?.[0]?.checkOutDate)}
            </small>
            <br />
            <br />

            <small className="my-5">Room/s:</small>
            <br />
            <br />

            {Object.entries(roomCounts).map(
              ([key, value]: any, idx: number) => {
                return (
                  <div key={idx}>
                    <small>{key}</small> <small>({value})</small>
                    <br />
                  </div>
                );
              }
            )}
            <br />
            <br />
            <small>
              Total Price:{" "}
              <span className="fw-bold">
                Php{" "}
                {data?.bookedRooms?.[0]?.totalPrice.$numberDecimal.toLocaleString()}
              </span>
            </small>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default GuestReservationInfo;
