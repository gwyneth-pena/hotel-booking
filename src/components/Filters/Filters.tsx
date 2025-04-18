import { useState } from "react";
import "./Filters.css";

export const Filters = ({ onChangeFilter }: any) => {
  const [typeFilters, setTypeFilters] = useState<any>({
    hotel: {
      label: "Hotels",
      checked: false,
    },
    apartment: {
      label: "Apartments",
      checked: false,
    },
    resort: {
      label: "Resorts",
      checked: false,
    },
    villa: {
      label: "Villas",
      checked: false,
    },
    holiday: {
      label: "Holiday Homes",
      checked: false,
    },
    campsite: {
      label: "Campsite",
      checked: false,
    },
  });

  return (
    <div className="row d-none d-md-block">
      <div className="col">
        <div className="px-4 py-3">
          <p className="fw-bold mb-2">Filters</p>
          <p className="text-muted filter-heading">Property Type</p>
          {Object.keys(typeFilters).map((type: string, idx: number) => {
            return (
              <div key={idx} className="d-flex align-items-center">
                <input
                  type="checkbox"
                  name={type}
                  id={type}
                  value={typeFilters[type].checked}
                  onChange={(e) => {
                    typeFilters[type].checked = e.target.checked;
                    setTypeFilters(typeFilters);
                    onChangeFilter(typeFilters);
                  }}
                />
                <label htmlFor={type} className="ms-2 mb-0">
                  {typeFilters[type].label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
