import React, { useState, useEffect } from "react";
import axios from "../Files/axios";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";
import Dialog from "@material-ui/core/Dialog";
import { IconButton, useMediaQuery, useTheme } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchURL, isVerticalAndLargeRow, Row_id }) => {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchURL);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchURL]);

  const opts = {
    height: "550px",
    width: "100%",
    playvars: {
      autoplay: 1,
    },
  };

  const clickHandler = (movie) => {
    console.log(movie);
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      console.log(
        `Name: ${movie?.name} + ' ' + Original-title:  ${movie?.original_title} +  ' '  + Title: ${movie?.title}`
      );
      movieTrailer(movie?.name || movie?.original_title || movie?.title || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row__mainContainer" id={Row_id}>
      <h2 className="rowTitle">{title}</h2>

      <div className="row__postersContainer" id="row__postersContainer">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => clickHandler(movie)}
            className={`rowPoster ${isVerticalAndLargeRow && "largePoster"}`}
            src={`${base_url}${
              isVerticalAndLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && (
        <div
          className="youtubeVideo__close"
          style={{
            position: "fixed",
            top: "1rem",
            left: "50%",
            zIndex: "111111",
          }}
        >
          <IconButton
            data-aos="fade-down"
            data-aos-delay="1500"
            data-aos-duration="750"
            color="secondary"
            className="youtubeVideo__closeIcon"
            onClick={() => {
              setTrailerUrl("");
            }}
          >
            <Close fontSize="large" style={{ color: "lightgray" }} />
          </IconButton>
        </div>
      )}

      <Dialog open={trailerUrl} fullWidth maxWidth="lg">
        <div className="youtube__embedContainer">
          {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
      </Dialog>
    </div>
  );
};

export default Row;
