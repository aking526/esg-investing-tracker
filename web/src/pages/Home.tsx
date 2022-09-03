import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { ICompanyData } from "../types/ICompanyData";
import RankingsLoading from "../components/Rankings/RankingsLoading";
import Rankings from "../components/Rankings/Rankings";
import DataRefToText from "../mods/DataRefToText";
import MetricBtn from "../components/MetricBtn";
import CompanyApi from "../api/companyApi";
import { useQuery } from "react-query";

const defaultMetric = "total_score";
const FilterBtnStyles = "border-2 rounded-xl border-black p-1 my-0.5";

const Home: React.FC = () => {
  const [rankings, setRankings] = useState<ICompanyData[]>([]);
  const [rankingsLoaded, setRankingsLoaded] = useState<boolean>(false);
  const [metric, setMetric] = useState<string>(defaultMetric);

  const names = useQuery(["names"], CompanyApi.getNames);

  useEffect(() => {
    const reFetchRankings = async () => {
      const res = await axios.get(`http://localhost:8000/companies/sort/${metric}`);
      setRankings(res.data);
    };

    setRankingsLoaded(false);
    reFetchRankings().then(() => setRankingsLoaded(true));
  }, [metric]);

  return (
    <div className="relative w-screen bg-white mt-5">
      { !names.isLoading ? <SearchBar
        placeholder="Search by ticker or name..."
        data={names.data}
        styles={{
          containerWidth: "w-72",
          width: "w-64",
          inputHeight: "h-14",
          inputTextSize: "text-lg",
          inputPlaceholderTextSize: "text-base",
          ulHeight: "h-48",
          liTextSize: "text-lg",
          searchIconSize: "text-base"
        }} />
          :
          <div className="h-16 my-5" />
      }
      <div className="relative">
        {rankingsLoaded ?
          <div className="flex flex-row">
            <div className="font-modern border-2 w-fit m-2 p-2">
              <u className="text-xl">Metrics:</u>
              <MetricBtn
                text="Total Score"
                thisMetric={"total_score"}
                currMetric={metric}
                setMetric={setMetric}
                styles={FilterBtnStyles}
              />
              <MetricBtn
                text="Environment Score"
                thisMetric={"environment_score"}
                currMetric={metric}
                setMetric={setMetric}
                styles={FilterBtnStyles}
              />
              <MetricBtn
                text="Social Score"
                thisMetric={"social_score"}
                currMetric={metric}
                setMetric={setMetric}
                styles={FilterBtnStyles}
              />
              <MetricBtn
                text="Governance Score"
                thisMetric={"governance_score"}
                currMetric={metric}
                setMetric={setMetric}
                styles={FilterBtnStyles}
              />
            </div>
            <Rankings rankings={rankings} metric={metric} />
          </div>
            : <RankingsLoading metric={DataRefToText[metric]} /> }
      </div>
    </div>
  );
};

export default Home;
