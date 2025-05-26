import { Swiper, SwiperSlide } from "swiper/react";
import "./ImageGridCarousel.css";
import "swiper/swiper-bundle.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ImageGridCarousel = ({
  ...props
}: {
  info: any[];
  photos: any[];
  byProperty: boolean;
}) => {
  const swiperRef = useRef<any>(null);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const reducedInfo = props.info?.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleCardClick = (name: string) => {
    redirectToSearchResults(name);
  };

  const redirectToSearchResults = (name: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const checkInDate = today.toISOString().split("T")[0];
    const checkOutDate = tomorrow.toISOString().split("T")[0];
    const pax = 1;

    const queryParams = new URLSearchParams({
      place: !props.byProperty ? name : "",
      checkInDate,
      checkOutDate,
      pax: pax.toString(),
    });

    navigate(`/searchresults?${queryParams.toString()}`, {
      state: { type: props.byProperty ? name.slice(0, -1) : "" },
    });
  };

  return (
    <div className="position-relative">
      <Swiper
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setIsEnd(swiper.isEnd);
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={50}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
      >
        {props.photos.map((data: any) => {
          let matchingKey = undefined;
          if (reducedInfo) {
            matchingKey = Object.keys(reducedInfo).find((key) =>
              new RegExp(data.name, "i").test(key + "s")
            );
          }

          const count = matchingKey ? reducedInfo[matchingKey].count : null;

          return (
            <SwiperSlide key={data?.id + data?.name}>
              <div
                onClick={() => {
                  handleCardClick(data.name);
                }}
                className="card rounded-3 shadow pt-0 px-0 pointer"
              >
                <img
                  className="rounded-3"
                  src={data?.image || ""}
                  alt={data?.name || ""}
                />
                <div className="px-2 py-3">
                  <p className="fw-bold mb-0 pb-0">{data?.name || "--"}</p>
                  <p className="text-muted mt-0 pt-0">
                    {count || "0"} available properties
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {activeIndex > 1 && (
        <button className="custom-swiper-button-prev shadow" onClick={goPrev}>
          <i className="ti ti-chevron-left"></i>
        </button>
      )}

      {!isEnd && (
        <button className="custom-swiper-button-next shadow" onClick={goNext}>
          <i className="ti ti-chevron-right"></i>
        </button>
      )}
    </div>
  );
};

export default ImageGridCarousel;
