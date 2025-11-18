import { Dialog } from "primereact/dialog";
import axios from "axios";
import clsx from "clsx";
import ImageUploading from "react-images-uploading";
import { Toast } from "primereact/toast";
import { useRef, useState, useEffect } from "react";
import config from "../../config";
import { supabase } from "../../utils/supabase";
import "./EditRoom.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const EditRoom = ({ hideModal, emitSavedData, data }: any) => {
  const apiUrl = config.apiUrl;
  const toast: any = useRef(null);

  const [images, setImages] = useState<any>([]);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    maxPeople: 1,
    price: 0,
    isLoading: false,
    roomNumbers: "",
  });
  const [toDeletedInBucket, setToBeDeletedInBucket] = useState<any>([]);

  useEffect(() => {
    initializeFormData(data);
  }, [data]);

  const initializeFormData = (data: any) => {
    setFormState((prev) => ({
      ...prev,
      name: data.name || "",
      type: data.type || "",
      maxPeople: data.maxPeople || "",
      price: data.price || "",
      description: data.description || "",
      roomNumbers:
        data.roomNumbers.map((num: any) => num.number).join(",") || [],
    }));
    setImages(data.photos);
  };

  const onImageUpload = (imageList: any[]) => {
    setImages(imageList);
  };

  const onImageRemove = (index: number) => {
    const image = images[index];
    if (!image.file) {
      const url = image.substring(image.indexOf("uploads"));
      setToBeDeletedInBucket((prevItems: any) => [...prevItems, url]);
    }
    const updatedImages = images.filter((_: any, i: any) => i !== index);
    setImages(updatedImages);
  };

  const uploadImage = async (file: File) => {
    try {
      if (!file) return;

      const time = new Date().getTime();
      const filePath = `uploads/${time}-${file.name}`;

      const { data, error } = await supabase.storage
        .from("photos")
        .upload(filePath, file, {
          upsert: true,
        });
      if (error) {
        console.error(error);
        return;
      } else {
        return data;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImageFromBucket = async (url: string) => {
    try {
      if (!url) return;

      const { error } = await supabase.storage.from("photos").remove([url]);

      if (error) {
        console.error(error);
        return;
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const submit = async (e: Event) => {
    e.preventDefault();

    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));

      const uploadPromises = images
        .filter((img: any) => img.file)
        .map((imageWrapper: any) => {
          return uploadImage(imageWrapper.file);
        });

      const deleteImagesPromises = toDeletedInBucket.map((url: string) => {
        return deleteImageFromBucket(url);
      });

      const supabaseUrl = config.supabaseUrl;
      const uploadedImages = (
        await Promise.all([...uploadPromises, ...deleteImagesPromises])
      )
        .filter((img: any) => img?.fullPath)
        .map((img: any) => `${supabaseUrl}/storage/v1/object/${img?.fullPath}`);

      const existingImages = images
        .filter((img: any) => !img.file && typeof img === "string")
        .filter((url: string) => {
          const relative = url.substring(url.indexOf("uploads"));
          return !toDeletedInBucket.includes(relative);
        });

      const finalImages = [...existingImages, ...uploadedImages];

      const roomData = {
        photos: finalImages,
        name: formState.name,
        description: formState.description,
        maxPeople: formState.maxPeople,
        price: formState.price,
        roomNumbers: formState.roomNumbers.split(",").map((number: string) => {
          return { number: parseInt(number), unavailableDates: [] };
        }),
      };

      const roomRes = await axios.patch(`${apiUrl}/rooms/${data._id}`, {
        ...roomData,
      });
      if (roomRes.status === 200) {
        toast.current.show({
          severity: "success",
          detail: "Room updated successfully.",
          life: 3000,
        });
        setTimeout(() => {
          emitSavedData();
          hideModal();
        }, 500);
      }
    } catch (e) {
      console.error(e);
      toast.current.show({
        severity: "error",
        detail: "Something went wrong.",
        life: 5000,
      });
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
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
        <div className="row px-3 w-100 edit-room">
          <div className="col-12 mx-3">
            <h4 className="fw-bold mb-5">Edit Room</h4>
          </div>
          <form
            className="px-5 edit-room"
            onSubmit={(e: any) => {
              submit(e);
            }}
          >
            <div className="row">
              <div className="form-group mb-4 col-12">
                <label htmlFor="name" className="fw-bold mb-2">
                  Name
                </label>
                <input
                  value={formState.name}
                  type="name"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="Enter room name"
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group mb-4 col-12">
                <label htmlFor="description" className="fw-bold mb-2">
                  Description
                </label>
                <ReactQuill
                  theme="snow"
                  value={formState.description}
                  id="description"
                  placeholder="Edit description"
                  onChange={(value) =>
                    setFormState({ ...formState, description: value })
                  }
                />
              </div>

              <div className="form-group mb-4 col-4">
                <label htmlFor="price" className="fw-bold mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step={1}
                  value={formState.price}
                  className="form-control"
                  name="price"
                  id="price"
                  placeholder="Add price"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      price: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group mb-4 col-4">
                <label htmlFor="maxPeople" className="fw-bold mb-2">
                  Number of Persons per Room
                </label>
                <input
                  type="number"
                  step={1}
                  value={formState.maxPeople}
                  className="form-control"
                  name="maxPeople"
                  id="maxPeople"
                  placeholder="Enter Max People"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      maxPeople: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group mb-4 col-4">
                <label htmlFor="roomNumbers" className="fw-bold mb-2">
                  Room Numbers
                </label>
                <input
                  type="text"
                  value={formState.roomNumbers}
                  className="form-control"
                  name="roomNumbers"
                  id="roomNumbers"
                  placeholder="Enter Room Numbers (e.g. 121, 122, 123)"
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      roomNumbers: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group mb-4 col-12">
                <label htmlFor="Photos" className="fw-bold mb-2">
                  Photos
                </label>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onImageUpload}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <div>
                      <button
                        type="button"
                        className="btn btn-secondary photo mb-2"
                        onClick={onImageUpload}
                      >
                        Add
                      </button>
                      <div className="d-flex flex-wrap gap-3">
                        {imageList.map((image, index) => (
                          <div key={index} className="text-center">
                            <img
                              src={image.data_url || image}
                              alt={image.file?.name}
                              style={{
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <br />
                            <button
                              type="button"
                              className="btn photo mt-1"
                              onClick={() => onImageRemove(index)}
                            >
                              <i className="ti ti-x"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>
            </div>

            <button
              className={clsx("btn btn-dark-blue mb-5 w-100", {
                "p-2": formState.isLoading,
              })}
              type="submit"
              disabled={formState.isLoading}
            >
              {formState.isLoading ? (
                <img className="loader" src="/images/loader.gif" />
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
        <Toast className="p-4" ref={toast} />
      </Dialog>
    </>
  );
};

export default EditRoom;
