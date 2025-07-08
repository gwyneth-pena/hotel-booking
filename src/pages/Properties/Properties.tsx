import { useEffect, useRef, useState } from "react";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import "./Properties.css";
import config from "../../config";
import axios from "axios";
import { stripHtml } from "../../utils/strings";
import { useModal } from "react-modal-hook";
import AddProperty from "../../components/AddProperty/AddProperty";
import EditProperty from "../../components/EditProperty/EditProperty";
import { Helmet } from "react-helmet-async";
import Confirmation from "../../components/Confirmation/Confirmation";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";

const Properties = () => {
  const apiURL = config.apiUrl;
  const toast = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [modalType, setModalType] = useState("");
  const [modalPropertyData, setModalPropertyData] = useState<any>({});

  useEffect(() => {
    getProperties();
  }, []);

  const [showModal, hideModal] = useModal(() => {
    switch (modalType) {
      case "add":
        return (
          <AddProperty
            emitSavedData={() => {
              getProperties();
            }}
            hideModal={hideModal}
          />
        );
      case "edit":
        return (
          <EditProperty
            emitSavedData={() => {
              getProperties();
            }}
            data={modalPropertyData}
            hideModal={hideModal}
          />
        );
      case "delete":
        return (
          <Confirmation
            title="Delete Property"
            message={`The property ${modalPropertyData?.name} will be deleted.`}
            hideModal={hideModal}
            emitConfirm={() => {
              deleteProperty(modalPropertyData);
            }}
          />
        );
      default:
        return null;
    }
  }, [modalType, modalPropertyData]);

  const getProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiURL}/hotels`);

      if (res.status === 200) {
        setProperties(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPropertyClick = () => {
    setModalType("add");
    showModal();
  };

  const handleEditPropertyClick = (property: any) => {
    setModalType("edit");
    setModalPropertyData(property);
    showModal();
  };

  const handleDeletePropertyClick = (property: any) => {
    setModalType("delete");
    setModalPropertyData(property);
    showModal();
  };

  const deleteProperty = async (property: any) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${apiURL}/hotels/${property._id}`);

      if (res.status === 200) {
        hideModal();
        await getProperties();
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

  return (
    <>
      <Helmet>
        <title>My Properties | ComfyCorners</title>
        <meta name="description" content="My Properties" />
      </Helmet>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center">
          <h4>My Properties</h4>
          <button
            className="btn btn-dark-blue"
            onClick={() => handleAddPropertyClick()}
          >
            + Add Property
          </button>
        </div>
        <div className="row my-4">
          {properties.map((property: any, idx: number) => {
            return (
              <div key={idx} className="col col-md-4">
                <div className="card properties-card mb-3">
                  <div className="card-header">
                    <img
                      className="w-100"
                      src={property.photos?.[0] || "/images/default-img.jpg"}
                    />
                  </div>
                  <div className="card-body">
                    <p className="fw-bold mb-0">{property.name}</p>
                    <small className="text-decoration-underline mt-0">
                      {property.address}
                    </small>
                    <p className="mt-4 description">
                      {stripHtml(property.description)}
                    </p>

                    <Link to={`/properties/${property._id}`}>
                      <i className="ti ti-eye pointer"></i>
                    </Link>
                    <i
                      className="ti ti-pencil pointer"
                      onClick={() => {
                        handleEditPropertyClick(property);
                      }}
                    ></i>
                    <i
                      className="ti ti-trash pointer"
                      onClick={() => {
                        handleDeletePropertyClick(property);
                      }}
                    ></i>
                  </div>
                </div>
              </div>
            );
          })}

          {properties.length == 0 && (
            <div className="col-4">
              <p>No property found.</p>
            </div>
          )}
        </div>

        {loading && <LoadingOverlay />}
        <Toast className="p-4" ref={toast} />
      </div>
    </>
  );
};

export default Properties;
