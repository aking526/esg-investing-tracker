import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  placeholder: string;
  data: string[][];
}

// data[i][0] ==> ticker
// data[i][1] ==> name

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, data }) => {
  const [curr, setCurr] = useState<string>("");
  const [filteredData, setFilteredData] = useState<string[][]>(data);
  const [focused, setFocused] = useState<boolean>(false);

  const navigate = useNavigate();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setCurr(event.target.value);
  const onFocus = () => setFocused(true);

  // Handles whether the search box is clicked or not
  useEffect(() => {
    if (curr.length !== 0 || !focused) return;
    setFilteredData(data); // Resets the filtered data to show all options

    const handlePointerDown = (event: PointerEvent) => {
      if (!focused) return;
      setFocused(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [focused]);


  // Sets new filter when curr is changed
  useEffect(() => {
    const newFilter = data.filter((value: string[]) => {
      return value[0].toLowerCase().includes(curr.toLowerCase()) || value[1].toLowerCase().includes(curr.toLowerCase());
    });

    if (curr === "") setFilteredData([]);
    else setFilteredData(newFilter);
  }, [curr]);

  // adds an event listener when filteredData is change
  useEffect(() => { // handled this way because of state was not updating
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      navigate(`/company/${filteredData[0][0]}`);
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [filteredData]);

  const handleOnPointerDown = (event: React.PointerEvent<HTMLDivElement>) => event.stopPropagation();

  return (
    <div className="flex flex-col font-modern my-1 text-black">
      <div className="flex flex-row justify-center mr-auto ml-auto w-72" onPointerDown={handleOnPointerDown}>
        <div className="flex flex-col">
          <input
            className="bg-slate-200 w-64 h-14 text-lg rounded-xl border-2 border-black px-3 hover:bg-white hover:border-sky-700 placeholder:text-base"
            onChange={onChange}
            onFocus={onFocus}
            value={curr}
            type="text"
            placeholder={placeholder}
          />
          <div className="relative z-10">
            {((filteredData.length !== 0 && curr.length !== 0) || focused) &&
              <div className="absolute top-0 left-0 right-0 bottom-0">
                <ul className="relative flex flex-col ml-auto mr-auto bg-white rounded-lg border-2 border-cyan-50 w-64 h-48 pt-1.5 drop-shadow-xl overflow-hidden overflow-y-auto">
                  {filteredData.map((value: string[], key: number) => (
                    <li className="text-lg m-2 hover:bg-slate-100" key={key}><Link to={`/company/${value[0]}`}>{value[1]} - {value[0].toUpperCase()}</Link></li>
                  ))}
                </ul>
              </div>
            }
          </div>
        </div>
        <div className="p-2 m-1 text-base">
          <Link to={filteredData.length !== 0 ? `/company/${filteredData[0][0]}` : "/"}><SearchIcon className="cursor-pointer"  style={{ color: "black" }} /></Link>
        </div>
      </div>

    </div>
  );
};

export default SearchBar;
