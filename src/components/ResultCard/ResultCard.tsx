import clsx from "clsx";
import { stripHtml, toTitleCase } from "../../utils/strings";
import "./ResultCard.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ResultCard = ({ data }: { data: any }) => {
  const [recommendedRooms, setRecommendedRooms] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const pax = parseInt(data.targetPax);
    const recommendedRooms = [];
    let totalPaxInRecoRooms = 0;
    let totalPrice = 0;
    for (const room of data.availableRooms) {
      if (totalPaxInRecoRooms >= pax) break;
      totalPaxInRecoRooms += room.maxPeople;
      totalPrice += room.price;
      recommendedRooms.push(room);
    }
    setTotalPrice(totalPrice);
    setRecommendedRooms(recommendedRooms);
  }, [data]);

  return (
    <div
      className={clsx("row result-card my-2", {
        "d-flex": !data.isList,
        "flex-column": !data.isList,
      })}
    >
      <div
        className={clsx("col-4 image", {
          "col-12": !data.isList,
        })}
      >
        <img
          src={
            data.photos?.length > 0 ? data.photos[0] : "/images/default-img.jpg"
          }
          alt={data.name}
          width={"100%"}
        />
      </div>
      <div
        className={clsx("col-5 body", {
          "col-12": !data.isList,
        })}
      >
        <p
          className={clsx("title", {
            "mt-2": !data.isList,
          })}
        >
          {toTitleCase(data.name)}
        </p>
        <p className="address">{toTitleCase(data.address)}</p>
        <div className="desc">
          {recommendedRooms?.map((room: any, idx: number) => {
            return (
              <p key={idx} className="description">
                <span className="bg-dirty-white p-1 me-2">
                  {room.maxPeople + "x"}
                </span>
                {stripHtml(room.description)}
              </p>
            );
          })}
        </div>
      </div>
      <div
        className={clsx("col-3", {
          "col-12 d-flex justify-content-between": !data.isList,
          "d-flex flex-column justify-content-between pb-2": data.isList,
        })}
      >
        <div
          className={clsx("d-flex", {
            "justify-content-end": data.isList,
            "justify-content-start mt-3": !data.isList,
          })}
        >
          <p className="mt-auto">
            <span className="rating-text">Very Good</span>
            <span className="text-end rating">{data.rating || 0}/5</span>
          </p>
        </div>
        <div className="d-flex flex-column align-items-end">
          <p className="purchase">
            {data.totalNights} {data.totalNights > 1 ? "nights" : "night"},{" "}
            {data.targetPax}{" "}
            {parseInt(data.targetPax || "1") > 1 ? "adults" : "adult"}
          </p>
          <p className="price">
            Php {(totalPrice * data.totalNights).toLocaleString()}
          </p>
          <Link
            to={`/property/${data._id}?place=${data.place}&checkInDate=${data.checkInDate}&checkOutDate=${data.checkOutDate}&pax=${data.targetPax}`}
            className={clsx("button")}
          >
            See Availability <i className="ti ti-chevrons-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
