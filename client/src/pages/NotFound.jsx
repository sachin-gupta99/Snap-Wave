import React from "react";
import classes from "./NotFound.module.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Typewriter from "typewriter-effect";

const NotFound = () => {
  return (
    <div className={classes["container"]}>
      <Navbar />
      <main>
        <div className={classes["not-found"]}>
          <img
            src="https://imgs.search.brave.com/zlc8UaO50eQF9W43h4Y5szCYsunuiWEVWxveUAkrKiY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9vdWNo/LWNkbjIuaWNvbnM4/LmNvbS92ZVFVVWQ0/UVdFeFNZUnBuMFQ2/enN1cExoU2ZQWWl0/RkZZSXdkOE12Sl9N/L3JzOmZpdDozNjg6/MzY4L2N6TTZMeTlw/WTI5dWN6Z3UvYjNW/amFDMXdjbTlrTG1G/ei9jMlYwY3k5d2Jt/Y3ZOVFUyL0wyTTBZ/VE14T0RJMkxXTTUv/TVdFdE5EWTVNQzA0/TkdFMi9MVEprTUdK/ak9UZGtNV001L1lp/NXdibWMucG5n"
            alt="404"
          />
          <h1>Why are you here?</h1>
          <div className={classes["not-found-text"]}>
            <h2>
              {`Maybe `}
              <span className={classes["highlight"]}>...</span>{" "}
            </h2>
            <Typewriter
              options={{
                strings: [
                  "You're lost",
                  "You're confused",
                  "You're bored",
                  "You're curious",
                  "You're a developer",
                  "You're a hacker",
                ],
                cursor: "_",
                autoStart: true,
                delay: 100,
                deleteSpeed: 40,
                stringSplitter: " ",
                loop: true,
                wrapperClassName: classes["typewriter-text"],
              }}
            />
          </div>
        </div>
      </main>
      <footer className={classes["footer"]}>
        <Link to="/">
          <button>Go Back {"->"}</button>
        </Link>
      </footer>
    </div>
  );
};

export default NotFound;
