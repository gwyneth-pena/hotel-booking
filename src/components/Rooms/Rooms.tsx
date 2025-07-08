import { stripHtml } from "../../utils/strings";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useModal } from "react-modal-hook";
import AddRoom from "../AddRoom/AddRoom";
import config from "../../config";
import axios from "axios";
import EditRoom from "../EditRoom/EditRoom";
import Confirmation from "../Confirmation/Confirmation";

const Rooms = ({ rooms, propertyId }: any) => {
  const apiURL = config.apiUrl;
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState("");
  const [roomList, setRoomList] = useState(rooms || []);
  const [modalRoomData, setModalRoomData] = useState<any>(undefined);
  const toast = useRef<any>(null);

  const [showModal, hideModal] = useModal(() => {
    switch (modalType) {
      case "add":
        return (
          <AddRoom
            data={modalRoomData}
            emitSavedData={() => {
              getRooms(propertyId);
            }}
            hideModal={hideModal}
          />
        );
      case "edit":
        return (
          <EditRoom
            data={modalRoomData}
            emitSavedData={() => {
              getRooms(propertyId);
            }}
            hideModal={hideModal}
          />
        );
      case "delete":
        return (
          <Confirmation
            title="Delete Room"
            message={`The room ${modalRoomData?.name} will be deleted.`}
            hideModal={hideModal}
            emitConfirm={() => {
              deleteRoom(modalRoomData);
            }}
          />
        );
      default:
        return null;
    }
  }, [modalType, modalRoomData]);

  const deleteRoom = async (room: any) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${apiURL}/rooms/${room._id}`);

      if (res.status === 200) {
        hideModal();
        await getRooms(propertyId);
      }
    } catch (e) {
      toast.current.show({
        severity: "error",
        detail: "Something wrong please try again later",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRooms = async (propertyId: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiURL}/hotels/${propertyId}?withRoomInfo=true`
      );
      setRoomList(res.data.rooms);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoomClick = (propertyId: string) => {
    setModalRoomData({
      propertyId,
    });
    setModalType("add");
    showModal();
  };

  const handleEditRoomClick = (room: any) => {
    setModalType("edit");
    setModalRoomData(room);
    showModal();
  };

  const handleDeleteRoomClick = (room: any) => {
    setModalType("delete");
    setModalRoomData(room);
    showModal();
  };

  return (
    <>
      <div className="row">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Rooms</h4>
          <button
            onClick={() => {
              handleAddRoomClick(propertyId);
            }}
            className="btn btn-dark-blue"
          >
            + Add Room
          </button>
        </div>
        <div className="row my-4">
          {roomList.map((room: any, idx: number) => {
            return (
              <div key={idx} className="col-md-4">
                <div className="card properties-card mb-3">
                  <div className="card-header">
                    <img
                      className="w-100"
                      src={room.photos?.[0] || "/images/default-img.jpg"}
                    />
                  </div>
                  <div className="card-body">
                    <p className="fw-bold mb-0">{room.name}</p>
                    <small className="text-decoration-underline mt-0">
                      Php {room.price.toLocaleString()} per night
                    </small>
                    <p className="mt-4 description">
                      {stripHtml(room.description)}
                    </p>

                    <i
                      className="ti ti-pencil pointer"
                      onClick={() => {
                        handleEditRoomClick(room);
                      }}
                    ></i>
                    <i
                      className="ti ti-trash pointer"
                      onClick={() => {
                        handleDeleteRoomClick(room);
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            );
          })}

          {roomList.length == 0 && (
            <div className="col-4">
              <p>No room found.</p>
            </div>
          )}
        </div>

        {loading && <LoadingOverlay />}
        <Toast className="p-4" ref={toast} />
      </div>
    </>
  );
};

export default Rooms;
