import React, { useEffect, useState } from "react";
import "./Recommended.css";
import { API_KEY, value_calculater } from "../../data";
import moment from "moment";
import { Link } from "react-router-dom";

const Recommended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items));
  };
  console.log("apiData", apiData);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="recommended">
      {apiData.map((item, index) => {
        return (
          <Link
            to={`/video/${item.snippet.categoryId}/${item.id}`}
            key={index}
            className="side-video-list"
          >
            <img src={item.snippet.thumbnails.default.url} alt="thumbnails" />
            <div className="vid-info">
              <h4>{item?.snippet.title}</h4>
              <p>{item?.snippet.channelTitle}</p>
              <p>
                {value_calculater(item?.statistics.viewCount)} Views &bull;{" "}
                {moment(item?.snippet.publishedAt).fromNow()}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Recommended;
