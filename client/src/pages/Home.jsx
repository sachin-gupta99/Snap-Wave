import React from "react";
import styles from "./Home.module.css"; // Import your CSS module
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const username = useSelector((state) => state.user.user? state.user.user.username: "Username");

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Snap-Wave at your service</h1>
        <p className={styles.tagline}>Connect. Chat. Enjoy.</p>
      </header>

      <section className={styles.main}>
        <h2 className={styles.welcome}>Welcome {username}!</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <i className={`${styles.icon} fas fa-comment-dots`}></i>
            <h3>Private Messaging</h3>
            <p>Chat securely with friends and family.</p>
          </div>
          <div className={styles.feature}>
            <i className={`${styles.icon} fas fa-users`}></i>
            <h3>Send Requests</h3>
            <p>Add friends to increase your team or social circle.</p>
          </div>
          <div className={styles.feature}>
            <i className={`${styles.icon} fas fa-globe`}></i>
            <h3>Catchy Stats</h3>
            <p>Visualize your chatting stats on the go.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <button className={styles.logoutButton}>
          {" "}
          <Link to={"/chat"}>Start Chatting --{">"}</Link>
        </button>
      </footer>
    </div>
  );
};

export default Home;
