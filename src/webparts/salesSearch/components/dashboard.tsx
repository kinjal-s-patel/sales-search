import * as React from 'react';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faBuilding, faGlobeEurope  } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';
import styles from './dashboard.module.scss';
import { useNavigate } from 'react-router-dom';

// Card Component
const StatCard: React.FC<{ title: string; icon: any; onClick?: () => void }> = ({ title, icon, onClick }) => (
  <button className={styles.statCard} onClick={onClick}>
    <div className={styles.statIcon}><FontAwesomeIcon icon={icon} /></div>
    <div className={styles.statTitle}>{title}</div>
  </button>
);

const Dashboard: React.FC = () => {

    const navigate = useNavigate();

const navigateTo = (path: string) => {
  navigate(path);
};


  // Hide SharePoint default header/nav for full-screen dashboard
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #SuiteNavWrapper,
      #spSiteHeader,
      #spLeftNav,
      .spAppBar,
      .sp-appBar,
      .sp-appBar-mobile,
      div[data-automation-id="pageCommandBar"],
      div[data-automation-id="pageHeader"],
      div[data-automation-id="pageFooter"] {
        display: none !important;
        height: 0 !important;
        overflow: hidden !important;
      }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #fff !important;
      }

      #spPageCanvasContent, .CanvasComponent, .CanvasZone, .CanvasSection, .control-zone {
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100vw !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
     <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "auto",
        backgroundColor: "#fff",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
    <div className={styles.dashboardWrapper}>
      {/* Header */}
<header className={styles.header}>
  {/* Logo */}
  <div className={styles.logo}>
    <img src={logo} alt="Logo" style={{ width: 120, height: "auto" }} />
  </div>

  {/* Title Block */}
  <div className={styles.titleBlock}>
    <h1>JMS Sales Data </h1>
    <p>Quickly search sales data by region — India, USA, or Europe.</p>
  </div>
</header>


      <section className={styles.statsContainer}>
        <div className={styles.cardWrapper}>
  <StatCard
    title="India Data"
    icon={faFlag}
    onClick={() => navigateTo("/salesform")}
  />
</div>

<div className={styles.cardWrapper}>
  <StatCard
    title="USA Data"
    icon={faBuilding}
    onClick={() => navigateTo("/usa-search")}
  />
</div>

<div className={styles.cardWrapper}>
  <StatCard
    title="Europe Data"
    icon={faGlobeEurope}
    onClick={() => navigateTo("/EuropeSales")}
  />
</div>

      </section>

      <footer className={styles.footer}>
        © 2025 JMS Sales Data. All rights reserved.
      </footer>
    </div>
    </div>
  );
};

export default Dashboard;
