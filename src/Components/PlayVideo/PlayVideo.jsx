import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
// import PlayVideo from '../../Components/PlayVideo/PlayVideo'
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
// import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY, value_calculater } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
    await fetch(videoDetails_url)
      .then((res) => res.json())
      .then((data) => setApiData(data.items[0]));
  };

  const fetchOtherData = async () => {
    if (!apiData) return;
    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelID}&key=${API_KEY}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => setChannelData(data.items));
  };

  const fetchCommentData = async () => {
    const videoUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;
    await fetch(videoUrl)
      .then((res) => res.json())
      .then((data) => setCommentData(data.items));
  };

  useEffect(() => {
    fetchData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
    fetchCommentData();
  }, [apiData]);
  
  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "title here"}</h3>
      <div className="play-video-info">
        <p>
          {value_calculater(apiData ? apiData.statistics.viewCount : "16K")}
          views &bull;
          {moment(apiData ? apiData.snippet.publishedAt : "").fromNow()}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {apiData ? value_calculater(apiData.statistics.likeCount) : "155"}
          </span>
          <span>
            <img src={dislike} alt="" />2
          </span>
          <span>
            <img src={share} alt="" />
            share
          </span>
          <span>
            <img src={save} alt="" />
            save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={apiData?.snippet.thumbnails.default.url? apiData?.snippet.thumbnails.medium.url : apiData?.snippet.thumbnails.default.url}
          alt="thumbnails"
        />
        <div>
          <p>{apiData?.snippet.channelTitle}</p>
          <span>
            {channelData ? channelData.statistics.subscriberCount : "5M"}
            subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 500)
            : "description Here"}
        </p>
        <hr />
        <h4>{value_calculater(apiData?.statistics.commentCount)} comments</h4>
        {commentData.length > 0 &&
          commentData.map((item, index) => {
            return (
              <div key={index} className="comment">
                <img
                  src={
                    item.snippet.topLevelComment.snippet.authorProfileImageUrl
                      ? item.snippet.topLevelComment.snippet
                          .authorProfileImageUrl
                      : user_profile
                  }
                  alt=""
                />
                <div>
                  <h3>
                    {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                    <span>
                      {moment(
                        item.snippet.topLevelComment.snippet.publishedAt
                      ).fromNow()}
                    </span>
                  </h3>
                  <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                  <div className="comment-action">
                    <img src={like} alt="" />
                    <span>
                      {value_calculater(
                        item.snippet.topLevelComment.snippet.likeCount
                      )}
                    </span>
                    <img src={dislike} alt="" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PlayVideo;
